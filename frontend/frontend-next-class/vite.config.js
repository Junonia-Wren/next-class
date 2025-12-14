import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}']
      },
      manifest: {
        name: 'NextClass App',
        short_name: 'NextClass',
        description: 'Gestión de horarios y tareas escolares',
        start_url: '/',
        display: 'standalone',
        background_color: '#00B8C8',
        theme_color: '#F5F8FA',
        screenshots: [
          {
            src: '/screenshots/720.png',
            sizes: '721x476',
            type: 'image/jpg',
            form_factor: 'wide'
          },
          {
            src: '/screenshots/736.png',
            sizes: '737x1080',
            type: 'image/jpg',
            form_factor: 'narrow'
          }
        ],
        icons: [
          {
            src: '/icons/cat.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/github.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      }
    })
  ],
})
