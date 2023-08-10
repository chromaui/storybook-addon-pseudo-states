import { rewriteStyleSheet } from "./rewriteStyleSheet"

class Rule {
  cssText: string
  selectorText?: string
  constructor(cssText: string) {
    if (cssText.trim().startsWith("@")) {
      this.cssText = cssText
      return
    }
    this.cssText = cssText
    this.selectorText = cssText.slice(0, cssText.indexOf(" {"))
  }
  toString() {
    return this.cssText
  }
}

class Sheet {
  __pseudoStatesRewritten: boolean
  cssRules: CSSStyleRule[]

  constructor(...rules: string[]) {
    this.__pseudoStatesRewritten = false
    this.cssRules = rules.map((cssText) => new Rule(cssText) as CSSStyleRule)
  }
  deleteRule(index: number) {
    this.cssRules.splice(index, 1)
  }
  insertRule(cssText: string, index: number) {
    this.cssRules.splice(index, 0, new Rule(cssText) as CSSStyleRule)
  }
}

describe("rewriteStyleSheet", () => {
  it("adds alternative selector targeting the element directly", () => {
    const sheet = new Sheet("a:hover { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].selectorText).toContain("a.pseudo-hover")
  })

  it("adds alternative selector targeting an ancestor", () => {
    const sheet = new Sheet("a:hover { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].selectorText).toContain(".pseudo-hover-all a")
  })

  it("does not add .pseudo-<class> to pseudo-class, which does not support classes", () => {
    const sheet = new Sheet("::-webkit-scrollbar-thumb:hover { border-color: transparent; }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].selectorText).not.toContain("::-webkit-scrollbar-thumb.pseudo-hover")
  })

  it("adds alternative selector for each pseudo selector", () => {
    const sheet = new Sheet("a:hover, a:focus { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].selectorText).toContain("a.pseudo-hover")
    expect(sheet.cssRules[0].selectorText).toContain("a.pseudo-focus")
    expect(sheet.cssRules[0].selectorText).toContain(".pseudo-hover-all a")
    expect(sheet.cssRules[0].selectorText).toContain(".pseudo-focus-all a")
  })

  it("keeps non-pseudo selectors as-is", () => {
    const sheet = new Sheet("a.class, a:hover, a:focus, a#id { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].selectorText).toContain("a.class")
    expect(sheet.cssRules[0].selectorText).toContain("a#id")
  })

  it("supports combined pseudo selectors", () => {
    const sheet = new Sheet("a:hover:focus { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].selectorText).toContain("a.pseudo-hover.pseudo-focus")
    expect(sheet.cssRules[0].selectorText).toContain(".pseudo-hover-all.pseudo-focus-all a")
  })

  it("supports combined pseudo selectors with classes", () => {
    const sheet = new Sheet(".hiOZqY:hover { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].selectorText).toContain(".hiOZqY:hover")
    expect(sheet.cssRules[0].selectorText).toContain(".hiOZqY.pseudo-hover")
    expect(sheet.cssRules[0].selectorText).toContain(".pseudo-hover-all .hiOZqY")
  })

  it('supports ":host"', () => {
    const sheet = new Sheet(":host(:hover) { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].cssText).toEqual(":host(:hover), :host(.pseudo-hover), :host(.pseudo-hover-all) { color: red }")
  })

  it('supports ":not"', () => {
    const sheet = new Sheet(":not(:hover) { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].cssText).toEqual(":not(:hover), :not(.pseudo-hover) { color: red }")
  })

  it("override correct rules with media query present", () => {
    const sheet = new Sheet(
`@media (max-width: 790px) {
  .test {
    background-color: green;
  }
}`,
`.test {
  background-color: blue;
}`,
`.test:hover {
  background-color: red;
}`,
`.test2:hover {
  background-color: white;
}`)
    rewriteStyleSheet(sheet)
    expect(sheet.cssRules[0].cssText).toContain("@media (max-width: 790px)")
    expect(sheet.cssRules[1].selectorText).toContain(".test")
    expect(sheet.cssRules[2].selectorText).toContain(".test:hover")
    expect(sheet.cssRules[2].selectorText).toContain(".test.pseudo-hover")
    expect(sheet.cssRules[2].selectorText).toContain(".pseudo-hover-all .test")
    expect(sheet.cssRules[3].selectorText).toContain(".test2:hover")
    expect(sheet.cssRules[3].selectorText).toContain(".test2.pseudo-hover")
    expect(sheet.cssRules[3].selectorText).toContain(".pseudo-hover-all .test2")

  })
})
