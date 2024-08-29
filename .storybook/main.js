module.exports = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@chromatic-com/storybook",
  ],
  managerEntries: [__dirname + "/../src/manager.ts"],
  previewAnnotations: [__dirname + "/../src/preview.ts"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    docsPage: true,
  },
}
