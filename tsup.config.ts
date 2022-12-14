import { defineConfig } from "tsup"

export default defineConfig(() => {
  return {
    dts: { entry: ["src/index.ts", "src/manager.ts", "src/preview.ts"] },
    entry: ["src/index.ts", "src/manager.ts", "src/preview.ts"],
    format: ["esm", "cjs"],
  }
})
