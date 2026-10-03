import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { GAME_DESCRIPTION, GAME_NAME, PAPER_COLOR } from './src/config.ts'

const escapeHtml = (text: string) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      // Điền tên game vào index.html, để tên chỉ cần sửa ở src/config.ts
      name: 'game-name-in-html',
      transformIndexHtml: (html) =>
        html
          .replaceAll('{{GAME_NAME}}', escapeHtml(GAME_NAME))
          .replaceAll('{{GAME_DESCRIPTION}}', escapeHtml(GAME_DESCRIPTION))
          .replaceAll('{{PAPER_COLOR}}', PAPER_COLOR),
    },
    // PWA: tạo manifest (tên, icon, mở toàn màn hình) và service worker (chạy offline, nhận bản cập nhật)
    VitePWA({
      registerType: 'prompt', // có bản mới thì hỏi Misu trước khi tải lại
      injectRegister: false, // tự đăng ký trong src/pwa/UpdateToast.tsx
      manifest: {
        id: '/',
        name: GAME_NAME,
        short_name: GAME_NAME,
        description: GAME_DESCRIPTION,
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: PAPER_COLOR,
        theme_color: PAPER_COLOR,
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Không tải sẵn font chữ Nga/Ấn: game chỉ dùng chữ Latin + tiếng Việt
        globIgnores: ['**/*-cyrillic*', '**/*-devanagari*'],
        navigateFallbackDenylist: [/^\/api\//], // chừa đường /api cho Module 9 (gửi email)
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
