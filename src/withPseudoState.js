import { addons, useArgs, useEffect, useGlobals } from "@storybook/addons"
import { STORY_CHANGED, STORY_RENDERED } from "@storybook/core-events"

import { PSEUDO_STATES } from "./constants"

const pseudoStates = Object.values(PSEUDO_STATES)
const matchOne = new RegExp(`:(${pseudoStates.join("|")})`)
const matchAll = new RegExp(`:(${pseudoStates.join("|")})`, "g")

// Drops any existing pseudo state classnames that carried over from a previously viewed story
// before adding the new classnames. We do this the old-fashioned way, for IE compatibility.
const applyClasses = (element, classnames) => {
  element.className = element.className
    .split(" ")
    .filter((classname) => classname && classname.indexOf("pseudo-") !== 0)
    .concat(...classnames)
    .join(" ")
}

// Traverses ancestry to collect relevant pseudo classnames, and applies them to the shadow host.
// Shadow DOM can only access classes on its host. Traversing is needed to mimic the CSS cascade.
const updateShadowHost = (shadowHost) => {
  const classnames = new Set()
  for (let element = shadowHost.parentElement; element; element = element.parentElement) {
    if (!element.className) continue
    element.className
      .split(" ")
      .filter((classname) => classname.indexOf("pseudo-") === 0)
      .forEach((classname) => classnames.add(classname))
  }
  applyClasses(shadowHost, classnames)
}

// Keep track of attached shadow host elements for the current story
const shadowHosts = new Set()
addons.getChannel().on(STORY_CHANGED, () => shadowHosts.clear())

// Global decorator that rewrites stylesheets and applies classnames to render pseudo styles
export const withPseudoState = (StoryFn) => {
  const [{ pseudo: args }] = useArgs()
  const [{ pseudo: globals }, updateGlobals] = useGlobals()

  // Sync args to globals, used by the toolbar
  useEffect(() => {
    if (args !== globals) updateGlobals({ pseudo: args })
  }, [args])

  // Convert selected states to classnames and apply them to the story root element.
  // Then update each shadow host to redetermine its own pseudo classnames.
  useEffect(() => {
    applyClasses(
      document.getElementById("root"),
      Object.entries(globals || {})
        .filter(([_, value]) => value)
        .map(([key]) => `pseudo-${PSEUDO_STATES[key]}`)
    )
    shadowHosts.forEach(updateShadowHost)
  }, [globals])

  return StoryFn()
}

const warnings = new Set()
const warnOnce = (message) => {
  if (warnings.has(message)) return
  // eslint-disable-next-line no-console
  console.warn(message)
  warnings.add(message)
}

// Rewrite CSS rules for pseudo-states on all stylesheets to add an alternative selector
function rewriteStyleSheets(shadowRoot) {
  for (const sheet of (shadowRoot || document).styleSheets) {
    try {
      let index = 0
      for (const { cssText, selectorText } of sheet.cssRules) {
        if (matchOne.test(selectorText)) {
          const newRule = cssText.replace(
            selectorText,
            selectorText
              .split(", ")
              .flatMap((selector) => {
                if (selector.includes(`.pseudo-`)) return []
                const states = []
                const plainSelector = selector.replace(matchAll, (_, state) => {
                  states.push(`.pseudo-${state}`)
                  return ""
                })
                const stateSelector = shadowRoot
                  ? `:host(${states.join("")}) ${plainSelector}`
                  : `${states.join("")} ${plainSelector}`
                return [selector, stateSelector]
              })
              .join(", ")
          )
          sheet.deleteRule(index)
          sheet.insertRule(newRule, index)
          if (shadowRoot) shadowHosts.add(shadowRoot.host)
        }
        index++
      }
    } catch (e) {
      if (e.toString().includes("cssRules")) {
        warnOnce(`Can't access cssRules, likely due to CORS restrictions: ${sheet.href}`)
      } else {
        // eslint-disable-next-line no-console
        console.error(e, sheet.href)
      }
    }
  }
}

// Reinitialize CSS enhancements every time the story changes
addons.getChannel().on(STORY_RENDERED, () => rewriteStyleSheets())

// IE doesn't support shadow DOM
if (Element.prototype.attachShadow) {
  // Monkeypatch the attachShadow method so we can handle pseudo styles inside shadow DOM
  Element.prototype._attachShadow = Element.prototype.attachShadow
  Element.prototype.attachShadow = function attachShadow(init) {
    // Force "open" mode, so we can access the shadowRoot
    const shadowRoot = this._attachShadow({ ...init, mode: "open" })
    // Wait for it to render and apply its styles before rewriting them
    requestAnimationFrame(() => {
      rewriteStyleSheets(shadowRoot)
      updateShadowHost(shadowRoot.host)
    })
    return shadowRoot
  }
}
