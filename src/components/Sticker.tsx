type StickerProps = {
  emoji: string
  /** Mô tả cho trình đọc màn hình; bỏ trống nếu chỉ để trang trí */
  label?: string
  className?: string
}

/** Emoji hiển thị như sticker cắt bế (viền trắng + bóng) */
export function Sticker({ emoji, label, className = '' }: StickerProps) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`sticker inline-block leading-none ${className}`}
    >
      {emoji}
    </span>
  )
}
