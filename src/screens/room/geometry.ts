import { ITEM_BY_ID } from '../../data/items.ts'

// Khung vẽ căn phòng (tab Home) và vài hàm nhỏ dùng chung cho RoomArt.tsx / HomeScreen.tsx.

export const ROOM_W = 360
export const ROOM_H = 440
/** Tường sau: từ (WALL_L, WALL_TOP) tới (WALL_R, FLOOR_Y) */
export const WALL_L = 34
export const WALL_R = 326
export const WALL_TOP = 22
export const FLOOR_Y = 292

/** Buổi trong ngày: đổi màu trời ngoài cửa sổ và độ sáng phòng */
export type DayPart = 'day' | 'sunset' | 'night'

export function dayPart(hour: number): DayPart {
  if (hour >= 6 && hour < 17) return 'day'
  if (hour >= 17 && hour < 19) return 'sunset'
  return 'night'
}

/** Đồ sưu tập bày lên kệ: các món không phải sách / hoa / thú bông, mỗi loại một món */
export function trinketEmojis(collection: Record<string, number>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const [id, count] of Object.entries(collection)) {
    const item = ITEM_BY_ID[id]
    if (!item || count <= 0 || ['books', 'flowers', 'plushies'].includes(item.category) || seen.has(item.category)) continue
    seen.add(item.category)
    out.push(item.emoji)
  }
  return out
}
