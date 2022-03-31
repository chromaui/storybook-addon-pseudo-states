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
Hover.parameters = { pseudo: { hover: true } }

export const Focus = Template.bind()
Focus.parameters = { pseudo: { focus: true } }

export const Active = Template.bind()
Active.parameters = { pseudo: { active: true } }

export const DirectSelector = () => (
  <div>
    <Button>Regular</Button>
    <Button data-id="hover">Hover</Button>
    <Button data-id="focus">Focus</Button>
    <Button data-id="active">Active</Button>
    <div data-id="hover-group">
      <h3>Multiple hovered button grouped</h3>
      <Button>Hovered 1</Button>
      <Button>Hovered 2</Button>
      <Button>Hovered 3</Button>
    </div>
  </div>
)

DirectSelector.parameters = {
  pseudo: {
    useExplicitSelectors: true,
    hover: ['[data-id="hover"]', '[data-id="hover-group"] button'],
    focus: '[data-id="focus"]',
    active: ['[data-id="active"]']
  },
}
