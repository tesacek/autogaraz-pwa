// vite.config.ts
// Konfigurace Vite s pluginy pro React a PWA (Progressive Web App)
// Plugin vite-plugin-pwa automaticky generuje service worker a manifest

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    // React plugin – podporuje JSX/TSX transformaci a Fast Refresh
    react(),

    // PWA plugin – generuje service worker s cache strategiemi
    VitePWA({
      registerType: 'autoUpdate', // SW se automaticky aktualizuje při nové verzi

      // Workbox konfigurace pro offline caching
      workbox: {
        // Precache všechny assety vygenerované Vite buildem
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],

        // Runtime caching pro API požadavky (CarQuery API)
        runtimeCaching: [
          {
            // Cache CarQuery API odpovědi na 24 hodin
            urlPattern: /^http:\/\/www\.carqueryapi\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'carquery-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hodin
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache Unsplash obrázků
            urlPattern: /^https:\/\/source\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 dní
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },

      // Web App Manifest – metadata pro instalaci PWA
      manifest: {
        name: 'AutoGaráž',
        short_name: 'AutoGaráž',
        description: 'Prohlížejte, ukládejte a porovnávejte prémiové automobily',
        theme_color: '#0f0f0f',
        background_color: '#0f0f0f',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      // Vývojářský mód – aktivuje SW i v dev prostředí
      devOptions: {
        enabled: true,
      },
    }),
  ],

  // Resolve aliasy pro pohodlnější importy
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
