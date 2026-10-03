import { HUSBAND_NAME } from '../config.ts'
import { DAILY_ALLOWANCE, DIARY_LIMIT, ENERGY_PER_HOUR, MAX_ENERGY } from '../data/economy.ts'
import { daysBetween, gameDayKey } from './clock.ts'
import { formatMoney } from './format.ts'
import type { DiaryEntry, SaveData } from './types.ts'

// Luật chơi viết thành các hàm "thuần": nhận dữ liệu cũ + thời điểm, trả về dữ liệu mới.
// Không đụng tới giao diện hay bộ nhớ điện thoại, nên dễ đọc và dễ kiểm tra.

const HOUR = 3_600_000

/** Dữ liệu của người chơi mới */
export function newSave(t: number): SaveData {
  return {
    startedAt: t,
    money: 0,
    energy: MAX_ENERGY,
    energyAt: t,
    xp: 0,
    lastAllowanceDay: null,
    pendingAllowance: null,
    diary: [],
    collection: {},
    doneToday: {},
    stats: { activities: 0, spent: 0 },
  }
}

/** Năng lượng ở thời điểm t, đã cộng phần hồi theo giờ */
export function currentEnergy(save: SaveData, t: number): number {
  const hours = Math.max(0, t - save.energyAt) / HOUR
  return Math.min(MAX_ENERGY, save.energy + hours * ENERGY_PER_HOUR)
}

/**
 * Chạy khi mở app và mỗi 30 giây.
 * - Hồi năng lượng theo thời gian đã trôi qua.
 * - Qua 6:00 sáng: Chằm Chằm gửi tiền. Vắng nhiều ngày thì cộng dồn, chờ Misu bấm Collect.
 */
export function applyTick(save: SaveData, t: number): SaveData {
  let next: SaveData = { ...save, energy: currentEnergy(save, t), energyAt: t }

  const today = gameDayKey(t)
  const days = save.lastAllowanceDay === null ? 1 : daysBetween(save.lastAllowanceDay, today)
  // days <= 0: đồng hồ bị chỉnh lùi, không gửi thêm
  if (days > 0) {
    const pending = save.pendingAllowance
    next = {
      ...next,
      lastAllowanceDay: today,
      pendingAllowance: {
        days: (pending?.days ?? 0) + days,
        amount: (pending?.amount ?? 0) + days * DAILY_ALLOWANCE,
        day: today,
      },
    }
  }
  return next
}

/** Misu bấm Collect: tiền vào ví, ghi vào nhật ký */
export function collectAllowance(save: SaveData, t: number): SaveData {
  const pending = save.pendingAllowance
  if (!pending) return save
  const text =
    pending.days > 1
      ? `${HUSBAND_NAME} sent ${formatMoney(DAILY_ALLOWANCE)} every morning while you were away.`
      : `${HUSBAND_NAME} sent your allowance for today.`
  return {
    ...save,
    money: save.money + pending.amount,
    pendingAllowance: null,
    diary: addDiary(save.diary, { at: t, emoji: '💸', text, money: pending.amount }),
  }
}

/** Thêm một dòng nhật ký (giữ tối đa DIARY_LIMIT dòng) */
export function addDiary(diary: DiaryEntry[], entry: Omit<DiaryEntry, 'id'>): DiaryEntry[] {
  const id = `${entry.at.toString(36)}-${Math.random().toString(36).slice(2, 7)}`
  return [...diary, { id, ...entry }].slice(-DIARY_LIMIT)
}

/** Các dòng nhật ký của một ngày */
export function diaryForDay(diary: DiaryEntry[], day: string): DiaryEntry[] {
  return diary.filter((entry) => gameDayKey(entry.at) === day)
}
