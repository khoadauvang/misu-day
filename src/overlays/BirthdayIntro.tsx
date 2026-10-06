import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react'
import { BirthdayCake } from '../components/BirthdayCake.tsx'
import { Fireworks } from '../components/Fireworks.tsx'
import { Sticker } from '../components/Sticker.tsx'
import { HUSBAND_NAME, MISU_NICKNAME } from '../config.ts'
import { ART } from '../data/art.ts'
import {
  BIRTHDAY_BUBBLES,
  BIRTHDAY_GIFT,
  BIRTHDAY_STICKER,
  LETTER_SHEETS,
  LETTER_SIGNATURE,
  LETTER_TITLE,
} from '../data/birthday.ts'
import { colorVar, type ColorToken } from '../data/districts.ts'
import { ITEM_BY_ID } from '../data/items.ts'
import { formatMoney } from '../game/format.ts'
import { useGame } from '../game/store.ts'
import { useUi } from '../game/ui.ts'

// Thư sinh nhật (lần mở game đầu tiên, hoặc đọc lại từ Collection).
// party: game mờ đi, pháo hoa, bánh kem nhảy ra góc trái, Chằm Chằm trượt vào góc phải, thư trái tim hiện ra
// letter: các trang thư, vuốt hoặc bấm › để lật "xoẹt" sang trang mới
// gift: mở quà 9,100,000₫ + sticker, bấm "Start my day" là vào game

type Stage = 'party' | 'letter' | 'gift'
type Mode = 'first' | 'reread'

type Page = { text: string; paper: ColorToken }
const PAGES: Page[] = LETTER_SHEETS.flatMap((sheet) => sheet.pages.map((text) => ({ text, paper: sheet.paper })))
const LAST = PAGES.length - 1

/** Giấy thư: màu của tờ + chấm bi trắng mờ */
const paperStyle = (paper: ColorToken): CSSProperties => ({
  backgroundColor: colorVar(paper),
  backgroundImage: 'radial-gradient(rgb(255 255 255 / 0.6) 1.3px, transparent 1.5px)',
  backgroundSize: '18px 18px',
})

/** Tiêu đề thư: mỗi dòng không bao giờ xuống dòng, cỡ chữ tự co theo bề ngang thư */
function FitTitle({ lines }: { lines: string[] }) {
  const boxRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const spans = Array.from(box.children) as HTMLElement[]
    let lastWidth = 0
    const fit = () => {
      const width = box.clientWidth
      if (!width) return
      lastWidth = width
      // Đo từng dòng ở cỡ 100px rồi tính cỡ vừa khít; dòng ngắn được to hơn một chút (tối đa 1.25 lần).
      // Dùng offsetWidth (bề ngang thật), không bị ảnh hưởng khi tờ thư đang phóng to/thu nhỏ lúc mở
      const sizes = spans.map((span) => {
        span.style.fontSize = '100px'
        return (width / span.offsetWidth) * 100 * 0.97
      })
      const smallest = Math.min(...sizes)
      spans.forEach((span, i) => {
        span.style.fontSize = `${Math.min(sizes[i], smallest * 1.25, 46)}px`
      })
    }
    fit()
    void document.fonts?.ready.then(fit)
    const observer = new ResizeObserver(() => {
      if (box.clientWidth !== lastWidth) fit()
    })
    observer.observe(box)
    return () => observer.disconnect()
  }, [lines])

  return (
    <h2 ref={boxRef} className="flex flex-col items-center font-display leading-[1.12] font-extrabold">
      {lines.map((line, i) => (
        <span key={line} className={`block w-fit whitespace-nowrap ${i === 1 ? 'text-peony-deep' : ''}`}>
          {line}
        </span>
      ))}
    </h2>
  )
}

/** Chữ trong thư: bắt đầu ở 21px, dài quá thì nhỏ dần (tối thiểu 15px), vẫn dài thì cuộn được */
function useFitText(text: string) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => {
      let size = 21
      el.style.fontSize = `${size}px`
      while (size > 15 && el.scrollHeight > el.clientHeight + 1) {
        size -= 0.5
        el.style.fontSize = `${size}px`
      }
    }
    fit()
    void document.fonts?.ready.then(fit)
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    return () => observer.disconnect()
  }, [text])
  return ref
}

type LetterCardProps = {
  index: number
  mode: Mode
  className?: string
  onNext: () => void
  onBack: () => void
  onFinish: () => void
  onAnimationEnd?: () => void
}

/** Một trang thư */
function LetterCard({ index, mode, className = '', onNext, onBack, onFinish, onAnimationEnd }: LetterCardProps) {
  const page = PAGES[index]
  const textRef = useFitText(page.text)
  const touch = useRef<{ x: number; y: number } | null>(null)

  // Vuốt sang trái: trang sau · sang phải: trang trước
  const onTouchStart = (event: TouchEvent) => {
    const t = event.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (event: TouchEvent) => {
    const start = touch.current
    touch.current = null
    if (!start) return
    const t = event.changedTouches[0]
    const dx = t.clientX - start.x
    if (Math.abs(dx) < 45 || Math.abs(t.clientY - start.y) > 70) return
    if (dx < 0 && index < LAST) onNext()
    if (dx > 0 && index > 0) onBack()
  }

  return (
    <article
      aria-label={`Page ${index + 1} of ${PAGES.length}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) onAnimationEnd?.()
      }}
      className={`absolute inset-0 flex flex-col rounded-[30px] px-5 pt-8 pb-3 shadow-float ring-4 ring-white ${className}`}
      style={paperStyle(page.paper)}
    >
      {/* Băng keo dán thư */}
      <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 rounded-md bg-white/75" />
      <Sticker emoji="💗" className="absolute top-3 left-4 -rotate-12 text-[20px]" />

      {index === 0 && <FitTitle lines={LETTER_TITLE} />}

      <div
        ref={textRef}
        className={`min-h-0 flex-1 overflow-y-auto font-hand leading-[1.62] font-medium text-pretty ${index === 0 ? 'mt-4' : 'mt-1'}`}
      >
        <p>{page.text}</p>
        {index === LAST && (
          <p className="mt-4 text-right font-semibold">
            — {LETTER_SIGNATURE} <Sticker emoji="💗" />
          </p>
        )}
      </div>

      <footer className="mt-2 flex shrink-0 items-center justify-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={index === 0}
          aria-label="Previous page"
          className="press grid h-11 w-11 place-items-center rounded-full bg-white/85 text-[24px] leading-none font-extrabold disabled:opacity-0"
        >
          ‹
        </button>
        {index === LAST ? (
          <button
            type="button"
            onClick={onFinish}
            className="press rounded-full bg-peony px-6 py-3 text-[16px] font-extrabold shadow-float"
          >
            {mode === 'first' ? 'Open your gift 🎁' : 'Close 💗'}
          </button>
        ) : (
          <>
            <ol aria-hidden className="flex items-center gap-1.5">
              {PAGES.map((_, i) => (
                <li
                  key={i}
                  className={`h-2 rounded-full transition-all ${i === index ? 'w-5 bg-plum' : 'w-2 bg-plum/25'}`}
                />
              ))}
            </ol>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next page"
              className="press grid h-11 w-11 place-items-center rounded-full bg-peony text-[24px] leading-none font-extrabold"
            >
              ›
            </button>
          </>
        )}
      </footer>
    </article>
  )
}

/** Bức thư trái tim: đập nhẹ, chạm để mở */
function HeartLetter({ opening, onOpen }: { opening: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={opening}
      aria-label="Open your birthday letter"
      className="flex animate-pop-in flex-col items-center"
      style={{ animationDelay: '900ms', animationFillMode: 'both' }}
    >
      <span className={`block ${opening ? 'animate-heart-burst' : ''}`}>
        <svg viewBox="0 0 220 200" aria-hidden className="sticker-art block w-[min(60vw,240px)] animate-heartbeat">
          <path
            d="M110 188 C60 152 12 118 12 66 C12 33 37 10 68 10 C88 10 102 22 110 38 C118 22 132 10 152 10 C183 10 208 33 208 66 C208 118 160 152 110 188 Z"
            fill="var(--color-peony)"
            stroke="#fff"
            strokeWidth="10"
            strokeLinejoin="round"
          />
          <path
            d="M44 58 C46 40 60 30 74 32"
            fill="none"
            stroke="#fff"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Phong thư nhỏ ở giữa tim */}
          <rect x="64" y="66" width="92" height="64" rx="12" fill="#fff" />
          <path
            d="M66 76 L110 106 L154 76"
            fill="none"
            stroke="var(--color-peony-deep)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M110 124 C104 119 99 116 99 111 C99 107 102 104.5 105.5 105 C107.5 105.3 109.2 106.6 110 108.5 C110.8 106.6 112.5 105.3 114.5 105 C118 104.5 121 107 121 111 C121 116 116 119 110 124 Z"
            fill="var(--color-peony-deep)"
          />
        </svg>
      </span>
      <span className="mt-5 font-display text-[24px] leading-tight font-bold text-paper">
        A letter for you, {MISU_NICKNAME} 💌
      </span>
      <span className="mt-3 rounded-full bg-paper px-5 py-2.5 text-[15px] font-extrabold text-plum shadow-float">
        Tap to open
      </span>
    </button>
  )
}

/** Mở quà: 9,100,000₫ + sticker đặc biệt */
function GiftCard({ onDone }: { onDone: () => void }) {
  const sticker = ITEM_BY_ID[BIRTHDAY_STICKER]
  return (
    <section
      aria-labelledby="gift-title"
      className="max-h-full w-full max-w-sm animate-letter-open overflow-y-auto rounded-[32px] bg-paper px-6 pt-5 pb-5 text-center shadow-float ring-4 ring-white"
    >
      <Sticker emoji="🎁" className="animate-float text-[60px]" />
      <p className="mt-2 text-[14px] font-bold text-plum-soft">From {HUSBAND_NAME}, with love</p>
      <h2 id="gift-title" className="font-display text-[26px] leading-tight font-bold">
        Your birthday gift
      </h2>
      <p className="mt-3 font-display text-[40px] leading-none font-bold tabular-nums">+{formatMoney(BIRTHDAY_GIFT)}</p>
      <p className="mt-2 text-[14px] font-bold text-plum-soft">For your special day, 9/10 💗 Spend it on anything you love.</p>
      {sticker && (
        <div className="mt-4 flex items-center justify-center gap-2.5 rounded-[20px] bg-white px-4 py-3 ring-1 ring-petal">
          <Sticker emoji={sticker.emoji} className="text-[30px]" />
          <p className="text-[14px] font-extrabold">New sticker: {sticker.name}</p>
        </div>
      )}
      <button
        type="button"
        onClick={onDone}
        className="press mt-5 w-full rounded-full bg-peony py-3.5 text-[17px] font-extrabold"
      >
        Start my day 💗
      </button>
    </section>
  )
}

/** Thời gian các hiệu ứng mở thư / đóng / lật trang tối đa (mili giây) */
const OPEN_MS = 380
const CLOSE_MS = 320
const TURN_FALLBACK_MS = 900

export function BirthdayIntro({ mode }: { mode: Mode }) {
  const claimBirthday = useGame((s) => s.claimBirthday)
  const setLetterOpen = useUi((s) => s.setLetterOpen)
  const [stage, setStage] = useState<Stage>(mode === 'first' ? 'party' : 'letter')
  const [opening, setOpening] = useState(false)
  const [closing, setClosing] = useState(false)
  const [page, setPage] = useState(0)
  /** Trang đang bay đi (lật tới) hoặc nằm dưới (lật lui) trong lúc chạy hiệu ứng */
  const [turn, setTurn] = useState<{ from: number; dir: 'next' | 'back' } | null>(null)

  const go = (dir: 'next' | 'back') => {
    if (turn) return
    const from = page
    const to = dir === 'next' ? page + 1 : page - 1
    if (to < 0 || to > LAST) return
    setTurn({ from, dir })
    setPage(to)
    // Phòng khi hiệu ứng bị ngắt (ví dụ thoát app giữa chừng): tự mở khóa lật trang
    window.setTimeout(() => setTurn((t) => (t?.from === from ? null : t)), TURN_FALLBACK_MS)
  }

  const openLetter = () => {
    setOpening(true)
    window.setTimeout(() => setStage('letter'), OPEN_MS)
  }

  const finishLetter = () => {
    if (mode === 'first') setStage('gift')
    else close()
  }

  const close = () => {
    setClosing(true)
    window.setTimeout(() => {
      if (mode === 'first') claimBirthday()
      else setLetterOpen(false)
    }, CLOSE_MS)
  }

  // Bàn phím (thử trên Mac): ← → lật trang, Esc đóng khi đọc lại
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (stage !== 'letter') return
      if (event.key === 'ArrowRight') go('next')
      if (event.key === 'ArrowLeft') go('back')
      if (event.key === 'Escape' && mode === 'reread') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const party = stage !== 'letter'
  const bubble = stage === 'party' ? BIRTHDAY_BUBBLES.party : stage === 'gift' ? BIRTHDAY_BUBBLES.gift : null
  const safeBottom = 'max(env(safe-area-inset-bottom), 10px)'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Birthday letter"
      className={`fixed inset-0 z-[60] overflow-hidden transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Game phía sau mờ tối đi */}
      <div aria-hidden className="absolute inset-0 animate-fade-in bg-plum/60 backdrop-blur-[3px]" />
      <Fireworks intensity={stage === 'letter' ? 'low' : 'high'} pop={stage === 'gift' ? 1 : 0} />

      {/* Nội dung chính: thư trái tim → các trang thư → quà */}
      <div
        className="absolute inset-x-0 flex items-center justify-center px-4"
        style={{
          top: 'calc(max(env(safe-area-inset-top), 12px) + 10px)',
          bottom: `calc(${safeBottom} + ${stage === 'letter' ? 'min(17dvh, 150px)' : 'min(30dvh, 250px)'})`,
        }}
      >
        {stage === 'party' && <HeartLetter opening={opening} onOpen={openLetter} />}

        {stage === 'letter' && (
          <div className="relative h-full w-full max-w-sm animate-letter-open">
            {/* Tờ thư tiếp theo ló ra phía sau cho cảm giác cả xấp thư */}
            {page < LAST && (
              <div
                aria-hidden
                className="absolute inset-0 translate-x-1.5 translate-y-2 rotate-[2.5deg] rounded-[30px] ring-4 ring-white/70"
                style={paperStyle(PAGES[page + 1].paper)}
              />
            )}
            {turn?.dir === 'back' && (
              <LetterCard index={turn.from} mode={mode} onNext={() => {}} onBack={() => {}} onFinish={() => {}} />
            )}
            <LetterCard
              key={page}
              index={page}
              mode={mode}
              className={turn ? (turn.dir === 'next' ? 'animate-stack-up' : 'z-10 animate-swoosh-back') : ''}
              onAnimationEnd={turn?.dir === 'back' ? () => setTurn(null) : undefined}
              onNext={() => go('next')}
              onBack={() => go('back')}
              onFinish={finishLetter}
            />
            {turn?.dir === 'next' && (
              <LetterCard
                key={`leaving-${turn.from}`}
                index={turn.from}
                mode={mode}
                className="pointer-events-none z-10 animate-swoosh-out"
                onAnimationEnd={() => setTurn(null)}
                onNext={() => {}}
                onBack={() => {}}
                onFinish={() => {}}
              />
            )}
          </div>
        )}

        {stage === 'gift' && <GiftCard onDone={close} />}
      </div>

      {/* Bánh kem nhảy ra ở góc dưới bên trái */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1 origin-bottom-left transition-transform duration-500"
        style={{ bottom: safeBottom, transform: party ? 'scale(1)' : 'scale(0.62)' }}
      >
        <div className="animate-cake-pop" style={{ animationDelay: '200ms' }}>
          <BirthdayCake className="block w-[min(38vw,170px)] animate-float" />
        </div>
      </div>

      {/* Chằm Chằm ở góc dưới bên phải */}
      <div
        className="pointer-events-none absolute -right-3.5 origin-bottom-right transition-transform duration-500"
        style={{ bottom: safeBottom, transform: party ? 'scale(1)' : 'scale(0.5)' }}
      >
        <div className="animate-peek-in" style={{ animationDelay: '500ms' }}>
          <img src={ART.husband.full} alt={HUSBAND_NAME} draggable={false} className="sticker-art block h-[min(36dvh,300px)] w-auto" />
        </div>
        {bubble && (
          <p
            key={bubble}
            className="absolute top-[6%] right-[78%] w-max max-w-[58vw] origin-bottom-right animate-pop-in rounded-[20px] rounded-br-md bg-paper px-3.5 py-2 text-[15px] leading-snug font-extrabold text-plum shadow-float"
            style={{ animationDelay: stage === 'party' ? '1300ms' : '300ms', animationFillMode: 'both' }}
          >
            {bubble}
          </p>
        )}
      </div>

      {mode === 'reread' && (
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="press absolute top-[max(env(safe-area-inset-top),12px)] right-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-paper text-[22px] leading-none font-bold text-plum-soft shadow-float"
        >
          ×
        </button>
      )}
    </div>
  )
}
