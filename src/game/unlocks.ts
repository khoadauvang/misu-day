import { DESTINATIONS, type Destination } from '../data/destinations.ts'
import { PLACES } from '../data/places.ts'
import type { Activity, Place } from './types.ts'

// Module 6: lên level nào thì mở khóa những gì.
// Đọc thẳng từ dữ liệu (unlockLevel trong places.ts, destinations.ts), nên thêm nơi mới không cần sửa file này.

export type Unlocks = {
  places: Place[]
  /** Hoạt động mới ở nơi đã mở từ trước (ví dụ concert ở D9 cần level cao hơn rạp phim) */
  activities: { place: Place; activity: Activity }[]
  destinations: Destination[]
}

/** Những thứ mở khóa đúng ở level này */
export function unlocksAtLevel(level: number): Unlocks {
  const places = PLACES.filter((place) => place.unlockLevel === level)
  const activities = PLACES.flatMap((place) =>
    place.activities
      .filter((a) => a.unlockLevel === level && a.unlockLevel > place.unlockLevel)
      .map((activity) => ({ place, activity })),
  )
  const destinations = DESTINATIONS.filter((d) => d.unlockLevel === level)
  return { places, activities, destinations }
}

/** Gộp mọi thứ mở khóa từ level from+1 tới level to (lên nhiều level một lúc) */
export function unlocksBetween(from: number, to: number): Unlocks {
  const all: Unlocks = { places: [], activities: [], destinations: [] }
  for (let level = from + 1; level <= to; level++) {
    const u = unlocksAtLevel(level)
    all.places.push(...u.places)
    all.activities.push(...u.activities)
    all.destinations.push(...u.destinations)
  }
  return all
}

/** Level kế tiếp có mở khóa thứ gì đó (để gợi ý "Next unlock at Level X") */
export function nextUnlockLevel(level: number, maxLevel = 30): number | null {
  for (let l = level + 1; l <= maxLevel; l++) {
    const u = unlocksAtLevel(l)
    if (u.places.length + u.activities.length + u.destinations.length > 0) return l
  }
  return null
}
