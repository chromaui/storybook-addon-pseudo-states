import { addons, types } from "@storybook/addons"

import { ADDON_ID, TOOL_ID } from "../constants"
import { PseudoStateSelector } from "../PseudoStateSelector"

addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: "CSS pseudo states",
    match: ({ viewMode }) => viewMode === "story",
    render: PseudoStateSelector,
  })
})
