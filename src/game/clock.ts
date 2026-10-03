import { DAY_START_HOUR } from '../data/economy.ts'
import { isDevMode } from '../lib/device.ts'

// Đồng hồ của game: theo giờ thật trên điện thoại.
// Ngày mới trong game bắt đầu lúc 6:00 sáng (DAY_START_HOUR), không phải nửa đêm.

const HOUR = 3_600_000
const DEV_OFFSET_KEY = 'misu-day:dev-time-offset'

/** Giờ hiện tại của game (mili giây). Chế độ ?dev có thể "tua" giờ để thử. */
export function gameNow(): number {
  return Date.now() + (isDevMode() ? getDevOffset() : 0)
}

/** Mã ngày trong game, dạng 2026-10-09. 5:59 sáng vẫn tính là ngày hôm trước. */
export function gameDayKey(t: number): string {
  const d = new Date(t - DAY_START_HOUR * HOUR)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

/** Số ngày từ mã ngày a tới mã ngày b */
export function daysBetween(a: string, b: string): number {
  const toUtc = (key: string) => {
    const [y, m, d] = key.split('-').map(Number)
    return Date.UTC(y, m - 1, d)
  }
  return Math.round((toUtc(b) - toUtc(a)) / (24 * HOUR))
}

/** Lần 6:00 sáng kế tiếp sau thời điểm t */
export function nextDayStart(t: number): number {
  const d = new Date(t)
  d.setHours(DAY_START_HOUR, 0, 0, 0)
  if (d.getTime() <= t) d.setDate(d.getDate() + 1)
  return d.getTime()
}

// --- Chỉ dùng trong chế độ ?dev ---

export function getDevOffset(): number {
  try {
    return Number(localStorage.getItem(DEV_OFFSET_KEY)) || 0
  } catch {
    return 0
  }
}

export function addDevOffset(ms: number) {
  try {
    localStorage.setItem(DEV_OFFSET_KEY, String(getDevOffset() + ms))
  } catch {
    // trình duyệt chặn lưu trữ thì bỏ qua
  }
}

export function clearDevOffset() {
  try {
    localStorage.removeItem(DEV_OFFSET_KEY)
  } catch {
    // bỏ qua
  }
}
