import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: {
    entry: "./src/index.ts",
    compilerOptions: {
      incremental: false,
    },
  },
  treeshake: true,
  minify: true,
});
