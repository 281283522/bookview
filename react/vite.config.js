import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/bookview/" : "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "icon-144x144.png",
        "icon-192x192.png",
        "icon-512x512.png",
      ],
      manifest: {
        name: "小说阅读器",
        short_name: "阅读",
        description: "离线小说阅读器",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#1a1a2e",
        theme_color: "#1a1a2e",
        icons: [
          {
            src: "icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico,json,md}"],
      },
    }),
  ],
  server: {
    port: 5177,
    host: "0.0.0.0",
    open: true,
    hmr: true,
    progress: true,
  },
  css: {},
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  assetsInclude: ["**/*.md"],
}));
