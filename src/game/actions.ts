import { GAME_NAME, HUSBAND_NAME, PLAYER_NAME } from '../config.ts'
import { ITEM_BY_ID } from '../data/items.ts'
import { postMessage, type MessagePayload } from '../lib/api.ts'
import { isDevMode } from '../lib/device.ts'
import { gameDayKey, gameNow } from './clock.ts'
import { currentEnergy } from './energy.ts'
import { diaryForDay, type MessageInput } from './engine.ts'
import { formatClock } from './format.ts'
import { husbandStatus } from './husband.ts'
import { levelInfo } from './level.ts'
import { shownDelivery } from './messages.ts'
import { useGame } from './store.ts'
import type { Activity, ChatMessage, Place, SaveData } from './types.ts'
import { useUi } from './ui.ts'

// Các việc có "tác dụng phụ": hiện popup, gọi mạng… Luật chơi thuần nằm ở engine.ts.

/** Làm hoạt động rồi hiện popup kết quả (place = null là hoạt động ở nhà) */
export function runActivity(place: Place | null, activity: Activity) {
  const outcome = useGame.getState().doActivity(place, activity)
  if (outcome.result) useUi.getState().showResult(outcome.result)
  return outcome
}

// --- Module 9: tin nhắn thành email thật ---

/** Gom thông tin gửi kèm email: tin nhắn, câu trả lời, Misu đang ra sao */
function buildPayload(save: SaveData, message: ChatMessage, reply: ChatMessage | undefined, t: number): MessagePayload {
  const item = message.item ? ITEM_BY_ID[message.item] : undefined
  const status = husbandStatus(t)
  return {
    test: isDevMode(),
    game: GAME_NAME,
    player: PLAYER_NAME,
    husband: HUSBAND_NAME,
    kind: message.kind ?? 'text',
    text: message.text,
    item: item ? { emoji: item.emoji, name: item.name } : null,
    money: reply?.money ?? 0,
    reply: reply?.text ?? '',
    sentAt: message.at,
    snapshot: {
      level: levelInfo(save.xp).level,
      money: save.money,
      energy: currentEnergy(save, t),
      stickers: Object.values(save.collection).filter((count) => count > 0).length,
      status: `${status.label} ${status.emoji}${status.detail ? ` (${status.detail})` : ''}`,
      diary: diaryForDay(save.diary, gameDayKey(t))
        .reverse()
        .slice(0, 5)
        .map((entry) => ({ time: formatClock(entry.at), text: entry.text })),
    },
  }
}

/** Các tin đang gửi dở, tránh gửi trùng một email hai lần cùng lúc */
const inFlight = new Set<string>()

/** Gửi email cho một tin của Misu (cũng dùng khi bấm "Tap to retry") */
export async function deliverMessage(id: string) {
  if (inFlight.has(id)) return
  const { save, setDelivery } = useGame.getState()
  const index = save.messages.findIndex((m) => m.id === id)
  const message = save.messages[index]
  if (!message || message.from !== 'misu') return
  const next = save.messages[index + 1]
  const reply = next?.from === 'husband' ? next : undefined

  inFlight.add(id)
  setDelivery(id, 'sending')
  const ok = await postMessage(buildPayload(save, message, reply, gameNow()))
  inFlight.delete(id)
  useGame.getState().setDelivery(id, ok ? 'sent' : 'failed')
}

/** Misu gửi tin: Chằm Chằm trả lời ngay trong game, còn email đi ngầm phía sau */
export function sendToHusband(input: MessageInput) {
  const outcome = useGame.getState().sendMessage(input)
  if (outcome.message) void deliverMessage(outcome.message.id)
  return outcome
}

/** Gửi lại các tin chưa tới (mở app lại, có mạng lại). Chỉ thử các tin trong 3 ngày gần nhất. */
export async function retryUndelivered() {
  const t = gameNow()
  const pending = useGame
    .getState()
    .save.messages.filter((m) => m.from === 'misu' && shownDelivery(m, t) === 'failed' && t - m.at < 3 * 86_400_000)
  for (const message of pending.slice(-5)) await deliverMessage(message.id)
}
