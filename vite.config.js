import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      // O service worker e registrado automaticamente
      registerType: 'autoUpdate',

      // Garante que o SW seja incluido no build
      injectRegister: 'auto',

      // Arquivos que o service worker deve pre-cachear
      workbox: {
        // Cacheia todos os assets gerados pelo Vite
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        // Network First para o HTML raiz — garante que o app sempre abre
        navigateFallback: '/index.html',

        // Cache First com revalidacao para assets estaticos (JS, CSS, fontes)
        runtimeCaching: [
          {
            // Fontes do Google Fonts (cache por 1 ano)
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Arquivos de fonte (woff2, woff, ttf)
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },

      // Manifest do PWA — identidade do app
      manifest: {
        name: 'Listinha — Lista de Compras',
        short_name: 'Listinha',
        description: 'Sua lista de compras organizada por categorias, com controle de orçamento.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',

        // Cores alinhadas com o dark mode do app
        background_color: '#1a1a1a',
        theme_color: '#9b5de5',

        lang: 'pt-BR',
        dir: 'ltr',

        categories: ['shopping', 'productivity', 'lifestyle'],

        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],

        // Screenshots para a tela de instalacao (opcional, melhora o Lighthouse)
        screenshots: [
          {
            src: '/screenshots/mobile.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Listinha no celular',
          },
        ],
      },

      // Configuracoes de desenvolvimento
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
})
