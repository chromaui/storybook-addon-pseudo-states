export const ADDON_ID = "storybook/pseudo-states"
export const TOOL_ID = `${ADDON_ID}/tool`
export const PARAM_KEY = "pseudo"

// Pseudo-elements which are not allowed to have classes applied on them
// E.g. ::-webkit-scrollbar-thumb.pseudo-hover is not a valid selector
export const EXCLUDED_PSEUDO_ELEMENTS = ["::-webkit-scrollbar-thumb"]

// Dynamic pseudo-classes
// @see https://www.w3.org/TR/2018/REC-selectors-3-20181106/#dynamic-pseudos
export const PSEUDO_STATES = {
  hover: "hover",
  active: "active",
  focusVisible: "focus-visible",
  focusWithin: "focus-within",
  focus: "focus", // must come after its alternatives
  visited: "visited",
  link: "link",
  target: "target",
  "ancestor-hover": "ancestor-hover",
  "ancestor-active": "ancestor-active",
  "ancestor-focusVisible": "ancestor-focus-visible",
  "ancestor-focusWithin": "ancestor-focus-within",
  "ancestor-focus": "ancestor-focus", // must come after its alternatives
  "ancestor-visited": "ancestor-visited",
  "ancestor-link": "ancestor-link",
  "ancestor-target": "ancestor-target",
  
} as const

export type PseudoState = keyof typeof PSEUDO_STATES
