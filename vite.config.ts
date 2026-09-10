import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { steamProxyPath } from "./src/services/region.ts";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/steam": {
        target: "https://store.steampowered.com",
        changeOrigin: true,
        rewrite: steamProxyPath,
      },
    },
  },
});
