import { ENERGY_PER_HOUR, MAX_ENERGY } from '../data/economy.ts'
import type { SaveData } from './types.ts'

const HOUR = 3_600_000

/** Năng lượng ở thời điểm t, đã cộng phần hồi theo giờ (kể cả lúc tắt app) */
export function currentEnergy(save: SaveData, t: number): number {
  const hours = Math.max(0, t - save.energyAt) / HOUR
  return Math.min(MAX_ENERGY, save.energy + hours * ENERGY_PER_HOUR)
}
