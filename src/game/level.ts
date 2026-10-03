import { XP_STEP } from '../data/economy.ts'

export type LevelInfo = {
  level: number
  /** XP đã có trong level hiện tại */
  into: number
  /** XP cần để lên level kế tiếp */
  needed: number
}

/** Từ tổng XP tính ra level. Từ level n lên n+1 cần XP_STEP × n XP. */
export function levelInfo(totalXp: number): LevelInfo {
  let level = 1
  let rest = Math.max(0, Math.floor(totalXp))
  while (rest >= XP_STEP * level) {
    rest -= XP_STEP * level
    level += 1
  }
  return { level, into: rest, needed: XP_STEP * level }
}
