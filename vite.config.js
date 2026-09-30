import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Two dozen picklist components already import as "src/...". None are
      // routed yet, so nothing breaks today, but each one would fail to
      // resolve the moment it is. This makes that style work.
      src: fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
