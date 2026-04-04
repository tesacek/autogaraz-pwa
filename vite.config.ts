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
      // Firebase Functions emulátor běží na portu 5001
      // Format: http://localhost:5001/{projectId}/{region}/{functionName}
      '/api/cars': {
        target: 'http://localhost:5001/autogaraz-pwa/europe-west1/cars',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cars/, ''),
      },
      '/api/carImage': {
        target: 'http://localhost:5001/autogaraz-pwa/europe-west1/carImage',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/carImage/, ''),
      },
    },
  },
})