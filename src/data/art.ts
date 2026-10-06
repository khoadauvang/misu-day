// Hình vẽ riêng của game (nằm trong public/). Muốn đổi hình: chép file mới đè lên, giữ nguyên tên.
// Ảnh chibi đã tách nền + viền trắng kiểu sticker; ảnh "head" là phần đầu, dùng cho avatar tròn.

export const ART = {
  misu: { full: '/chibi/misu.webp', head: '/chibi/misu-head.webp' },
  husband: { full: '/chibi/husband.webp', head: '/chibi/husband-head.webp' },
} as const

export type ArtWho = keyof typeof ART
