import { GAME_NAME, HUSBAND_NAME, PLAYER_NAME } from '../config.ts'
import { COUPON_BY_ID } from '../data/coupons.ts'
import { ITEM_BY_ID } from '../data/items.ts'
import { PLACES } from '../data/places.ts'
import { postMessage, type MessagePayload } from '../lib/api.ts'
import { isDevMode } from '../lib/device.ts'
import { gameDayKey, gameNow } from './clock.ts'
import { currentEnergy } from './energy.ts'
import { diaryForDay, type MessageInput } from './engine.ts'
import { formatClock } from './format.ts'
import { husbandStatus } from './husband.ts'
import { levelInfo } from './level.ts'
import { SENDING_TIMEOUT_MS, shownDelivery } from './messages.ts'
import { petStats } from './pet.ts'
import { useGame } from './store.ts'
import type { Activity, ChatMessage, Delivery, Place, SaveData } from './types.ts'
import { useUi } from './ui.ts'

// Các việc có "tác dụng phụ": hiện popup, gọi mạng… Luật chơi thuần nằm ở engine.ts.

/** Làm hoạt động rồi hiện popup kết quả (place = null là hoạt động ở nhà) */
export function runActivity(place: Place | null, activity: Activity) {
  const outcome = useGame.getState().doActivity(place, activity)
  if (outcome.result) useUi.getState().showResult(outcome.result)
  return outcome
}

// --- Cún Golden ---

/** Chăm cún ở Home (cho ăn, đi dạo, chơi): cún phản ứng ngay trên thẻ; lên level thì mới hiện popup */
export function runPetCare(activity: Activity) {
  const outcome = useGame.getState().doActivity(null, activity)
  const result = outcome.result
  if (!result) return outcome
  if (result.levelAfter > result.levelBefore) useUi.getState().showResult(result)
  else useUi.getState().showPetReaction({ emoji: activity.emoji, text: result.xp > 0 ? `+${result.xp} XP` : '💛' })
  return outcome
}

/** Hoạt động "nhận nuôi" ở Pet Shop (tìm trong places.ts) */
export function findAdoptActivity(): { place: Place; activity: Activity } | undefined {
  for (const place of PLACES) {
    const activity = place.activities.find((a) => a.pet?.adopt)
    if (activity) return { place, activity }
  }
  return undefined
}

/** Misu đặt tên xong và bấm Adopt */
export function adoptGolden(name: string) {
  const found = findAdoptActivity()
  if (!found) return { error: 'Coming soon' }
  const outcome = useGame.getState().doActivity(found.place, found.activity, { petName: name })
  if (outcome.result) {
    useUi.getState().setAdoptOpen(false)
    useUi.getState().showResult(outcome.result)
  }
  return outcome
}

// --- Module 9: tin nhắn thành email thật ---

/** Misu đang ra sao: gửi kèm mọi email */
function snapshot(save: SaveData, t: number): MessagePayload['snapshot'] {
  const status = husbandStatus(t)
  const pet = save.pet ? petStats(save.pet, t) : null
  return {
    pet:
      save.pet && pet
        ? `${save.pet.name} · ${Math.round(pet.fullness)}% full · ${Math.round(pet.happiness)}% happy`
        : undefined,
    level: levelInfo(save.xp).level,
    money: save.money,
    energy: currentEnergy(save, t),
    stickers: Object.values(save.collection).filter((count) => count > 0).length,
    status: `${status.label} ${status.emoji}${status.detail ? ` (${status.detail})` : ''}`,
    diary: diaryForDay(save.diary, gameDayKey(t))
      .reverse()
      .slice(0, 5)
      .map((entry) => ({ time: formatClock(entry.at), text: entry.text })),
  }
}

/** Gom thông tin gửi kèm email: tin nhắn, câu trả lời, Misu đang ra sao */
function buildPayload(save: SaveData, message: ChatMessage, reply: ChatMessage | undefined, t: number): MessagePayload {
  const item = message.item ? ITEM_BY_ID[message.item] : undefined
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
    snapshot: snapshot(save, t),
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

  // Love Coupons đã bấm Use mà email chưa đi
  const coupons = useGame.getState().save.coupons
  for (const [id, coupon] of Object.entries(coupons)) {
    if (coupon.usedAt && couponDelivery(coupon.delivery, coupon.deliveryAt, t) === 'failed') await deliverCoupon(id)
  }
}

// --- Module 10: Love Coupons ---

/** Phiếu "Sending…" quá lâu (tắt app giữa chừng) thì coi như chưa gửi được */
export function couponDelivery(delivery: Delivery | undefined, at: number | undefined, t: number) {
  if (delivery === 'sending' && t - (at ?? 0) > SENDING_TIMEOUT_MS) return 'failed'
  return delivery
}

/** Gửi email báo Chằm Chằm: Misu vừa dùng phiếu (cũng dùng khi bấm "Tap to retry") */
export async function deliverCoupon(id: string) {
  const key = `coupon:${id}`
  if (inFlight.has(key)) return
  const { save, setCouponDelivery } = useGame.getState()
  const coupon = save.coupons[id]
  const info = COUPON_BY_ID[id]
  if (!coupon?.usedAt || !info) return

  inFlight.add(key)
  setCouponDelivery(id, 'sending')
  const t = gameNow()
  const ok = await postMessage({
    test: isDevMode(),
    game: GAME_NAME,
    player: PLAYER_NAME,
    husband: HUSBAND_NAME,
    kind: 'coupon',
    text: info.title,
    item: { emoji: info.emoji, name: info.title },
    money: 0,
    reply: '',
    sentAt: coupon.usedAt,
    snapshot: snapshot(save, t),
  })
  inFlight.delete(key)
  useGame.getState().setCouponDelivery(id, ok ? 'sent' : 'failed')
}

/** Misu bấm Use một phiếu */
export function redeemLoveCoupon(id: string) {
  useGame.getState().redeemCoupon(id)
  void deliverCoupon(id)
}
