import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

/**
 * In dev the app talks to both backends through this server, so the session
 * cookies Auth360 sets are first-party on localhost and ride along with every
 * request to the fleet API too.
 */
const BACKENDS = {
  "/fleet-api": "https://rv10n5m4-8005.inc1.devtunnels.ms",
  "/auth-api": "https://rv10n5m4-8004.inc1.devtunnels.ms",
};

// The tunnel issues cookies for its own domain with SameSite=None; Secure.
// Rewrite them so the browser keeps them for http://localhost.
const rewriteSessionCookies = (response) => {
  const cookies = response.headers["set-cookie"];

  if (!cookies) return;

  response.headers["set-cookie"] = cookies.map((cookie) =>
    cookie
      .replace(/;\s*Domain=[^;]*/gi, "")
      .replace(/;\s*Path=[^;]*/gi, "; Path=/")
      .replace(/;\s*SameSite=None/gi, "; SameSite=Lax")
      .replace(/;\s*Secure/gi, "")
      .replace(/;\s*Partitioned/gi, ""),
  );
};

const proxy = Object.fromEntries(
  Object.entries(BACKENDS).map(([prefix, target]) => [
    prefix,
    {
      target,
      changeOrigin: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), ""),
      configure: (server) => server.on("proxyRes", rewriteSessionCookies),
    },
  ]),
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5175,
    strictPort: true,
    proxy,
  },
  preview: {
    port: 5175,
    strictPort: true,
  },
});
