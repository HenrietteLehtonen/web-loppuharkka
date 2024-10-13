import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,ttf}"],
      },
      includeAssets: ["logo-192.png", "main.css", "BebasNeue-Regular.ttf"],
      manifest: {
        name: "Skule Safkat",
        short_name: "SS",
        description: "Loppuharkka",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icons/logo-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/logo-256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/logo-384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/logo-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
