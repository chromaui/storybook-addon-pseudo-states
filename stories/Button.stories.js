import { FORCE_REMOUNT } from "@storybook/core-events"
import { useChannel, useStoryContext } from "@storybook/preview-api"
import React from "react"

import { Button } from "./Button"
import "./grid.css"

export default {
  title: "Example/Button",
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
Hover.parameters = { pseudo: { hover: "button" } }

export const Focus = Template.bind()
Focus.parameters = { pseudo: { focus: true } }

export const Active = Template.bind()
Active.parameters = { pseudo: { active: true } }

export const DirectSelector = () => (
  <>
    <div className="story-grid">
      <Button>Normal</Button>
      <Button data-hover>Hover</Button>
      <Button data-focus>Focus</Button>
      <Button data-active>Active</Button>
      <Button data-hover data-focus>
        Hover Focus
      </Button>
      <Button data-hover data-active>
        Hover Active
      </Button>
      <Button data-focus data-active>
        Focus Active
      </Button>
      <Button data-hover data-focus data-active>
        Hover Focus Active
      </Button>
    </div>
    <h3>Multiple hovered button grouped</h3>
    <div data-hover-group>
      <Button>Hovered 1</Button>
      <Button>Hovered 2</Button>
      <Button>Hovered 3</Button>
    </div>
  </>
)

DirectSelector.parameters = {
  pseudo: {
    hover: ["[data-hover]", "[data-hover-group] button"],
    focus: "[data-focus]",
    active: ["[data-active]"],
  },
}

export const DirectSelectorParentDoesNotAffectDescendants = () => (
  <>
    <Button id="foo">Hovered 1</Button>

    <div id="foo">
      <Button>Not Hovered 1 </Button>
      <Button>Not Hovered 2</Button>
    </div>
  </>
)

DirectSelectorParentDoesNotAffectDescendants.parameters = {
  pseudo: {
    hover: ["#foo"],
  },
}

export const DynamicStyles = {
  render: () => {
    const emit = useChannel({})
    const { id: storyId } = useStoryContext()
    setTimeout(() => {
      if (window.__dynamicRuleInjected) return
      window.__dynamicRuleInjected = true
      const sheet = Array.from(document.styleSheets).at(-1)
      sheet.insertRule(".dynamic.button:hover { background-color: tomato }")
      emit(FORCE_REMOUNT, { storyId })
    }, 100)
    return <All className="dynamic" />
  },
}
