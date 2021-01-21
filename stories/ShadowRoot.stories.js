import React from "react"

import { ShadowRoot } from "./ShadowRoot"

export default {
  title: "Example/ShadowRoot",
  component: ShadowRoot,
}

const Template = () => <ShadowRoot />

export const All = () => (
  <div className="story-grid">
    <div>
      <ShadowRoot label="Normal" />
    </div>
    <div className="pseudo-hover">
      <ShadowRoot label="Hover" />
    </div>
    <div className="pseudo-focus">
      <ShadowRoot label="Focus" />
    </div>
    <div className="pseudo-active">
      <ShadowRoot label="Active" />
    </div>
    <div className="pseudo-hover pseudo-focus">
      <ShadowRoot label="Hover Focus" />
    </div>
    <div className="pseudo-hover pseudo-active">
      <ShadowRoot label="Hover Active" />
    </div>
    <div className="pseudo-focus pseudo-active">
      <ShadowRoot label="Focus Active" />
    </div>
    <div className="pseudo-hover pseudo-focus pseudo-active">
      <ShadowRoot label="Hover Focus Active" />
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
