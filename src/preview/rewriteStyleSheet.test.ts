import { rewriteStyleSheet } from "./rewriteStyleSheet"

class Rule {
  cssText: any
  selectorText: any
  constructor(cssText: string) {
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
    expect(sheet.cssRules[0].selectorText).toContain(".pseudo-hover a")
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
    expect(sheet.cssRules[0].selectorText).toContain(".pseudo-hover a")
    expect(sheet.cssRules[0].selectorText).toContain(".pseudo-focus a")
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
    expect(sheet.cssRules[0].selectorText).toContain(".pseudo-hover.pseudo-focus a")
  })

  it('supports ":host"', () => {
    const sheet = new Sheet(":host(:hover) { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].cssText).toEqual(":host(:hover), :host(.pseudo-hover) { color: red }")
  })

  it('supports ":not"', () => {
    const sheet = new Sheet(":not(:hover) { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].cssText).toEqual(":not(:hover), :not(.pseudo-hover) { color: red }")
  })
})
