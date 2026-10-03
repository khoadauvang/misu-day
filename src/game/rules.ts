import { ITEM_BY_ID } from '../data/items.ts'
import { gameDayKey } from './clock.ts'
import { currentEnergy } from './energy.ts'
import { formatHour } from './format.ts'
import { levelInfo } from './level.ts'
import type { Activity, CategoryId, OpenHours, Place, SaveData } from './types.ts'

// Luật: khi nào Misu làm được một hoạt động, khi nào không (và vì sao).

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Nơi này có mở cửa lúc t không */
export function isOpenAt(open: OpenHours | undefined, t: number): boolean {
  if (!open) return true
  const d = new Date(t)
  const hour = d.getHours() + d.getMinutes() / 60
  let day = d.getDay()
  if (open.hours) {
    const [from, to] = open.hours
    const overnight = to <= from
    const inHours = overnight ? hour >= from || hour < to : hour >= from && hour < to
    if (!inHours) return false
    // Mở qua đêm: 1 giờ sáng thứ Bảy vẫn tính là tối thứ Sáu
    if (overnight && hour < to) day = (day + 6) % 7
  }
  return !open.days || open.days.includes(day)
}

/** "5 PM – 2 AM", "Fri & Sat, 7 PM – 11 PM" */
export function openLabel(open: OpenHours): string {
  const parts: string[] = []
  if (open.days) {
    const names = open.days.map((d) => DAY_NAMES[d])
    parts.push(names.length <= 2 ? names.join(' & ') : `${names.slice(0, -1).join(', ')} & ${names.at(-1)}`)
  }
  if (open.hours) parts.push(`${formatHour(open.hours[0])} – ${formatHour(open.hours[1])}`)
  return parts.join(', ')
}

/** Mã riêng của một hoạt động, ví dụ "gmi-tea/mint-milk-tea" */
export function activityKey(place: Place | null, activity: Activity): string {
  return `${place?.id ?? 'home'}/${activity.id}`
}

function ownsCategory(save: SaveData, category: CategoryId): boolean {
  return Object.entries(save.collection).some(([id, count]) => count > 0 && ITEM_BY_ID[id]?.category === category)
}

export type Check = { ok: true } | { ok: false; icon: string; reason: string }

/** Misu có làm được hoạt động này lúc t không; không được thì kèm lý do để hiện lên */
export function checkActivity(save: SaveData, place: Place | null, activity: Activity, t: number): Check {
  if (activity.comingSoon) return { ok: false, icon: '🎀', reason: 'Coming soon' }

  const needLevel = Math.max(place?.unlockLevel ?? 1, activity.unlockLevel ?? 1)
  if (levelInfo(save.xp).level < needLevel) return { ok: false, icon: '🔒', reason: `Reach Level ${needLevel}` }

  const open = activity.open ?? place?.open
  if (open && !isOpenAt(open, t)) return { ok: false, icon: '⏰', reason: `Open ${openLabel(open)}` }

  if (activity.oncePerDay && save.doneToday[activityKey(place, activity)] === gameDayKey(t)) {
    return { ok: false, icon: '✅', reason: 'Done for today' }
  }
  if (activity.requires && !ownsCategory(save, activity.requires.category)) {
    return { ok: false, icon: '🛍️', reason: activity.requires.hint }
  }
  if (save.money < activity.cost) return { ok: false, icon: '💸', reason: 'Not enough money' }
  if (activity.energy > 0 && currentEnergy(save, t) < activity.energy) {
    return { ok: false, icon: '⚡', reason: 'Need more energy' }
  }
  return { ok: true }
}
