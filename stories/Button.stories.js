import React from "react"

import { Button } from "./Button"
import "./grid.css"

export default {
  title: "Example/Button",
  component: Button,
}

const Template = (args) => <Button {...args}>Label</Button>

export const All = () => (
  <div className="story-grid">
    <div>
      <Button>Normal</Button>
    </div>
    <div className="pseudo-hover">
      <Button>Hover</Button>
    </div>
    <div className="pseudo-focus">
      <Button>Focus</Button>
    </div>
    <div className="pseudo-active">
      <Button>Active</Button>
    </div>
    <div className="pseudo-hover pseudo-focus">
      <Button>Hover Focus</Button>
    </div>
    <div className="pseudo-hover pseudo-active">
      <Button>Hover Active</Button>
    </div>
    <div className="pseudo-focus pseudo-active">
      <Button>Focus Active</Button>
    </div>
    <div className="pseudo-hover pseudo-focus pseudo-active">
      <Button>Hover Focus Active</Button>
    </div>
  </div>
)

export const Default = Template.bind()

export const Hover = Template.bind()
Hover.args = { pseudo: { hover: true } }

export const Focus = Template.bind()
Focus.args = { pseudo: { focus: true } }

export const Active = Template.bind()
Active.args = { pseudo: { active: true } }
