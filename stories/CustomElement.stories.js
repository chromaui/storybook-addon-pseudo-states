import React from "react"

import { CustomElement } from "./CustomElement"
import "./grid.css"

export default {
  title: "Example/CustomElement",
  component: CustomElement,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
}

const Template = () => <custom-element>Custom element</custom-element>

export const All = () => (
  <div className="story-grid">
    <div>
      <custom-element>Normal</custom-element>
    </div>
    <div className="pseudo-hover-all">
      <custom-element>Hover</custom-element>
    </div>
    <div className="pseudo-focus-all">
      <custom-element>Focus</custom-element>
    </div>
    <div className="pseudo-active-all">
      <custom-element>Active</custom-element>
    </div>
    <div className="pseudo-hover-all pseudo-focus-all">
      <custom-element>Hover Focus</custom-element>
    </div>
    <div className="pseudo-hover-all pseudo-active-all">
      <custom-element>Hover Active</custom-element>
    </div>
    <div className="pseudo-focus-all pseudo-active-all">
      <custom-element>Focus Active</custom-element>
    </div>
    <div className="pseudo-hover-all pseudo-focus-all pseudo-active-all">
      <custom-element>Hover Focus Active</custom-element>
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
