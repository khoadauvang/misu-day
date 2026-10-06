import {
  PET_BORED_BELOW,
  PET_FOOD_BY_ID,
  PET_FULLNESS_PER_HOUR,
  PET_HAPPINESS_PER_HOUR,
  PET_HUNGRY_BELOW,
  PET_NAME_MAX,
  PET_START,
  PET_STARTER_PANTRY,
} from '../data/pet.ts'
import { daysBetween, gameDayKey } from './clock.ts'
import type { PetChange, PetEffect, PetState, SaveData } from './types.ts'

// Cún Golden: các phép tính thuần (giống energy.ts). Độ no và độ vui giảm dần theo giờ thật,
// nên chỉ cần lưu giá trị + thời điểm, lúc nào cần thì tính lại.

const HOUR = 3_600_000
const clamp = (n: number) => Math.min(100, Math.max(0, n))

/** Độ no, độ vui của cún lúc t */
export function petStats(pet: PetState, t: number): { fullness: number; happiness: number } {
  const hours = Math.max(0, t - pet.statsAt) / HOUR
  return {
    fullness: clamp(pet.fullness - hours * PET_FULLNESS_PER_HOUR),
    happiness: clamp(pet.happiness - hours * PET_HAPPINESS_PER_HOUR),
  }
}

export type PetMood = 'happy' | 'okay' | 'hungry' | 'bored' | 'sleeping'

/** Tâm trạng để chọn nét mặt và câu hiển thị. Đói thì báo đói trước, kể cả ban đêm */
export function petMood(pet: PetState, t: number): PetMood {
  const { fullness, happiness } = petStats(pet, t)
  if (fullness < PET_HUNGRY_BELOW) return 'hungry'
  const hour = new Date(t).getHours()
  if (hour >= 23 || hour < 6) return 'sleeping'
  if (happiness < PET_BORED_BELOW) return 'bored'
  if (happiness >= 70 && fullness >= 50) return 'happy'
  return 'okay'
}

/** Ngày thứ mấy bên nhau (ngày nhận nuôi là ngày 1) */
export function daysTogether(pet: PetState, t: number): number {
  return Math.max(1, daysBetween(gameDayKey(pet.adoptedAt), gameDayKey(t)) + 1)
}

/** Thay {pet} bằng tên cún */
export function fillPet(text: string, name: string): string {
  return text.replaceAll('{pet}', name || 'my puppy')
}

/** Làm gọn tên Misu gõ: bỏ khoảng trắng thừa, tối đa PET_NAME_MAX ký tự */
export function cleanPetName(raw: string | undefined): string {
  return Array.from((raw ?? '').replace(/\s+/g, ' ').trim()).slice(0, PET_NAME_MAX).join('').trim()
}

/** Cộng/trừ đồ trong tủ; món nào hết thì bỏ khỏi tủ */
export function addPantry(pantry: Record<string, number>, add: Record<string, number>): Record<string, number> {
  const next = { ...pantry }
  for (const [id, n] of Object.entries(add)) {
    const count = (next[id] ?? 0) + n
    if (count > 0) next[id] = count
    else delete next[id]
  }
  return next
}

/** Tổng số phần đồ ăn còn trong tủ */
export function pantryCount(pantry: Record<string, number>): number {
  return Object.entries(pantry).reduce((sum, [id, n]) => sum + (PET_FOOD_BY_ID[id] ? n : 0), 0)
}

export type PetStep = { pet: PetState | null; pantry: Record<string, number>; change?: PetChange }

/**
 * Tác dụng của một hoạt động lên cún và tủ đồ ăn.
 * - adopt: tạo cún mới (tên do Misu đặt) + đồ ăn tặng kèm
 * - buy: thêm đồ ăn vào tủ · feed: lấy 1 phần trong tủ ra cho ăn
 * - fullness / happiness: cộng thẳng (đi dạo, chơi, spa)
 */
export function applyPetEffect(save: SaveData, effect: PetEffect | undefined, t: number, newName = ''): PetStep {
  if (!effect) return { pet: save.pet, pantry: save.pantry }

  if (effect.adopt) {
    const pet: PetState = { name: newName, adoptedAt: t, ...PET_START, statsAt: t }
    return {
      pet,
      pantry: addPantry(save.pantry, PET_STARTER_PANTRY),
      change: { name: pet.name, ...PET_START, fullnessGain: 0, happinessGain: 0, adopted: true },
    }
  }

  const pet = save.pet
  if (!pet) return { pet, pantry: save.pantry }

  let pantry = save.pantry
  let fullness = effect.fullness ?? 0
  let happiness = effect.happiness ?? 0
  if (effect.buy) pantry = addPantry(pantry, { [effect.buy.food]: effect.buy.servings })
  if (effect.feed) {
    const food = PET_FOOD_BY_ID[effect.feed]
    pantry = addPantry(pantry, { [effect.feed]: -1 })
    fullness += food?.fullness ?? 0
    happiness += food?.happiness ?? 0
  }

  const before = petStats(pet, t)
  const after = { fullness: clamp(before.fullness + fullness), happiness: clamp(before.happiness + happiness) }
  return {
    pet: { ...pet, ...after, statsAt: t },
    pantry,
    change: {
      name: pet.name,
      ...after,
      fullnessGain: Math.round(after.fullness - before.fullness),
      happinessGain: Math.round(after.happiness - before.happiness),
      bought: effect.buy,
    },
  }
}
