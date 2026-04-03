// vite.config.ts
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
        icons: [
          { src: '/icons/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
    }),
  ],

  server: {
    proxy: {
      // Všechna volání na /api/carquery se přepošlou na CarQuery API
      // Vite proxy automaticky přidá správné CORS hlavičky
      '/api/carquery': {
        target: 'https://www.carqueryapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/carquery/, '/api/0.3'),
        secure: true,
      },
    },
  },
})
