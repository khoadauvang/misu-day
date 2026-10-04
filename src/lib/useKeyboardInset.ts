import { useEffect, useState } from 'react'

/**
 * Bàn phím iPhone đang che bao nhiêu px ở đáy màn hình (0 nếu bàn phím đóng).
 * Dùng để đẩy ô nhập tin nhắn lên ngay trên bàn phím.
 */
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const update = () => {
      const covered = window.innerHeight - viewport.height - viewport.offsetTop
      setInset(covered > 80 ? Math.round(covered) : 0) // dưới 80px là thanh công cụ, không phải bàn phím
    }
    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
    }
  }, [])

  return inset
}
