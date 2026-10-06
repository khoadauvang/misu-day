import { HUSBAND_NAME } from '../config.ts'
import { DAILY_ALLOWANCE, DIARY_LIMIT, EXTRA_MONEY, LEVEL_REWARD_STEP, MAX_ENERGY } from '../data/economy.ts'
import { COUPONS, COUPON_BY_ID } from '../data/coupons.ts'
import { ITEM_BY_ID } from '../data/items.ts'
import { MESSAGE_HISTORY_LIMIT, MESSAGE_MAX_LENGTH, QUICK_MESSAGES } from '../data/messages.ts'
import { daysBetween, gameDayKey } from './clock.ts'
import { currentEnergy } from './energy.ts'
import { formatMoney } from './format.ts'
import { husbandStatus } from './husband.ts'
import { levelInfo } from './level.ts'
import { askedExtraToday, canSendMore, pickReply } from './messages.ts'
import { activityKey, checkActivity } from './rules.ts'
import { unlocksBetween } from './unlocks.ts'
import type { Activity, ActivityResult, ChatMessage, Delivery, DiaryEntry, MessageKind, Place, SaveData } from './types.ts'

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
    messages: [],
    extraDay: null,
    lastItem: null,
    coupons: {},
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
    lastItem: item ? item.id : current.lastItem,
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
      newCoupons: leveled.coupons.length > 0 ? leveled.coupons : undefined,
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
 * Module 10: mỗi level còn tặng ngẫu nhiên 1 Love Coupon chưa có (hết phiếu thì thôi).
 * Lên nhiều level một lúc thì nhận thưởng của từng level.
 */
export function applyLevelUps(
  save: SaveData,
  from: number,
  to: number,
  t: number,
  random: () => number = Math.random,
): { save: SaveData; reward: number; coupons: string[] } {
  let next = save
  let reward = 0
  const coupons: string[] = []
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
    const left = COUPONS.filter((c) => !next.coupons[c.id])
    if (left.length > 0) {
      const coupon = left[Math.floor(random() * left.length)]
      coupons.push(coupon.id)
      next = {
        ...next,
        coupons: { ...next.coupons, [coupon.id]: { gotAt: t, level } },
        diary: addDiary(next.diary, { at: t, emoji: '🎟️', text: `New Love Coupon: ${coupon.title}` }),
      }
    }
  }
  return { save: next, reward, coupons }
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

// --- Module 9: tin nhắn với Chằm Chằm ---

export type MessageInput = { kind: MessageKind; text?: string }
export type MessageOutcome = { save: SaveData; message?: ChatMessage; reply?: ChatMessage; error?: string }

function messageId(t: number): string {
  return `${t.toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Misu gửi một tin. Chằm Chằm trả lời ngay bằng câu viết sẵn, tùy việc anh đang làm.
 * "Can I have a little extra?" thì anh gửi thêm tiền (mỗi ngày 1 lần).
 * Tin của Misu ở trạng thái "sending"; việc gửi email thật nằm ở src/game/actions.ts.
 */
export function applyMessage(save: SaveData, input: MessageInput, t: number): MessageOutcome {
  const quick = QUICK_MESSAGES.find((q) => q.kind === input.kind)
  const text = (input.kind === 'text' ? (input.text ?? '') : (quick?.text ?? '')).trim().slice(0, MESSAGE_MAX_LENGTH)
  if (!text) return { save, error: 'Type a message first' }
  if (!canSendMore(save, t)) return { save, error: 'That’s a lot of love for one day 💌 More tomorrow!' }

  const extra = input.kind === 'extra'
  if (extra && askedExtraToday(save, t)) return { save, error: 'One little extra a day 💸 Ask again tomorrow!' }

  const status = husbandStatus(t)
  const item = input.kind === 'look-bought' && save.lastItem ? ITEM_BY_ID[save.lastItem] : undefined
  const money = extra ? EXTRA_MONEY : 0

  const message: ChatMessage = {
    id: messageId(t),
    at: t,
    from: 'misu',
    kind: input.kind,
    text,
    item: item?.id,
    delivery: 'sending',
    deliveryAt: t,
  }
  const reply: ChatMessage = {
    id: messageId(t + 1),
    at: t + 1,
    from: 'husband',
    text: pickReply(input.kind, { item, money, status }),
    money: money > 0 ? money : undefined,
  }

  let next: SaveData = {
    ...save,
    messages: [...save.messages, message, reply].slice(-MESSAGE_HISTORY_LIMIT),
  }
  if (extra) {
    next = {
      ...next,
      money: next.money + money,
      extraDay: gameDayKey(t),
      diary: addDiary(next.diary, {
        at: t,
        emoji: '💸',
        text: `Asked ${HUSBAND_NAME} for a little extra. He sent ${formatMoney(money)}.`,
        money,
      }),
    }
  }
  return { save: next, message, reply }
}

/** Cập nhật trạng thái gửi email của một tin */
export function setDelivery(save: SaveData, id: string, delivery: Delivery, t: number): SaveData {
  return {
    ...save,
    messages: save.messages.map((m) => (m.id === id ? { ...m, delivery, deliveryAt: t } : m)),
  }
}

// --- Module 10: Love Coupons ---

/** Misu bấm Use: phiếu chuyển sang "đang chờ Chằm Chằm", email đi ngầm (xem actions.ts) */
export function redeemCoupon(save: SaveData, id: string, t: number): SaveData {
  const coupon = save.coupons[id]
  if (!coupon || coupon.usedAt) return save
  const info = COUPON_BY_ID[id]
  return {
    ...save,
    coupons: { ...save.coupons, [id]: { ...coupon, usedAt: t, delivery: 'sending', deliveryAt: t } },
    diary: addDiary(save.diary, { at: t, emoji: info?.emoji ?? '🎟️', text: `Used a Love Coupon: ${info?.title ?? id}` }),
  }
}

/** Misu đánh dấu "It happened 💗": Chằm Chằm đã làm xong việc ngoài đời */
export function markCouponDone(save: SaveData, id: string, t: number): SaveData {
  const coupon = save.coupons[id]
  if (!coupon?.usedAt || coupon.doneAt) return save
  return { ...save, coupons: { ...save.coupons, [id]: { ...coupon, doneAt: t } } }
}

/** Cập nhật trạng thái email của một phiếu */
export function setCouponDelivery(save: SaveData, id: string, delivery: Delivery, t: number): SaveData {
  const coupon = save.coupons[id]
  if (!coupon) return save
  return { ...save, coupons: { ...save.coupons, [id]: { ...coupon, delivery, deliveryAt: t } } }
}
