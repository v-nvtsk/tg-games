import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.VITE_BASE_URL,
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
        ],
      }),
    ],
    server: {
      allowedHosts: true,
    },
  };
});
