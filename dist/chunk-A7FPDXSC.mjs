// src/constants.ts
var ADDON_ID = "storybook/pseudo-states";
var TOOL_ID = `${ADDON_ID}/tool`;
var EXCLUDED_PSEUDO_ELEMENTS = ["::-webkit-scrollbar-thumb"];
var PSEUDO_STATES = {
  hover: "hover",
  active: "active",
  focusVisible: "focus-visible",
  focusWithin: "focus-within",
  focus: "focus",
  visited: "visited",
  link: "link",
  target: "target"
};

export {
  ADDON_ID,
  TOOL_ID,
  EXCLUDED_PSEUDO_ELEMENTS,
  PSEUDO_STATES
};
