import React from "react"

import { CustomElementNested } from "./CustomElementNested"
import "./grid.css"

export default {
  title: "Example/CustomElementNested",
  component: CustomElementNested,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

const Template = () => <custom-element-nested>Custom element nested</custom-element-nested>

export const All = () => (
  <div className="story-grid">
    <div>
      <custom-element-nested>Normal</custom-element-nested>
    </div>
    <div className="pseudo-hover-all">
      <custom-element-nested>Hover</custom-element-nested>
    </div>
    <div className="pseudo-focus-all">
      <custom-element-nested>Focus</custom-element-nested>
    </div>
    <div className="pseudo-active-all">
      <custom-element-nested>Active</custom-element-nested>
    </div>
    <div className="pseudo-hover-all pseudo-focus-all">
      <custom-element-nested>Hover Focus</custom-element-nested>
    </div>
    <div className="pseudo-hover-all pseudo-active-all">
      <custom-element-nested>Hover Active</custom-element-nested>
    </div>
    <div className="pseudo-focus-all pseudo-active-all">
      <custom-element-nested>Focus Active</custom-element-nested>
    </div>
    <div className="pseudo-hover-all pseudo-focus-all pseudo-active-all">
      <custom-element-nested>Hover Focus Active</custom-element-nested>
    </div>
  </div>
)

export const Default = Template.bind()

export const Hover = Template.bind()
Hover.parameters = { pseudo: { hover: true } }

export const Focus = Template.bind()
Focus.parameters = { pseudo: { focus: true } }

export const Active = Template.bind()
Active.parameters = { pseudo: { active: true } }
