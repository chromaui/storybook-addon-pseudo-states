import { defineConfig } from "tsup"

export default defineConfig((options) => {
  return {
    dts: { entry: ["src/index.ts", "src/manager.ts", "src/preview.ts"] },
    entry: ["src/index.ts", "src/manager.ts", "src/preview.ts"],
    format: ["esm", "cjs"],
    splitting: false,
    minify: !options.watch,
    treeshake: true,
    sourcemap: true,
    clean: true,
    platform: "browser",
    esbuildOptions(options) {
      options.conditions = ["module"];
    },
  }
})
