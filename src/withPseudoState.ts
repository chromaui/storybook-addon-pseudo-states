/* eslint-env browser */
import { addons, useEffect } from "@storybook/addons"
import {
  DOCS_RENDERED,
  STORY_CHANGED,
  STORY_RENDERED,
  UPDATE_GLOBALS,
} from "@storybook/core-events"
import { PSEUDO_STATES, type PSEUDO_STATE } from "./constants"
import { rewriteStyleSheet } from "./rewriteStyleSheet"
import { StoryContext } from "@storybook/types"

const channel = addons.getChannel()
const shadowHosts = new Set<HTMLElement>()

// Drops any existing pseudo state classnames that carried over from a previously viewed story
// before adding the new classnames. We do this the old-fashioned way, for IE compatibility.
const applyClasses = (element: Element, classnames: string[] | Set<string>) => {
  element.className = element.className
    .split(" ")
    .filter((classname: string | string[]) => classname && classname.indexOf("pseudo-") !== 0)
    .concat(...classnames)
    .join(" ")
}

const applyParameter = (
  rootElement: Element,
  parameter: { [s: string]: string | string[] } | ArrayLike<string | string[]>
) => {
  const map = new Map([[rootElement, new Set<keyof PSEUDO_STATE>()]])
  const add = (target: Element, state: keyof PSEUDO_STATE) =>
    map.set(target, new Set([...(map.get(target) || []), state]))

  Object.entries<string[] | string>(parameter || {}).forEach(([state, value]) => {
    if (typeof value === "boolean") {
      // default API - applying pseudo class to root element.
      add(rootElement, state as keyof PSEUDO_STATE)
    } else if (typeof value === "string") {
      // explicit selectors API - applying pseudo class to a specific element
      rootElement
        .querySelectorAll(value)
        .forEach((el) => add(el, state as keyof PSEUDO_STATE))
    } else if (Array.isArray(value)) {
      // explicit selectors API - we have an array (of strings) recursively handle each one
      value.forEach((sel) =>
        rootElement
          .querySelectorAll(sel)
          .forEach((el) => add(el, state as keyof PSEUDO_STATE))
      )
    }
  })

  map.forEach((states, target) => {
    const classnames: string[] = []
    states.forEach((key) => PSEUDO_STATES[key] && classnames.push(`pseudo-${PSEUDO_STATES[key]}`))
    applyClasses(target, classnames)
  })
}

// Traverses ancestry to collect relevant pseudo classnames, and applies them to the shadow host.
// Shadow DOM can only access classes on its host. Traversing is needed to mimic the CSS cascade.
const updateShadowHost = (shadowHost: HTMLElement) => {
  const classnames = new Set<string>()
  for (let element = shadowHost.parentElement; element; element = element.parentElement) {
    if (!element.className) continue
    element.className
      .split(" ")
      .filter((classname: string | string[]) => classname.indexOf("pseudo-") === 0)
      .forEach((classname: string) => classnames.add(classname))
  }
  applyClasses(shadowHost, classnames)
}

// Global decorator that rewrites stylesheets and applies classnames to render pseudo styles
export const withPseudoState = (
  StoryFn: () => string | Node,
  { viewMode, parameters, id, globals: globalsArgs }: StoryContext
) => {
  const { pseudo: parameter } = parameters
  const { pseudo: globals } = globalsArgs

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
    const timeout = setTimeout(() => {
      const element = document.getElementById(viewMode === "docs" ? `story--${id}` : `root`)
      if (element !== null) applyParameter(element, globals || parameter)
      shadowHosts.forEach(updateShadowHost)
    }, 0)
    return () => clearTimeout(timeout)
  }, [globals, parameter, viewMode])

  return StoryFn()
}

type Sheet = {
  __pseudoStatesRewritten?: boolean
} & CSSStyleSheet

// Rewrite CSS rules for pseudo-states on all stylesheets to add an alternative selector
const rewriteStyleSheets = (shadowRoot?: ShadowRoot) => {
  let styleSheets = shadowRoot ? shadowRoot.styleSheets : document.styleSheets
  // @ts-expect-error Property 'item' is missing in type 'CSSStyleSheet[]' but required in type 'StyleSheetList'
  if (shadowRoot?.adoptedStyleSheets?.length) styleSheets = shadowRoot.adoptedStyleSheets
  Array.from(styleSheets).forEach((sheet) => {
    if (shadowRoot !== undefined) rewriteStyleSheet(sheet, shadowRoot, shadowHosts)
  })
}

// Only track shadow hosts for the current story
channel.on(STORY_CHANGED, () => shadowHosts.clear())

// Reinitialize CSS enhancements every time the story changes
channel.on(STORY_RENDERED, () => rewriteStyleSheets())

// Reinitialize CSS enhancements every time a docs page is rendered
channel.on(DOCS_RENDERED, () => rewriteStyleSheets())
