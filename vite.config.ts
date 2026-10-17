import { defineConfig } from "vite";

// base "./" so the build works from any sub-path (GitHub Pages, Netlify, a USB stick…)
export default defineConfig({
  base: "./",
  server: { host: true },
  build: { target: "es2020" },
});
