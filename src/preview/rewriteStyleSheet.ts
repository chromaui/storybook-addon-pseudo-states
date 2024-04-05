import { PSEUDO_STATES, EXCLUDED_PSEUDO_ELEMENT_PATTERNS } from "../constants"
import { splitSelectors } from "./splitSelectors"

const pseudoStateRegExp = (global: boolean, pseudoStates: string[]) =>
  new RegExp(`(?<!(?:${EXCLUDED_PSEUDO_ELEMENT_PATTERNS.join("|")})\\S*):(${pseudoStates.join("|")})`, global ? "g" : undefined)
const pseudoStates = Object.values(PSEUDO_STATES)
const matchOne = pseudoStateRegExp(false, pseudoStates)
const matchAll = pseudoStateRegExp(true, pseudoStates)
const replacementRegExp = (pseudoState: string) => pseudoStateRegExp(true, [pseudoState])

const warnings = new Set()
const warnOnce = (message: string) => {
  if (warnings.has(message)) return
  // eslint-disable-next-line no-console
  console.warn(message)
  warnings.add(message)
}

const replacePseudoStates = (selector: string, allClass?: boolean) => {
  return pseudoStates.reduce((acc, state) => acc.replace(replacementRegExp(state), `.pseudo-${state}${allClass ? "-all" : ""}`), selector)
}

// Does not handle :host() or :not() containing pseudo-states. Need to call replaceNotSelectors on the input first.
const replacePseudoStatesWithAncestorSelector = (selector: string, forShadowDOM: boolean, additionalHostSelectors?: string) => {
  const { states, withoutPseudoStates } = extractPseudoStates(selector)
  const classes = states.map((s) => `.pseudo-${s}-all`).join("")
  return states.length === 0 && !additionalHostSelectors
    ? selector
    : forShadowDOM
      ? `:host(${additionalHostSelectors ?? ""}${classes}) ${withoutPseudoStates}`
      : `${classes} ${withoutPseudoStates}`
}

const extractPseudoStates = (selector: string) => {
  const states = new Set()
  const withoutPseudoStates = selector
    .replace(matchAll, (_, state) => {
      states.add(state)
      return ""
    })
    // If removing pseudo-state selectors from inside a functional selector left it empty (thus invalid), must fix it by adding '*'.
    .replaceAll("()", "(*)")
    // If a selector list was left with blank items (e.g. ", foo, , bar, "), remove the extra commas/spaces.
    .replace(/(?<=[\s(]),\s+|(,\s+)+(?=\))/g, "") || "*"

  return {
    states: Array.from(states),
    withoutPseudoStates
  }
}

const rewriteNotSelectors = (selector: string, forShadowDOM: boolean) => {
  return [...selector.matchAll(/:not\(([^)]+)\)/g)].reduce((acc, match) => {
    const originalNot = match[0]
    const selectorList = match[1]
    const rewrittenNot = rewriteNotSelector(selectorList, forShadowDOM)
    return acc.replace(originalNot, rewrittenNot)
  }, selector)
}

const rewriteNotSelector = (negatedSelectorList: string, forShadowDOM: boolean) => {
  const rewrittenSelectors: string[] = []
  // For each negated selector
  for (const negatedSelector of negatedSelectorList.split(/,\s*/)) {
    // :not cannot be nested and cannot contain pseudo-elements, so no need to worry about that.
    // Also, there's no compelling use case for :host() inside :not(), so we don't handle that.
    rewrittenSelectors.push(replacePseudoStatesWithAncestorSelector(negatedSelector, forShadowDOM))
  }
  return `:not(${rewrittenSelectors.join(", ")})`
}

const rewriteRule = ({ cssText, selectorText }: CSSStyleRule, forShadowDOM: boolean) => {
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

        const classSelector = replacePseudoStates(selector)
        let ancestorSelector = ""
        
        if (selector.startsWith(":host(")) {
          const matches = selector.match(/^:host\((\S+)\)\s+(.+)$/)
          if (matches && matchOne.test(matches[2])) {
            // Simple replacement won't work on pseudo-state selectors outside of :host().
            // E.g. :host(.foo) .bar:hover -> :host(.foo.pseudo-hover-all) .bar
            // E.g. :host(.foo:focus) .bar:hover -> :host(.foo.pseudo-focus-all.pseudo-hover-all) .bar
            let hostInnerSelector = matches[1]
            let descendantSelector = matches[2]
            // Simple replacement is fine for pseudo-state selectors inside :host() (even if inside :not()).
            hostInnerSelector = replacePseudoStates(hostInnerSelector, true)
            // Rewrite any :not selectors in the descendant selector.
            descendantSelector = rewriteNotSelectors(descendantSelector, true)
            // Any remaining pseudo-states in the descendant selector need to be moved into the host selector.
            ancestorSelector = replacePseudoStatesWithAncestorSelector(descendantSelector, true, hostInnerSelector)
          } else {
            // Don't need to specially handle :not() because:
            //  - if inside :host(), simple replacement is sufficient
            //  - if outside :host(), didn't match any pseudo-states
            ancestorSelector = replacePseudoStates(selector, true)
          }
        } else {
          const withNotsReplaced = rewriteNotSelectors(selector, forShadowDOM)
          ancestorSelector = replacePseudoStatesWithAncestorSelector(withNotsReplaced, forShadowDOM)
        }

        return [selector, classSelector, ancestorSelector]
      })
      .join(", ")
  )
}

// Rewrites the style sheet to add alternative selectors for any rule that targets a pseudo state.
// A sheet can only be rewritten once, and may carry over between stories.
export const rewriteStyleSheet = (
  sheet: CSSStyleSheet,
  forShadowDOM = false
): boolean => {
  try {
    const maximumRulesToRewrite = 1000
    const count = rewriteRuleContainer(sheet, maximumRulesToRewrite, forShadowDOM);
    
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
  forShadowDOM: boolean
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
        numRewritten = rewriteRuleContainer(cssRule as CSSGroupingRule, rewriteLimit - count, forShadowDOM)
      } else {
        if (!("selectorText" in cssRule)) continue
        const styleRule = cssRule as CSSStyleRule
        if (matchOne.test(styleRule.selectorText)) {
          const newRule = rewriteRule(styleRule, forShadowDOM)
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
