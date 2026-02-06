import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "rozioi.pro",
      "madly-modern-brill.cloudpub.ru",
      "rampantly-reasonable-millipede.cloudpub.ru",
      "doctor-chat-backend.vercel.app",
      "doctor-chat-c-lient.vercel.app",
      "soundly-primary-protozoa.cloudpub.ru",
    ],
  },
  assetsInclude: ["**/*.md"],
  build: {
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router"],
          "ui-vendor": ["antd"],
          "pdf-vendor": ["react-pdf", "pdfjs-dist"],
          "query-vendor": ["@tanstack/react-query"],
          "telegram-vendor": ["@twa-dev/sdk"],
          "utils-vendor": ["axios", "swiper", "i18next", "react-i18next"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router",
      "@tanstack/react-query",
      "antd",
      "@twa-dev/sdk",
    ],
  },
});
