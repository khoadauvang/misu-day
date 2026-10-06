import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Connect } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { GAME_DESCRIPTION, GAME_NAME, PAPER_COLOR } from './src/config.ts'

const escapeHtml = (text: string) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

/**
 * Chạy thử trên Mac (npm run dev / preview) thì không có hàm Vercel /api/message.
 * Đường này giả lập: in tin nhắn ra Terminal và báo "đã gửi", không gửi email thật.
 */
const fakeMessageApi: Connect.NextHandleFunction = (req, res, next) => {
  if (req.method !== 'POST') return next()
  let body = ''
  req.on('data', (chunk) => (body += chunk))
  req.on('end', () => {
    try {
      const { text, reply } = JSON.parse(body) as { text?: string; reply?: string }
      console.log(`\n📨 (local, no email) Misu: ${text}\n   Chằm Chằm: ${reply}`)
    } catch {
      // bỏ qua
    }
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true, local: true }))
  })
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'local-message-api',
      configureServer: (server) => void server.middlewares.use('/api/message', fakeMessageApi),
      configurePreviewServer: (server) => void server.middlewares.use('/api/message', fakeMessageApi),
    },
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
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        // Không tải sẵn font chữ Nga/Ấn/Thái: game chỉ dùng chữ Latin + tiếng Việt
        globIgnores: ['**/*-cyrillic*', '**/*-devanagari*', '**/*-thai-*'],
        navigateFallbackDenylist: [/^\/api\//], // chừa đường /api cho Module 9 (gửi email)
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
