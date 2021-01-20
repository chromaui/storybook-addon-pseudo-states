<img src="https://user-images.githubusercontent.com/321738/105190912-cb2cbb00-5b36-11eb-95a1-517ed898ec86.gif" width="160" height="160">

# Storybook Pseudo States

Toggle CSS pseudo states for your components in Storybook.

<img src="https://user-images.githubusercontent.com/321738/105100903-51e98580-5aae-11eb-82bf-2b625c5a88a3.gif" width="560" alt="" />

<a href="https://www.npmjs.com/package/storybook-addon-pseudo-states">
  <img src="https://badgen.net/npm/v/storybook-addon-pseudo-states" alt="Published on npm">
</a>

## Introduction

This addon attempts to "force" your components' pseudo states. It rewrites all document stylesheets to add a class name selector to any rules that target a pseudo-class (`:hover`, `:focus`, etc.). The tool then allows you to toggle these class names on the story container (`#root`). Additionally, you can set the `pseudo` property on your story `args` to set a default value for each pseudo class. This makes it possible to test such states with [Chromatic](https://www.chromatic.com/).

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
