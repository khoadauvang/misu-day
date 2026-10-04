import type { HusbandStatusId } from '../data/husband.ts'
import { DAILY_MESSAGE_LIMIT, REPLIES, type ReplyMood } from '../data/messages.ts'
import { gameDayKey } from './clock.ts'
import { formatClock, formatMoney } from './format.ts'
import type { HusbandStatus } from './husband.ts'
import type { ChatMessage, Item, MessageKind, SaveData } from './types.ts'

// Module 9: các phép tính nhỏ cho tin nhắn (đều là hàm thuần).

/** Trạng thái của Chằm Chằm → tâm trạng khi trả lời */
export function replyMood(id: HusbandStatusId): ReplyMood {
  switch (id) {
    case 'getting-ready':
      return 'morning'
    case 'office':
      return 'work'
    case 'lunch':
      return 'lunch'
    case 'driving-to-work':
    case 'driving-home':
      return 'driving'
    case 'home':
    case 'weekend':
      return 'home'
    case 'band':
      return 'band'
    case 'sleeping':
      return 'sleeping'
  }
}

type ReplyVars = { item?: Item; money?: number; status: HusbandStatus }

/** Điền các chỗ trống {item}, {amount}, {until} trong câu trả lời */
export function fillReply(line: string, vars: ReplyVars): string {
  return line
    .replaceAll('{item}', vars.item?.name ?? '')
    .replaceAll('{amount}', formatMoney(vars.money ?? 0))
    .replaceAll('{until}', formatClock(vars.status.until))
}

/**
 * Chọn câu trả lời của Chằm Chằm: theo loại tin + việc anh đang làm.
 * Không có món đồ gửi kèm thì bỏ qua các câu cần {item}.
 */
export function pickReply(kind: MessageKind, vars: ReplyVars, random: () => number = Math.random): string {
  const pools = REPLIES[kind]
  const usable = (lines: string[] | undefined) => (lines ?? []).filter((line) => vars.item || !line.includes('{item}'))
  let lines = usable(pools[replyMood(vars.status.id)])
  if (lines.length === 0) lines = usable(pools.any)
  if (lines.length === 0) return '💗'
  return fillReply(lines[Math.floor(random() * lines.length)], vars)
}

/** Số tin Misu đã gửi trong ngày (ngày trong game, bắt đầu lúc 6:00 sáng) */
export function sentToday(messages: ChatMessage[], day: string): number {
  return messages.filter((m) => m.from === 'misu' && gameDayKey(m.at) === day).length
}

/** Hôm nay còn gửi được tin không */
export function canSendMore(save: SaveData, t: number): boolean {
  return sentToday(save.messages, gameDayKey(t)) < DAILY_MESSAGE_LIMIT
}

/** Hôm nay đã xin "a little extra" chưa */
export function askedExtraToday(save: SaveData, t: number): boolean {
  return save.extraDay === gameDayKey(t)
}

/** Tin đang "Sending…" quá lâu (ví dụ tắt app giữa chừng) thì coi như chưa gửi được */
export const SENDING_TIMEOUT_MS = 30_000

export function shownDelivery(message: ChatMessage, t: number): ChatMessage['delivery'] {
  if (message.delivery === 'sending' && t - (message.deliveryAt ?? message.at) > SENDING_TIMEOUT_MS) return 'failed'
  return message.delivery
}
