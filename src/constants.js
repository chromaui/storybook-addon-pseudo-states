export const ADDON_ID = "storybook/pseudo-states"
export const TOOL_ID = `${ADDON_ID}/tool`

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
}

export const RE_WRITE_STYLESHEET = "rewriteStyleSheet"
