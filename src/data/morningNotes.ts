import { daysBetween } from '../game/clock.ts'

// Lời nhắn buổi sáng của Chằm Chằm: mỗi sáng một câu, lần lượt từ trên xuống rồi quay vòng.
// Đây là 2 câu mẫu. Bạn sửa theo giọng của bạn và thêm câu mới vào cuối (viết bằng tiếng Anh).
export const MORNING_NOTES: string[] = [
  'Good morning, bè chẽ ☀️ Your allowance is in. Eat breakfast first, then go have fun!',
  'Rise and shine, bè chẽ 💗 Treat yourself to something cute today and tell me all about it tonight.',
]

/** Lời nhắn của một ngày (mã ngày dạng 2026-10-09) */
export function noteForDay(day: string): string {
  const n = MORNING_NOTES.length
  const index = daysBetween('2026-01-01', day)
  return MORNING_NOTES[((index % n) + n) % n]
}
