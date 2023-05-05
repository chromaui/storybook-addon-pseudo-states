import {
  ADDON_ID,
  PSEUDO_STATES,
  TOOL_ID
} from "./chunk-A7FPDXSC.mjs";

// src/manager.ts
import { addons, types } from "@storybook/manager-api";

// src/manager/PseudoStateTool.tsx
import React, { useCallback } from "react";
import { Icons, IconButton, WithTooltip, TooltipLinkList } from "@storybook/components";
import { useGlobals } from "@storybook/manager-api";
import { styled, color } from "@storybook/theming";
var LinkTitle = styled.span(({ active }) => ({
  color: active ? color.secondary : "inherit"
}));
var LinkIcon = styled(Icons)(({ active }) => ({
  opacity: active ? 1 : 0,
  path: { fill: active ? color.secondary : "inherit" }
}));
var options = Object.keys(PSEUDO_STATES).sort();
var PseudoStateTool = () => {
  const [{ pseudo }, updateGlobals] = useGlobals();
  const isActive = useCallback((option) => {
    if (!pseudo)
      return false;
    return pseudo[option] === true;
  }, [pseudo]);
  const toggleOption = useCallback(
    (option) => () => updateGlobals({ pseudo: { ...pseudo, [option]: !isActive(option) } }),
    [pseudo]
  );
  return /* @__PURE__ */ React.createElement(
    WithTooltip,
    {
      placement: "top",
      trigger: "click",
      tooltip: () => /* @__PURE__ */ React.createElement(
        TooltipLinkList,
        {
          links: options.map((option) => ({
            id: option,
            title: /* @__PURE__ */ React.createElement(LinkTitle, { active: isActive(option) }, ":", PSEUDO_STATES[option]),
            right: /* @__PURE__ */ React.createElement(LinkIcon, { icon: "check", width: 12, height: 12, active: isActive(option) }),
            onClick: toggleOption(option),
            active: isActive(option)
          }))
        }
      )
    },
    /* @__PURE__ */ React.createElement(
      IconButton,
      {
        key: "pseudo-state",
        title: "Select CSS pseudo states",
        active: options.some(isActive)
      },
      /* @__PURE__ */ React.createElement(Icons, { icon: "button" })
    )
  );
};

// src/manager.ts
addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "CSS pseudo states",
    match: ({ viewMode }) => viewMode === "story",
    render: PseudoStateTool
  });
});
