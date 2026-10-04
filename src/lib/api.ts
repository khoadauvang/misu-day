// Gọi các hàm chạy trên Vercel (thư mục api/ ở gốc dự án).

/** Dữ liệu gửi lên /api/message (xem api/message.js) */
export type MessagePayload = {
  /** Gửi từ chế độ ?dev: email có chữ [Test] */
  test: boolean
  game: string
  player: string
  husband: string
  kind: string
  text: string
  item: { emoji: string; name: string } | null
  /** Tiền Chằm Chằm gửi thêm trong game (0 nếu không có) */
  money: number
  /** Câu Chằm Chằm trả lời trong game */
  reply: string
  sentAt: number
  snapshot: {
    level: number
    money: number
    energy: number
    stickers: number
    /** Chằm Chằm đang làm gì trong game */
    status: string
    /** Nhật ký hôm nay, mới nhất ở trên */
    diary: { time: string; text: string }[]
  }
}

const TIMEOUT_MS = 15_000

/** Gửi tin thành email thật. Trả về true nếu email đã đi. */
export async function postMessage(payload: MessagePayload): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    return res.ok
  } catch {
    return false // mất mạng, quá thời gian…
  } finally {
    clearTimeout(timer)
  }
}
