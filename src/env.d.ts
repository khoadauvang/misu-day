// Biến môi trường cho phần chạy trên iPhone (chỉ biến bắt đầu bằng VITE_ mới vào được code)

interface ImportMetaEnv {
  /** Key GIPHY để hiện GIF phim ở Movie night. Không có thì game hiện emoji như cũ */
  readonly VITE_GIPHY_KEY?: string
}
