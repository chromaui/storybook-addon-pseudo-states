import { rewriteStyleSheet } from "./rewriteStyleSheet"
import { splitSelectors } from "./splitSelectors"

function splitRules(cssText: string): string[] {
  let ruleStart: number | undefined
  let depth = 0
  const rules: string[] = []
  const chars = [...cssText]
  chars.forEach((c, i) => {
    if (c === '{') {
      depth++
    } else if (c === '}') {
      if (--depth === 0) {
        rules.push(cssText.substring(ruleStart!, i + 1))
        ruleStart = undefined
      }
    } else if (ruleStart === undefined && c !== ' ' && c !== '\n') {
      ruleStart = i
    }
  });
  return rules
}

abstract class Rule {
  constructor(readonly cssText: string) {}

  selectorText?: string

  static parse(cssText: string): Rule {
    return cssText.trim().startsWith("@")
      ? new GroupingRule(cssText)
      : new StyleRule(cssText)
  }
  getSelectors(): string[] {
    return this.selectorText ? splitSelectors(this.selectorText) : []
  }
  toString() {
    return this.cssText
  }
}

class StyleRule extends Rule {
  __processed = false
  __pseudoStatesRewrittenCount = 0

  constructor(cssText: string) {
    super(cssText)
    if (cssText.trim().startsWith("@")) {
      throw new Error('StyleRule cannot start with @')
    }
    this.selectorText = cssText.substring(0, cssText.indexOf(" {"))
  }
}

class GroupingRule extends Rule {
  cssRules: Rule[]

  constructor(cssText: string) {
    super(cssText)
    const innerCssText = cssText.substring(cssText.indexOf("{") + 1, cssText.lastIndexOf("}"))
    this.cssRules = splitRules(innerCssText).map(x => Rule.parse(x))
  }
  deleteRule(index: number) {
    this.cssRules.splice(index, 1)
  }
  insertRule(cssText: string, index: number) {
    this.cssRules.splice(index, 0, Rule.parse(cssText))
  }
}

class Sheet {
  cssRules: Rule[]

  constructor(cssText: string) {
    this.cssRules = splitRules(cssText).map(x => Rule.parse(x))
  }
  deleteRule(index: number) {
    this.cssRules.splice(index, 1)
  }
  insertRule(cssText: string, index: number) {
    this.cssRules.splice(index, 0, Rule.parse(cssText))
  }
}

describe("rewriteStyleSheet", () => {
  it("adds alternative selector targeting the element directly", () => {
    const sheet = new Sheet("a:hover { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].getSelectors()).toContain("a.pseudo-hover")
  })

  it("adds alternative selector targeting an ancestor", () => {
    const sheet = new Sheet("a:hover { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].getSelectors()).toContain(".pseudo-hover-all a")
  })

  it("does not add .pseudo-<class> to pseudo-class, which does not support classes", () => {
    const sheet = new Sheet("::-webkit-scrollbar-thumb:hover { border-color: transparent; }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].getSelectors()).not.toContain("::-webkit-scrollbar-thumb.pseudo-hover")
  })

  it("adds alternative selector for each pseudo selector", () => {
    const sheet = new Sheet("a:hover, a:focus { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].getSelectors()).toContain("a.pseudo-hover")
    expect(sheet.cssRules[0].getSelectors()).toContain("a.pseudo-focus")
    expect(sheet.cssRules[0].getSelectors()).toContain(".pseudo-hover-all a")
    expect(sheet.cssRules[0].getSelectors()).toContain(".pseudo-focus-all a")
  })

  it("keeps non-pseudo selectors as-is", () => {
    const sheet = new Sheet("a.class, a:hover, a:focus, a#id { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].getSelectors()).toContain("a.class")
    expect(sheet.cssRules[0].getSelectors()).toContain("a#id")
  })

  it("supports combined pseudo selectors", () => {
    const sheet = new Sheet("a:hover:focus { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].getSelectors()).toContain("a.pseudo-hover.pseudo-focus")
    expect(sheet.cssRules[0].getSelectors()).toContain(".pseudo-hover-all.pseudo-focus-all a")
  })

  it("supports combined pseudo selectors with classes", () => {
    const sheet = new Sheet(".hiOZqY:hover { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].getSelectors()).toContain(".hiOZqY:hover")
    expect(sheet.cssRules[0].getSelectors()).toContain(".hiOZqY.pseudo-hover")
    expect(sheet.cssRules[0].getSelectors()).toContain(".pseudo-hover-all .hiOZqY")
  })

  it('supports ":host"', () => {
    const sheet = new Sheet(":host(:hover) { color: red }")
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].cssText).toEqual(
      ":host(:hover), :host(.pseudo-hover), :host(.pseudo-hover-all) { color: red }"
    )
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
      }
      .test {
        background-color: blue;
      }
      .test:hover {
        background-color: red;
      }
      .test2:hover {
        background-color: white;
      }`
    )
    rewriteStyleSheet(sheet as any)
    expect(sheet.cssRules[0].cssText).toContain("@media (max-width: 790px)")
    expect(sheet.cssRules[1].getSelectors()).toContain(".test")
    expect(sheet.cssRules[2].getSelectors()).toContain(".test:hover")
    expect(sheet.cssRules[2].getSelectors()).toContain(".test.pseudo-hover")
    expect(sheet.cssRules[2].getSelectors()).toContain(".pseudo-hover-all .test")
    expect(sheet.cssRules[3].getSelectors()).toContain(".test2:hover")
    expect(sheet.cssRules[3].getSelectors()).toContain(".test2.pseudo-hover")
    expect(sheet.cssRules[3].getSelectors()).toContain(".pseudo-hover-all .test2")
  })
})
