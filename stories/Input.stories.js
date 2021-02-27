import React from "react"

import { Input } from "./Input"
import "./grid.css"

export default {
  title: "Example/Input",
  component: Input,
}

const Template = (args) => <Input {...args} />

export const All = () => (
  <div className="story-grid pseudo">
    <div>
      <Input defaultValue="Normal" />
    </div>
    <div className="pseudo-hover">
      <Input defaultValue="Hover" />
    </div>
    <div className="pseudo-focus">
      <Input defaultValue="Focus" />
    </div>
    <div className="pseudo-hover pseudo-focus">
      <Input defaultValue="Hover Focus" />
    </div>
  </div>
)

export const Default = Template.bind()

export const Hover = Template.bind()
Hover.parameters = { pseudo: { hover: true } }

export const Focus = Template.bind()
Focus.parameters = { pseudo: { focus: true } }
