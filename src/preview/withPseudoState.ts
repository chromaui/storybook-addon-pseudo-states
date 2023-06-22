/* eslint-env browser */
import {
  DOCS_RENDERED,
  STORY_CHANGED,
  STORY_RENDERED,
  UPDATE_GLOBALS,
} from "@storybook/core-events"
import { DecoratorFunction } from "@storybook/types"
import { addons, useEffect, useMemo } from "@storybook/preview-api"

import { PSEUDO_STATES, PseudoState, SELECTOR_LIMIT_PARAMETER } from "../constants"
import { rewriteStyleSheet } from "./rewriteStyleSheet"

let selectorLimit: number | undefined
const channel = addons.getChannel()
const shadowHosts = new Set<Element>()

// Drops any existing pseudo state classnames that carried over from a previously viewed story
// before adding the new classnames. We use forEach for IE compatibility.
const applyClasses = (element: Element, classnames: Set<string>) => {
  Object.values(PSEUDO_STATES).forEach((state) => element.classList.remove(`pseudo-${state}`))
  classnames.forEach((classname) => element.classList.add(classname))
}

const applyParameter = (rootElement: Element, parameter: object) => {
  const map = new Map([[rootElement, new Set<PseudoState>()]])
  const add = (target: Element, state: PseudoState) =>
    map.set(target, new Set([...(map.get(target) || []), state]))

  ;(Object.entries(parameter || {}) as [PseudoState, any]).forEach(([state, value]) => {
    if (typeof value === "boolean") {
      // default API - applying pseudo class to root element.
      if (value) add(rootElement, state)
    } else if (typeof value === "string") {
      // explicit selectors API - applying pseudo class to a specific element
      rootElement.querySelectorAll(value).forEach((el) => add(el, state))
    } else if (Array.isArray(value)) {
      // explicit selectors API - we have an array (of strings) recursively handle each one
      value.forEach((sel) => rootElement.querySelectorAll(sel).forEach((el) => add(el, state)))
    }
  })

  map.forEach((states, target) => {
    const classnames = new Set<string>()
    states.forEach((key) => PSEUDO_STATES[key] && classnames.add(`pseudo-${PSEUDO_STATES[key]}`))
    applyClasses(target, classnames)
  })
}

// Traverses ancestry to collect relevant pseudo classnames, and applies them to the shadow host.
// Shadow DOM can only access classes on its host. Traversing is needed to mimic the CSS cascade.
const updateShadowHost = (shadowHost: Element) => {
  const classnames = new Set<string>()
  for (let element = shadowHost.parentElement; element; element = element.parentElement) {
    if (!element.className) continue
    element.className
      .split(" ")
      .filter((classname) => classname.indexOf("pseudo-") === 0)
      .forEach((classname) => classnames.add(classname))
  }
  applyClasses(shadowHost, classnames)
}

// Global decorator that rewrites stylesheets and applies classnames to render pseudo styles
export const withPseudoState: DecoratorFunction = (
  StoryFn,
  { viewMode, parameters, id, globals: globalsArgs }
) => {
  const { pseudo: parameter } = parameters
  const { pseudo: globals } = globalsArgs

  const canvasElement = useMemo(() => {
    if (viewMode === "docs") {
      return document.getElementById(`story--${id}`)
    }
    return (
      document.getElementById("storybook-root") || // Storybook 7.0+
      document.getElementById("root")
    )
  }, [viewMode, id])

  // Sync parameter to globals, used by the toolbar (only in canvas as this
  // doesn't make sense for docs because many stories are displayed at once)
  useEffect(() => {
    if (parameter !== globals && viewMode === "story") {
      channel.emit(UPDATE_GLOBALS, {
        globals: { pseudo: parameter },
      })
    }
  }, [parameter, viewMode])

  // Convert selected states to classnames and apply them to the story root element.
  // Then update each shadow host to redetermine its own pseudo classnames.
  useEffect(() => {
    if (!canvasElement) return
    const timeout = setTimeout(() => {
      applyParameter(canvasElement, globals || parameter)
      shadowHosts.forEach(updateShadowHost)
    }, 0)
    return () => clearTimeout(timeout)
  }, [canvasElement, globals, parameter])

  selectorLimit =
    parameter && typeof parameter[SELECTOR_LIMIT_PARAMETER] === "number"
      ? parameter[SELECTOR_LIMIT_PARAMETER]
      : undefined

  return StoryFn()
}

// Rewrite CSS rules for pseudo-states on all stylesheets to add an alternative selector
const rewriteStyleSheets = (shadowRoot?: ShadowRoot) => {
  let styleSheets = Array.from(shadowRoot ? shadowRoot.styleSheets : document.styleSheets)
  if (shadowRoot?.adoptedStyleSheets?.length) styleSheets = shadowRoot.adoptedStyleSheets
  styleSheets.forEach((sheet) => rewriteStyleSheet(sheet, shadowRoot, shadowHosts, selectorLimit))
}

// Only track shadow hosts for the current story
channel.on(STORY_CHANGED, () => shadowHosts.clear())

// Reinitialize CSS enhancements every time the story changes
channel.on(STORY_RENDERED, () => rewriteStyleSheets())

// Reinitialize CSS enhancements every time a docs page is rendered
channel.on(DOCS_RENDERED, () => rewriteStyleSheets())

// IE doesn't support shadow DOM
if (Element.prototype.attachShadow) {
  // Monkeypatch the attachShadow method so we can handle pseudo styles inside shadow DOM
  // @ts-expect-error (Monkeypatch)
  Element.prototype._attachShadow = Element.prototype.attachShadow
  Element.prototype.attachShadow = function attachShadow(init) {
    // Force "open" mode, so we can access the shadowRoot
    // @ts-expect-error (Monkeypatch)
    const shadowRoot = this._attachShadow({ ...init, mode: "open" })
    // Wait for it to render and apply its styles before rewriting them
    requestAnimationFrame(() => {
      rewriteStyleSheets(shadowRoot)
      updateShadowHost(shadowRoot.host)
    })
    return shadowRoot
  }
}
