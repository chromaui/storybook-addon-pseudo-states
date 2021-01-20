import React from "react"

import { ShadowRoot } from "./ShadowRoot"

export default {
  title: "Example/ShadowRoot",
  component: ShadowRoot,
}

const Template = () => <ShadowRoot />

export const Default = Template.bind()

export const Hover = Template.bind()
Hover.args = { pseudo: { hover: true } }

export const Focus = Template.bind()
Focus.args = { pseudo: { focus: true } }

export const Active = Template.bind()
Active.args = { pseudo: { active: true } }
