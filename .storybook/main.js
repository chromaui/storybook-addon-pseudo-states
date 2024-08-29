module.exports = {
  addons: ["@chromatic-com/storybook"],
  framework: "@storybook/react-vite",
  managerEntries: [__dirname + "/../src/manager.ts"],
  previewAnnotations: [__dirname + "/../src/preview.ts"],
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
}
