"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/manager.ts
var import_manager_api2 = require("@storybook/manager-api");

// src/constants.ts
var ADDON_ID = "storybook/pseudo-states";
var TOOL_ID = `${ADDON_ID}/tool`;
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

// src/manager/PseudoStateTool.tsx
var import_react = __toESM(require("react"));
var import_components = require("@storybook/components");
var import_manager_api = require("@storybook/manager-api");
var import_theming = require("@storybook/theming");
var LinkTitle = import_theming.styled.span(({ active }) => ({
  color: active ? import_theming.color.secondary : "inherit"
}));
var LinkIcon = (0, import_theming.styled)(import_components.Icons)(({ active }) => ({
  opacity: active ? 1 : 0,
  path: { fill: active ? import_theming.color.secondary : "inherit" }
}));
var options = Object.keys(PSEUDO_STATES).sort();
var PseudoStateTool = () => {
  const [{ pseudo }, updateGlobals] = (0, import_manager_api.useGlobals)();
  const isActive = (0, import_react.useCallback)((option) => {
    if (!pseudo)
      return false;
    return pseudo[option] === true;
  }, [pseudo]);
  const toggleOption = (0, import_react.useCallback)(
    (option) => () => updateGlobals({ pseudo: { ...pseudo, [option]: !isActive(option) } }),
    [pseudo]
  );
  return /* @__PURE__ */ import_react.default.createElement(
    import_components.WithTooltip,
    {
      placement: "top",
      trigger: "click",
      tooltip: () => /* @__PURE__ */ import_react.default.createElement(
        import_components.TooltipLinkList,
        {
          links: options.map((option) => ({
            id: option,
            title: /* @__PURE__ */ import_react.default.createElement(LinkTitle, { active: isActive(option) }, ":", PSEUDO_STATES[option]),
            right: /* @__PURE__ */ import_react.default.createElement(LinkIcon, { icon: "check", width: 12, height: 12, active: isActive(option) }),
            onClick: toggleOption(option),
            active: isActive(option)
          }))
        }
      )
    },
    /* @__PURE__ */ import_react.default.createElement(
      import_components.IconButton,
      {
        key: "pseudo-state",
        title: "Select CSS pseudo states",
        active: options.some(isActive)
      },
      /* @__PURE__ */ import_react.default.createElement(import_components.Icons, { icon: "button" })
    )
  );
};

// src/manager.ts
import_manager_api2.addons.register(ADDON_ID, () => {
  import_manager_api2.addons.add(TOOL_ID, {
    type: import_manager_api2.types.TOOL,
    title: "CSS pseudo states",
    match: ({ viewMode }) => viewMode === "story",
    render: PseudoStateTool
  });
});
