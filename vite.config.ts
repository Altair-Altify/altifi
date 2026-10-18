import { defineConfig } from "vite";

// base "./" so the build works from any sub-path (GitHub Pages, Netlify, a USB stick…)
export default defineConfig({
  base: "./",
  server: { host: true },
  build: {
    target: "es2020",
    // Three.js (galaxy now, low-poly town from 20/10) in its own chunk: app updates don't re-download it
    rollupOptions: { output: { manualChunks: (id) => (id.includes("node_modules/three") ? "three" : undefined) } },
    chunkSizeWarningLimit: 800,
  },
});
