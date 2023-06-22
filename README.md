<img src="https://user-images.githubusercontent.com/321738/105224055-f6c29c00-5b5c-11eb-83c9-ba28a7fbadf2.gif" width="80" height="80" alt="">

# Storybook Pseudo States

Toggle CSS pseudo states for your components in Storybook.

[![Published on npm](https://badgen.net/npm/v/storybook-addon-pseudo-states)](https://www.npmjs.com/package/storybook-addon-pseudo-states)
[![Tested with Chromatic](https://badgen.net/badge/tested%20with/chromatic/fc521f)](https://www.chromatic.com/builds?appId=6008aabce49a640021858011)

<p>
  <img src="https://user-images.githubusercontent.com/321738/105100903-51e98580-5aae-11eb-82bf-2b625c5a88a3.gif" width="560" alt="" />
</p>

## Introduction

This addon attempts to "force" your components' pseudo states. It rewrites all document stylesheets to add a class name selector to any rules that target a pseudo-class (`:hover`, `:focus`, etc.). The tool then allows you to toggle these class names on the story container (`#root`). Additionally, you can set the `pseudo` property on your story `parameters` to set a default value for each pseudo class. This makes it possible to test such states with [Chromatic](https://www.chromatic.com/).

### Limitations

Because this addon rewrites your stylesheets rather than toggle the actual browser behavior like DevTools does, it won't render any of the default user agent (browser) styles. Unfortunately there's no JavaScript API to toggle real pseudo states without using a browser extension.

## Getting Started

This addon requires Storybook 6.1 or later. Install the latest with `npx sb upgrade --prerelease`

First, install the addon:

```sh
npm i -D storybook-addon-pseudo-states
```

Then, add `"storybook-addon-pseudo-states"` to the `addons` array in your [`.storybook/main.js`](https://storybook.js.org/docs/react/configure/overview#configure-your-storybook-project):

```js
module.exports = {
  addons: ["storybook-addon-pseudo-states"],
}
```

### Setting default story states

You can have your stories automatically use a specific set of pseudo states, by setting the `pseudo` property on `parameters`:

```jsx
export const Hover = () => <Button>Label</Button>
Hover.parameters = { pseudo: { hover: true } }
```

This is what enables snapshot testing your pseudo states in [Chromatic](https://www.chromatic.com/).

### Targeting specific elements

If you don't want to force or toggle pseudo styles to all elements that use them, but rather only enable them on specific elements, you can set a string or array value instead of a boolean:

```jsx
export const Buttons = () => (
  <>
    <Button id="one">Hover</Button>
    <Button id="two">Hover focus</Button>
    <Button id="three">Hover focus active</Button>
  </>
)
Buttons.parameters = {
  pseudo: {
    hover: ["#one", "#two", "#three"],
    focus: ["#two", "#three"],
    active: "#three",
  },
}
```

This accepts a single CSS selector (string), or an array of CSS selectors on which to enable that pseudo style.

### Selector Limits

For better performance, this addon will only look for pseudo-selectors in the first 1000 selectors of each stylesheet. However, this can be problematic when using frameworks such as Tailwind which may generate a large number of selectors. If necessary, you can configure the maximum number of selectors that will be checked for each stylesheet using the `selectorLimit` parameter:

```jsx
// in .storybook/preview.js
export const parameters = {
  pseudo: {
    selectorLimit: 5000
  }
}
```

Use `selectorLimit: Infinity` to parse the entire stylesheet, but note that this may have a negative performance impact. Because modified stylesheets may be reused for multiple stories, this parameter should only be defined once in `.storybook/preview.js` rather than dynamically for individual stories.
