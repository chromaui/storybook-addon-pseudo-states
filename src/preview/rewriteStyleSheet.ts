import { PSEUDO_STATES, EXCLUDED_PSEUDO_ELEMENT_PATTERNS } from "../constants"
import { splitSelectors } from "./splitSelectors"

const pseudoStates = Object.values(PSEUDO_STATES)
const matchOne = new RegExp(`:(${pseudoStates.join("|")})`)
const matchAll = new RegExp(`:(${pseudoStates.join("|")})`, "g")

const warnings = new Set()
const warnOnce = (message: string) => {
  if (warnings.has(message)) return
  // eslint-disable-next-line no-console
  console.warn(message)
  warnings.add(message)
}

const replacementRegExp = (pseudoState: string) =>
  new RegExp(`(?<!(${EXCLUDED_PSEUDO_ELEMENT_PATTERNS.join("|")})\\S*):${pseudoState}`, "g")

const rewriteRule = ({ cssText, selectorText }: CSSStyleRule, shadowRoot?: ShadowRoot) => {
  return cssText.replace(
    selectorText,
    splitSelectors(selectorText)
      .flatMap((selector) => {
        if (selector.includes(".pseudo-")) {
          return []
        }
        if (!matchOne.test(selector)) {
          return [selector]
        }

        const states: string[] = []
        let plainSelector = selector.replace(matchAll, (_, state) => {
          states.push(state)
          return ""
        })
        const classSelector = states.reduce((acc, state) => acc.replace(replacementRegExp(state), `.pseudo-${state}`), selector)

        let ancestorSelector = ""
        const statesAllClassSelectors = states.map((s) => `.pseudo-${s}-all`).join("")
        
        if (selector.startsWith(":host(")) {
          const matches = selector.match(/^:host\((\S+)\) /)
          if (matches && !matchOne.test(matches[1])) {
            // If :host() did not contain states, then simple replacement won't work.
            // E.g. :host(.foo#bar) .baz:hover:active -> :host(.foo#bar.pseudo-hover-all.pseudo-active-all) .baz
            ancestorSelector = `:host(${matches[1]}${statesAllClassSelectors}) ${plainSelector.replace(matches[0], "")}`
          } else {
            ancestorSelector = states.reduce((acc, state) => acc.replace(replacementRegExp(state), `.pseudo-${state}-all`), selector)
            // NOTE: Selectors with pseudo states on both :host and a descendant are not properly supported.
            // E.g. :host(.foo:focus) .bar:hover -> :host(.foo.pseudo-focus-all.pseudo-hover-all) .bar
          }
        } else if (selector.startsWith("::slotted(") || shadowRoot) {
          // If removing pseudo-state selectors from inside ::slotted left it empty (thus invalid), must fix it by adding '*'.
          ancestorSelector = `:host(${statesAllClassSelectors}) ${plainSelector.replace("::slotted()", "::slotted(*)")}`
        } else {
          ancestorSelector = `${statesAllClassSelectors} ${plainSelector}`
        }

        return [selector, classSelector, ancestorSelector].filter(
          (selector) => selector && !selector.includes(":not()") && !selector.includes(":has()")
        )
      })
      .join(", ")
  )
}

// Rewrites the style sheet to add alternative selectors for any rule that targets a pseudo state.
// A sheet can only be rewritten once, and may carry over between stories.
export const rewriteStyleSheet = (
  sheet: CSSStyleSheet,
  shadowRoot?: ShadowRoot
): boolean => {
  try {
    const maximumRulesToRewrite = 1000
    const count = rewriteRuleContainer(sheet, maximumRulesToRewrite, shadowRoot);
    
    if (count >= maximumRulesToRewrite) {
      warnOnce("Reached maximum of 1000 pseudo selectors per sheet, skipping the rest.")
    }

    return count > 0
  } catch (e) {
    if (String(e).includes("cssRules")) {
      warnOnce(`Can't access cssRules, likely due to CORS restrictions: ${sheet.href}`)
    } else {
      // eslint-disable-next-line no-console
      console.error(e, sheet.href)
    }
    return false
  }
}

const rewriteRuleContainer = (
  ruleContainer: CSSStyleSheet | CSSGroupingRule,
  rewriteLimit: number,
  shadowRoot?: ShadowRoot
): number => {
  let count = 0
  let index = -1
  for (const cssRule of ruleContainer.cssRules) {
    index++
    let numRewritten = 0

    // @ts-expect-error
    if (cssRule.__processed) {
      // @ts-expect-error
      numRewritten = cssRule.__pseudoStatesRewrittenCount
    } else {
      if ("cssRules" in cssRule && (cssRule.cssRules as CSSRuleList).length) {
        numRewritten = rewriteRuleContainer(cssRule as CSSGroupingRule, rewriteLimit - count, shadowRoot)
      } else {
        if (!("selectorText" in cssRule)) continue
        const styleRule = cssRule as CSSStyleRule
        if (matchOne.test(styleRule.selectorText)) {
          const newRule = rewriteRule(styleRule, shadowRoot)
          ruleContainer.deleteRule(index)
          ruleContainer.insertRule(newRule, index)
          numRewritten = 1
        }
      }
      // @ts-expect-error
      cssRule.__processed = true
      // @ts-expect-error
      cssRule.__pseudoStatesRewrittenCount = numRewritten
    }
    count += numRewritten

    if (count >= rewriteLimit) {
      break
    }
  }

  return count
}
