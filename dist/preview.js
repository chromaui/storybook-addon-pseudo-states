"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/preview.ts
var preview_exports = {};
__export(preview_exports, {
  decorators: () => decorators
});
module.exports = __toCommonJS(preview_exports);

// src/preview/withPseudoState.ts
var import_core_events = require("@storybook/core-events");
var import_preview_api = require("@storybook/preview-api");

// src/constants.ts
var ADDON_ID = "storybook/pseudo-states";
var TOOL_ID = `${ADDON_ID}/tool`;
var EXCLUDED_PSEUDO_ELEMENTS = ["::-webkit-scrollbar-thumb"];
var PSEUDO_STATES = {
  hover: "hover",
  active: "active",
  focusVisible: "focus-visible",
  focusWithin: "focus-within",
  focus: "focus",
  visited: "visited",
  link: "link",
  target: "target"
};

// src/preview/splitSelectors.ts
var isAtRule = (selector) => selector.indexOf("@") === 0;
var splitSelectors = (selectors) => {
  if (isAtRule(selectors))
    return [selectors];
  let result = [];
  let parentheses = 0;
  let brackets = 0;
  let selector = "";
  for (let i = 0, len = selectors.length; i < len; i++) {
    const char = selectors[i];
    if (char === "(") {
      parentheses += 1;
    } else if (char === ")") {
      parentheses -= 1;
    } else if (char === "[") {
      brackets += 1;
    } else if (char === "]") {
      brackets -= 1;
    } else if (char === ",") {
      if (!parentheses && !brackets) {
        result.push(selector.trim());
        selector = "";
        continue;
      }
    }
    selector += char;
  }
  result.push(selector.trim());
  return result;
};

// src/preview/rewriteStyleSheet.ts
var pseudoStates = Object.values(PSEUDO_STATES);
var matchOne = new RegExp(`:(${pseudoStates.join("|")})`);
var matchAll = new RegExp(`:(${pseudoStates.join("|")})`, "g");
var warnings = /* @__PURE__ */ new Set();
var warnOnce = (message) => {
  if (warnings.has(message))
    return;
  console.warn(message);
  warnings.add(message);
};
var isExcludedPseudoElement = (selector, pseudoState) => EXCLUDED_PSEUDO_ELEMENTS.some((element) => selector.endsWith(`${element}:${pseudoState}`));
var rewriteRule = ({ cssText, selectorText }, shadowRoot) => {
  return cssText.replace(
    selectorText,
    splitSelectors(selectorText).flatMap((selector) => {
      if (selector.includes(".pseudo-")) {
        return [];
      }
      if (!matchOne.test(selector)) {
        return [selector];
      }
      const states = [];
      const plainSelector = selector.replace(matchAll, (_, state) => {
        states.push(state);
        return "";
      });
      const classSelector = states.reduce((acc, state) => {
        if (isExcludedPseudoElement(selector, state))
          return "";
        return acc.replace(new RegExp(`:${state}`, "g"), `.pseudo-${state}`);
      }, selector);
      if (selector.startsWith(":host(") || selector.startsWith("::slotted(")) {
        return [selector, classSelector].filter(Boolean);
      }
      const ancestorSelector = shadowRoot ? `:host(${states.map((s) => `.pseudo-${s}`).join("")}) ${plainSelector}` : `${states.map((s) => `.pseudo-${s}`).join("")} ${plainSelector}`;
      return [selector, classSelector, ancestorSelector].filter(
        (selector2) => selector2 && !selector2.includes(":not()")
      );
    }).join(", ")
  );
};
var rewriteMediaRule = (sheet, mediaRule) => {
  let newRule = mediaRule.cssText;
  let hasPseudo = false;
  for (const cssRule of mediaRule.cssRules) {
    if (!("selectorText" in cssRule))
      continue;
    const styleRule = cssRule;
    if (matchOne.test(styleRule.selectorText)) {
      const newSelector = rewriteRule(styleRule, void 0);
      newRule = newRule.replace(styleRule.selectorText, newSelector);
      hasPseudo = true;
    }
  }
  return hasPseudo ? newRule : void 0;
};
var rewriteStyleSheet = (sheet, shadowRoot, shadowHosts2) => {
  if (sheet.__pseudoStatesRewritten)
    return;
  sheet.__pseudoStatesRewritten = true;
  try {
    let index = -1;
    for (const cssRule of sheet.cssRules) {
      index++;
      if ("media" in cssRule) {
        const newRule = rewriteMediaRule(sheet, cssRule);
        if (newRule) {
          sheet.deleteRule(index);
          sheet.insertRule(newRule, index);
        }
        continue;
      }
      if (!("selectorText" in cssRule))
        continue;
      const styleRule = cssRule;
      if (matchOne.test(styleRule.selectorText)) {
        const newRule = rewriteRule(styleRule, shadowRoot);
        sheet.deleteRule(index);
        sheet.insertRule(newRule, index);
        if (shadowRoot && shadowHosts2)
          shadowHosts2.add(shadowRoot.host);
      }
      if (index > 1e3) {
        warnOnce("Reached maximum of 1000 pseudo selectors per sheet, skipping the rest.");
        break;
      }
    }
  } catch (e) {
    if (String(e).includes("cssRules")) {
      warnOnce(`Can't access cssRules, likely due to CORS restrictions: ${sheet.href}`);
    } else {
      console.error(e, sheet.href);
    }
  }
};

// src/preview/withPseudoState.ts
var channel = import_preview_api.addons.getChannel();
var shadowHosts = /* @__PURE__ */ new Set();
var applyClasses = (element, classnames) => {
  Object.values(PSEUDO_STATES).forEach((state) => element.classList.remove(`pseudo-${state}`));
  classnames.forEach((classname) => element.classList.add(classname));
};
var applyParameter = (rootElement, parameter) => {
  const map = /* @__PURE__ */ new Map([[rootElement, /* @__PURE__ */ new Set()]]);
  const add = (target, state) => map.set(target, /* @__PURE__ */ new Set([...map.get(target) || [], state]));
  Object.entries(parameter || {}).forEach(([state, value]) => {
    if (typeof value === "boolean") {
      if (value)
        add(rootElement, state);
    } else if (typeof value === "string") {
      rootElement.querySelectorAll(value).forEach((el) => add(el, state));
    } else if (Array.isArray(value)) {
      value.forEach((sel) => rootElement.querySelectorAll(sel).forEach((el) => add(el, state)));
    }
  });
  map.forEach((states, target) => {
    const classnames = /* @__PURE__ */ new Set();
    states.forEach((key) => PSEUDO_STATES[key] && classnames.add(`pseudo-${PSEUDO_STATES[key]}`));
    applyClasses(target, classnames);
  });
};
var updateShadowHost = (shadowHost) => {
  const classnames = /* @__PURE__ */ new Set();
  for (let element = shadowHost.parentElement; element; element = element.parentElement) {
    if (!element.className)
      continue;
    element.className.split(" ").filter((classname) => classname.indexOf("pseudo-") === 0).forEach((classname) => classnames.add(classname));
  }
  applyClasses(shadowHost, classnames);
};
var withPseudoState = (StoryFn, { viewMode, parameters, id, globals: globalsArgs }) => {
  const { pseudo: parameter } = parameters;
  const { pseudo: globals } = globalsArgs;
  const canvasElement = (0, import_preview_api.useMemo)(() => {
    if (viewMode === "docs") {
      return document.getElementById(`story--${id}`);
    }
    return document.getElementById("storybook-root") || document.getElementById("root");
  }, [viewMode, id]);
  (0, import_preview_api.useEffect)(() => {
    if (parameter !== globals && viewMode === "story") {
      channel.emit(import_core_events.UPDATE_GLOBALS, {
        globals: { pseudo: parameter }
      });
    }
  }, [parameter, viewMode]);
  (0, import_preview_api.useEffect)(() => {
    if (!canvasElement)
      return;
    const timeout = setTimeout(() => {
      applyParameter(canvasElement, globals || parameter);
      shadowHosts.forEach(updateShadowHost);
    }, 0);
    return () => clearTimeout(timeout);
  }, [canvasElement, globals, parameter]);
  return StoryFn();
};
var rewriteStyleSheets = (shadowRoot) => {
  let styleSheets = Array.from(shadowRoot ? shadowRoot.styleSheets : document.styleSheets);
  if (shadowRoot?.adoptedStyleSheets?.length)
    styleSheets = shadowRoot.adoptedStyleSheets;
  styleSheets.forEach((sheet) => rewriteStyleSheet(sheet, shadowRoot, shadowHosts));
};
channel.on(import_core_events.STORY_CHANGED, () => shadowHosts.clear());
channel.on(import_core_events.STORY_RENDERED, () => rewriteStyleSheets());
channel.on(import_core_events.DOCS_RENDERED, () => rewriteStyleSheets());
if (Element.prototype.attachShadow) {
  Element.prototype._attachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function attachShadow(init) {
    const shadowRoot = this._attachShadow({ ...init, mode: "open" });
    requestAnimationFrame(() => {
      rewriteStyleSheets(shadowRoot);
      updateShadowHost(shadowRoot.host);
    });
    return shadowRoot;
  };
}

// src/preview.ts
var decorators = [withPseudoState];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decorators
});
