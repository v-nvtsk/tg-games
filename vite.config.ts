import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  define: { "import.meta.env.VITE_BASE_URL": JSON.stringify(
    process.env.CI ? "/tg-games/" : "/",
  ) },
  base: process.env.CI ? "/tg-games/" : "/",
  build: {
    chunkSizeWarningLimit: 1000,
    outDir: "dist",
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       phaser: ["phaser"],
    //     },
    //   },
    // },
    // minify: "terser",
    // terserOptions: {
    //   compress: {
    //     passes: 2,
    //   },
    //   mangle: true,
    //   format: {
    //     comments: false,
    //   },
    // },
  },
  plugins: [
    react(),
    tsconfigPaths(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, "./src/assets/"),
          dest: "./",
        },
        // {
        //   src: path.resolve(__dirname, "./src/public/"),
        //   dest: "./",
        // },
      ],
    }),
  ],
  server: {
    allowedHosts: true,
  },
});
