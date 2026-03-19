/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import legacy from "@vitejs/plugin-legacy";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ["defaults", "not IE 11", "Chrome >= 49", "Safari >= 10", "Android >= 5"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
    css: true,
  },
  build: {
    target: "es2015",
    cssTarget: "chrome49", // Para asegurar compatibilidad de CSS en Android 5
    minify: "terser", // Terser es más agresivo y compatible con navegadores viejos
  },
  optimizeDeps: {
    include: ["react-is"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
