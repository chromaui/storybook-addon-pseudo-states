import { CustomElement } from "./CustomElement"

export default {
  title: "Example/CustomElement",
  component: CustomElement,
}

const Template = () => <ShadowRoot />

export const All = () => (
  <div className="story-grid">
    <div>
      <custom-element>Normal</custom-element>
    </div>
    <div className="pseudo-hover">
      <custom-element>Hover</custom-element>
    </div>
    <div className="pseudo-focus">
      <custom-element>Focus</custom-element>
    </div>
    <div className="pseudo-active">
      <custom-element>Active</custom-element>
    </div>
    <div className="pseudo-hover pseudo-focus">
      <custom-element>Hover Focus</custom-element>
    </div>
    <div className="pseudo-hover pseudo-active">
      <custom-element>Hover Active</custom-element>
    </div>
    <div className="pseudo-focus pseudo-active">
      <custom-element>Focus Active</custom-element>
    </div>
    <div className="pseudo-hover pseudo-focus pseudo-active">
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
