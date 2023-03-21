import React from "react"

import { Button } from "./Button"
import "./grid.css"
import { createPortal } from "react-dom"

export default {
  title: "Example/Portal",
  component: Button,
}

const PortalButton = (props) => createPortal(<Button {...props} />, document.body)

const Template = (args) => <PortalButton {...args}>Label</PortalButton>

export const Default = Template.bind()
Default.parameters = { pseudo: { rootElement: "body" } }

export const Hover = Template.bind()
Hover.parameters = { pseudo: { hover: true, rootElement: "body" } }

export const Focus = Template.bind()
Focus.parameters = { pseudo: { focus: true, rootElement: "body" } }

export const Active = Template.bind()
Active.parameters = { pseudo: { active: true, rootElement: "body" } }

export const FocusedHover = Template.bind()
FocusedHover.parameters = { pseudo: { focus: true, hover: true, rootElement: "body" } }
