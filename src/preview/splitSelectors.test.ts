import { splitSelectors } from "./splitSelectors"

describe("splitSelectors", () => {
  test("handles basic selectors", () => {
    expect(splitSelectors(".a")).toEqual([".a"])

    expect(splitSelectors(".a, .b")).toEqual([".a", ".b"])
  })

  test("supports ::slotted and :is", () => {
    expect(splitSelectors("::slotted(:is(button, a):active)")).toEqual([
      "::slotted(:is(button, a):active)",
    ])

    expect(
      splitSelectors("::slotted(:is(button, a):active), ::slotted(:is(button, a):hover)")
    ).toEqual(["::slotted(:is(button, a):active)", "::slotted(:is(button, a):hover)"])
  })

  test("supports :host", () => {
    expect(
      splitSelectors(
        ":host([type='secondary']) ::slotted(:is(button, a)), :host([type='primary']) ::slotted(:is(button, a):active)"
      )
    ).toEqual([
      ":host([type='secondary']) ::slotted(:is(button, a))",
      ":host([type='primary']) ::slotted(:is(button, a):active)",
    ])

    expect(
      splitSelectors(
        ":host([outline]) ::slotted(:is(button, a):focus-within:focus-visible:not(:active))"
      )
    ).toEqual([
      ":host([outline]) ::slotted(:is(button, a):focus-within:focus-visible:not(:active))",
    ])
  })
})
