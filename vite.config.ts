import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig({
  define: { "import.meta.env.VITE_BASE_URL": JSON.stringify(
    process.env.CI ? "/tg-games/" : "/",
  ) },
  base: process.env.CI ? "/tg-games/" : "/",
  build: {
    chunkSizeWarningLimit: 1000,
    outDir: "dist",
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, "./src/assets/"),
          dest: "./",
        },
        {
          src: path.resolve(__dirname, "./src/public/"),
          dest: "./",
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
