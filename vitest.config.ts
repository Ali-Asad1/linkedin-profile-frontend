import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Test-only config. The react-router vite plugin injects a JSX preamble that
// breaks Vitest, so tests run against a minimal config with the same alias.
export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["app/**/*.test.{ts,tsx}"],
  },
});
