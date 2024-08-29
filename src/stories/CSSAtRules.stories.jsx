import React from "react"
import { FORCE_REMOUNT } from "storybook/internal/core-events"
import { useChannel, useStoryContext } from "storybook/internal/preview-api"

import { Button } from "./CSSAtRules"
import "./grid.css"

export default {
  title: "Example/CSSAtRules",
  component: Button,
}

const Template = (args) => <Button {...args}>Label</Button>

export const All = (args) => (
  <div className="story-grid">
    <div>
      <Button {...args}>Normal</Button>
    </div>
    <div className="pseudo-hover-all">
      <Button {...args}>Hover</Button>
    </div>
    <div className="pseudo-focus-all">
      <Button {...args}>Focus</Button>
    </div>
    <div className="pseudo-active-all">
      <Button {...args}>Active</Button>
    </div>
    <div className="pseudo-hover-all pseudo-focus-all">
      <Button {...args}>Hover Focus</Button>
    </div>
    <div className="pseudo-hover-all pseudo-active-all">
      <Button {...args}>Hover Active</Button>
    </div>
    <div className="pseudo-focus-all pseudo-active-all">
      <Button {...args}>Focus Active</Button>
    </div>
    <div className="pseudo-hover-all pseudo-focus-all pseudo-active-all">
      <Button {...args}>Hover Focus Active</Button>
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

export const DynamicStyles = {
  render: () => {
    const emit = useChannel({})
    const { id: storyId } = useStoryContext()
    setTimeout(() => {
      if (window.__dynamicRuleInjected) return
      window.__dynamicRuleInjected = true
      const sheet = Array.from(document.styleSheets).at(-1)
      sheet.insertRule("@layer foo { .dynamic.button:hover { background-color: tomato } }")
      emit(FORCE_REMOUNT, { storyId })
    }, 100)
    return <All className="dynamic" />
  },
}
