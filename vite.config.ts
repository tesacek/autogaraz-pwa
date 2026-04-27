import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: 'AutoGaráž',
        short_name: 'AutoGaráž',
        description: 'Prémiové automobily – garáž a oblíbené',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/icons/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],

  server: {
    proxy: {
      // Proxujeme CarQuery přes Vite (obchází CORS v prohlížeči)
      '/api/cars': {
        target: 'https://www.carqueryapi.com/api/0.3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cars/, ''),
      },
    },
  },
})