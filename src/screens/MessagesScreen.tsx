import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Sticker } from '../components/Sticker.tsx'
import { HUSBAND_NAME } from '../config.ts'
import { ITEM_BY_ID } from '../data/items.ts'
import { CHAT_INTRO, MESSAGE_MAX_LENGTH, QUICK_MESSAGES } from '../data/messages.ts'
import { deliverMessage, sendToHusband } from '../game/actions.ts'
import { gameNow } from '../game/clock.ts'
import type { MessageInput } from '../game/engine.ts'
import { formatClock, formatMoney } from '../game/format.ts'
import { husbandStatus } from '../game/husband.ts'
import { askedExtraToday, canSendMore, shownDelivery } from '../game/messages.ts'
import { useGame } from '../game/store.ts'
import type { ChatMessage } from '../game/types.ts'
import { useUi } from '../game/ui.ts'
import { useKeyboardInset } from '../lib/useKeyboardInset.ts'

// Module 9: chat kiểu iMessage với Chằm Chằm. Mỗi tin Misu gửi thành một email thật.

/** Hai tin cách nhau hơn 1 tiếng thì hiện mốc giờ ở giữa */
const TIME_GAP_MS = 60 * 60 * 1000
/** Chằm Chằm "đang gõ…" bao lâu trước khi câu trả lời hiện ra */
const TYPING_MS = 1300

/** Mốc giờ giữa các tin: "Today 8:05 PM", "Yesterday 9:10 AM", "Mon, Oct 5 · 9:10 AM" */
function timeLabel(at: number, now: number): string {
  const day = (t: number) => new Date(t).toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (day(at) === day(now)) return `Today ${formatClock(at)}`
  if (day(at) === yesterday.toDateString()) return `Yesterday ${formatClock(at)}`
  const date = new Date(at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  return `${date} · ${formatClock(at)}`
}

function HusbandBubble({ text, pop }: { text: string; pop: boolean }) {
  return (
    <p
      className={`w-fit max-w-[80%] origin-bottom-left rounded-[22px] rounded-bl-md bg-white px-4 py-2.5 text-[16px] leading-snug ring-1 ring-petal ${pop ? 'animate-pop-in' : ''}`}
    >
      {text}
    </p>
  )
}

function TypingBubble() {
  return (
    <div
      role="status"
      aria-label={`${HUSBAND_NAME} is typing`}
      className="flex w-fit animate-pop-in items-center gap-1 rounded-[22px] rounded-bl-md bg-white px-4 py-3.5 ring-1 ring-petal"
    >
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-2 w-2 animate-typing rounded-full bg-plum-soft"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  )
}

/** Tin của Misu: món đồ gửi kèm (nếu có) + bong bóng chữ màu hồng */
function MisuBubble({ message, pop }: { message: ChatMessage; pop: boolean }) {
  const item = message.item ? ITEM_BY_ID[message.item] : undefined
  return (
    <div className={`flex origin-bottom-right flex-col items-end gap-1 ${pop ? 'animate-pop-in' : ''}`}>
      {item && (
        <div className="flex items-center gap-2.5 rounded-[22px] bg-white px-3.5 py-2.5 ring-1 ring-petal">
          <Sticker emoji={item.emoji} className="text-[34px]" />
          <span className="text-[14px] leading-tight font-extrabold">{item.name}</span>
        </div>
      )}
      <p className="w-fit max-w-[80%] rounded-[22px] rounded-br-md bg-peony px-4 py-2.5 text-[16px] leading-snug break-words">
        {message.text}
      </p>
    </div>
  )
}

/** "Delivered" / "Sending…" / "Not delivered · Tap to retry" dưới tin của Misu */
function DeliveryLabel({ message, now, isLast }: { message: ChatMessage; now: number; isLast: boolean }) {
  const delivery = shownDelivery(message, now)
  if (delivery === 'failed') {
    return (
      <button
        type="button"
        onClick={() => void deliverMessage(message.id)}
        className="press mt-1 ml-auto block text-[12px] font-extrabold text-peony-deep"
      >
        Not delivered · Tap to retry
      </button>
    )
  }
  if (delivery === 'sending') return <p className="mt-1 text-right text-[12px] font-bold text-plum-soft">Sending…</p>
  if (delivery === 'sent' && isLast) return <p className="mt-1 text-right text-[12px] font-bold text-plum-soft">Delivered</p>
  return null
}

export function MessagesScreen() {
  const now = useUi((s) => s.now)
  const save = useGame((s) => s.save)
  const messages = save.messages
  const status = husbandStatus(now)

  const [draft, setDraft] = useState('')
  const [typingId, setTypingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [mountedAt] = useState(() => gameNow())
  const endRef = useRef<HTMLDivElement>(null)
  const firstScroll = useRef(true)
  const keyboard = useKeyboardInset()

  const lastMisuIndex = messages.findLastIndex((m) => m.from === 'misu')
  const limitReached = !canSendMore(save, now)
  const extraUsed = askedExtraToday(save, now)

  // Luôn cuộn xuống tin mới nhất (lần đầu cuộn ngay, sau đó cuộn mượt).
  // Cuộn cả vùng nội dung tới đáy, để phần chừa chỗ cho ô nhập và thanh tab cũng được tính.
  useEffect(() => {
    const scroller = endRef.current?.closest('main')
    scroller?.scrollTo({ top: scroller.scrollHeight, behavior: firstScroll.current ? 'auto' : 'smooth' })
    firstScroll.current = false
  }, [messages.length, typingId, keyboard])

  // Ẩn ba chấm "đang gõ…" sau một lúc
  useEffect(() => {
    if (!typingId) return
    const timer = setTimeout(() => setTypingId(null), TYPING_MS)
    return () => clearTimeout(timer)
  }, [typingId])

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 2600)
    return () => clearTimeout(timer)
  }, [notice])

  const send = (input: MessageInput) => {
    const outcome = sendToHusband(input)
    if (outcome.error) {
      setNotice(outcome.error)
      return false
    }
    if (outcome.reply) setTypingId(outcome.reply.id)
    return true
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (send({ kind: 'text', text: draft })) setDraft('')
  }

  return (
    <div className="mx-auto max-w-md">
      <header className="flex items-center gap-3">
        <Sticker emoji="🤵🏻" className="text-[42px]" />
        <div>
          <h1 className="font-display text-[30px] leading-none font-bold">{HUSBAND_NAME}</h1>
          <p className="mt-1 text-[14px] font-semibold text-plum-soft">
            {status.emoji} {status.label}
          </p>
        </div>
      </header>

      <ol className="mt-6" aria-label={`Chat with ${HUSBAND_NAME}`}>
        {messages.length === 0 && (
          <li>
            <HusbandBubble text={CHAT_INTRO} pop={false} />
          </li>
        )}
        {messages.map((message, i) => {
          const prev = messages[i - 1]
          const showTime = !prev || message.at - prev.at > TIME_GAP_MS
          const sameSender = prev && prev.from === message.from && !showTime
          const pop = message.at >= mountedAt
          return (
            <li key={message.id} className={sameSender ? 'mt-1' : 'mt-3'}>
              {showTime && (
                <p className="mt-3 mb-3 text-center text-[12px] font-bold text-plum-soft">{timeLabel(message.at, now)}</p>
              )}
              {message.from === 'misu' ? (
                <>
                  <MisuBubble message={message} pop={pop} />
                  <DeliveryLabel message={message} now={now} isLast={i === lastMisuIndex} />
                </>
              ) : message.id === typingId ? (
                <TypingBubble />
              ) : (
                <>
                  <HusbandBubble text={message.text} pop={pop} />
                  {message.money ? (
                    <div className="mt-1 flex w-fit animate-pop-in items-center gap-2 rounded-[18px] bg-butter px-3.5 py-2 text-[14px] font-extrabold">
                      <Sticker emoji="💸" className="text-[20px]" />+{formatMoney(message.money)}
                      <span className="font-bold text-plum-soft">added to your wallet</span>
                    </div>
                  ) : null}
                </>
              )}
            </li>
          )
        })}
      </ol>

      {/* Chừa chỗ để tin cuối không bị ô nhập và thanh tab che */}
      <div ref={endRef} aria-hidden style={{ height: keyboard > 0 ? keyboard + 24 : 96 }} />

      <div
        className="fixed inset-x-0 z-10 px-4"
        style={{ bottom: keyboard > 0 ? keyboard + 8 : 'calc(max(env(safe-area-inset-bottom), 14px) + 80px)' }}
      >
        <div className="mx-auto max-w-md rounded-[28px] border border-white bg-white/85 p-2 shadow-float backdrop-blur-xl">
          {notice && (
            <p role="status" className="px-2 pt-1 pb-2 text-center text-[13px] font-extrabold text-peony-deep">
              {notice}
            </p>
          )}
          {limitReached ? (
            <p className="px-3 py-3 text-center text-[14px] font-bold text-plum-soft">
              That’s a lot of love for one day 💌 More tomorrow!
            </p>
          ) : (
            <>
              <div className="no-scrollbar -mx-2 flex gap-1.5 overflow-x-auto px-2 pb-2" aria-label="Quick messages">
                {QUICK_MESSAGES.map((quick) => {
                  const off = quick.kind === 'extra' && extraUsed
                  return (
                    <button
                      key={quick.kind}
                      type="button"
                      disabled={off}
                      onClick={() => send({ kind: quick.kind })}
                      className="press shrink-0 rounded-full bg-petal px-3.5 py-2 text-[14px] font-bold whitespace-nowrap disabled:opacity-50"
                    >
                      {off ? 'Extra again tomorrow 💸' : quick.text}
                    </button>
                  )
                })}
              </div>
              <form onSubmit={submit} className="flex items-center gap-2">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={MESSAGE_MAX_LENGTH}
                  enterKeyHint="send"
                  autoComplete="off"
                  aria-label={`Message ${HUSBAND_NAME}`}
                  placeholder={`Message ${HUSBAND_NAME}`}
                  className="min-w-0 flex-1 rounded-full bg-paper px-4 py-2.5 text-[16px] ring-1 ring-petal placeholder:text-plum-soft focus:ring-2 focus:ring-peony focus-visible:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!draft.trim()}
                  className="press grid h-11 w-11 shrink-0 place-items-center rounded-full bg-peony text-[20px] font-extrabold disabled:opacity-40"
                >
                  ↑
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
