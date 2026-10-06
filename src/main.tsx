import '@fontsource-variable/baloo-2'
import '@fontsource-variable/nunito'
// Chữ viết tay cho thư sinh nhật
import '@fontsource/mali/500.css'
import '@fontsource/mali/600.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Xin trình duyệt giữ dữ liệu game lâu dài, không tự xóa khi máy thiếu dung lượng
navigator.storage?.persist?.().catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
