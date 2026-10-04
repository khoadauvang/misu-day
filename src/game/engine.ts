import { HUSBAND_NAME } from '../config.ts'
import { DAILY_ALLOWANCE, DIARY_LIMIT, LEVEL_REWARD_STEP, MAX_ENERGY } from '../data/economy.ts'
import { ITEM_BY_ID } from '../data/items.ts'
import { daysBetween, gameDayKey } from './clock.ts'
import { currentEnergy } from './energy.ts'
import { formatMoney } from './format.ts'
import { levelInfo } from './level.ts'
import { activityKey, checkActivity } from './rules.ts'
import { unlocksBetween } from './unlocks.ts'
import type { Activity, ActivityResult, DiaryEntry, Place, SaveData } from './types.ts'

// Luật chơi viết thành các hàm "thuần": nhận dữ liệu cũ + thời điểm, trả về dữ liệu mới.
// Không đụng tới giao diện hay bộ nhớ điện thoại, nên dễ đọc và dễ kiểm tra.

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

export type ActivityOutcome = { save: SaveData; result?: ActivityResult; error?: string }

/** Misu làm một hoạt động: trừ tiền và năng lượng, cộng XP, nhận đồ, ghi nhật ký */
export function applyActivity(save: SaveData, place: Place | null, activity: Activity, t: number): ActivityOutcome {
  const current = applyTick(save, t) // cập nhật năng lượng tới đúng thời điểm này trước
  const check = checkActivity(current, place, activity, t)
  if (!check.ok) return { save: current, error: check.reason }

  const energyBefore = currentEnergy(current, t)
  const energy = Math.min(MAX_ENERGY, Math.max(0, energyBefore - activity.energy))
  const item = activity.item ? ITEM_BY_ID[activity.item] : undefined
  const collection = item
    ? { ...current.collection, [item.id]: (current.collection[item.id] ?? 0) + 1 }
    : current.collection
  const text = activity.diary[Math.floor(Math.random() * activity.diary.length)] ?? activity.name

  const next: SaveData = {
    ...current,
    money: current.money - activity.cost,
    energy,
    energyAt: t,
    xp: current.xp + activity.xp,
    collection,
    doneToday: activity.oncePerDay
      ? { ...current.doneToday, [activityKey(place, activity)]: gameDayKey(t) }
      : current.doneToday,
    diary: addDiary(current.diary, {
      at: t,
      emoji: item?.emoji ?? activity.emoji,
      text,
      money: activity.cost > 0 ? -activity.cost : undefined,
      energy: Math.round(energy - energyBefore),
      xp: activity.xp,
    }),
    stats: { activities: current.stats.activities + 1, spent: current.stats.spent + activity.cost },
  }

  const levelBefore = levelInfo(current.xp).level
  const levelAfter = levelInfo(next.xp).level
  const leveled = applyLevelUps(next, levelBefore, levelAfter, t)

  return {
    save: leveled.save,
    result: {
      placeName: place?.name ?? 'Home',
      activity,
      text,
      money: -activity.cost,
      energy: Math.round(energy - energyBefore),
      xp: activity.xp,
      item,
      itemCount: item ? collection[item.id] : undefined,
      levelBefore,
      levelAfter,
      levelReward: leveled.reward,
      unlocked: levelAfter > levelBefore ? unlocksBetween(levelBefore, levelAfter) : undefined,
    },
  }
}

/** Thưởng của Chằm Chằm khi lên level L */
export function levelReward(level: number): number {
  return level * LEVEL_REWARD_STEP
}

/**
 * Module 6: lên level thì Chằm Chằm thưởng tiền (Level × 500,000₫), ghi vào nhật ký.
 * Lên nhiều level một lúc thì nhận thưởng của từng level.
 */
export function applyLevelUps(save: SaveData, from: number, to: number, t: number): { save: SaveData; reward: number } {
  let next = save
  let reward = 0
  for (let level = from + 1; level <= to; level++) {
    const amount = levelReward(level)
    reward += amount
    next = {
      ...next,
      money: next.money + amount,
      diary: addDiary(next.diary, {
        at: t,
        emoji: '🎉',
        text: `Reached Level ${level}! ${HUSBAND_NAME} sent ${formatMoney(amount)} to celebrate.`,
        money: amount,
      }),
    }
  }
  return { save: next, reward }
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
