import { useEffect, useState, type CSSProperties } from 'react'
import { FallingPetals } from '../components/FallingPetals.tsx'
import { FlowerIcon } from '../components/Flowers.tsx'
import { Letter } from '../components/Letter.tsx'
import { HUSBAND_NAME } from '../config.ts'
import { ART } from '../data/art.ts'
import { ITEM_BY_ID } from '../data/items.ts'
import {
  WOMENS_DAY_BUBBLES,
  WOMENS_DAY_FLOWERS,
  WOMENS_DAY_PAGES,
  WOMENS_DAY_SIGNATURE,
  WOMENS_DAY_TITLE,
} from '../data/womensDay.ts'
import { useGame } from '../game/store.ts'
import { useUi } from '../game/ui.ts'
import { playSfx } from '../lib/sound.ts'

// Quà 20/10 (lần mở game đầu tiên sau ngày 20/10, hoặc đọc lại thư từ Collection).
// letter: game tối đi, hoa rơi, các trang thư (vuốt hoặc bấm › để lật)
// gift: vuốt qua trang cuối → hộp quà lắc lắc, Chằm Chằm ló ra ở góc
// burst: chạm hộp → nắp bật tung, cả bộ sưu tập hoa bay ra → "See my flowers" mở Collection

type Stage = 'letter' | 'gift' | 'burst'
type Mode = 'first' | 'reread'

const CLOSE_MS = 320
/** Hoa bay ra xong thì hiện thẻ "Full collection" */
const REVEAL_MS = 1300

/** Hộp quà hồng, nơ vàng; open = nắp bật tung */
function GiftBox({ open }: { open: boolean }) {
  const outline = { stroke: 'var(--color-plum)', strokeWidth: 4, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 160 150" aria-hidden className="sticker-art block w-full overflow-visible">
      <rect x="18" y="58" width="124" height="86" rx="12" fill="var(--color-peony)" {...outline} />
      <rect x="70" y="58" width="20" height="86" fill="var(--color-butter)" {...outline} strokeWidth={3} />
      <path d="M30 76 C30 70 34 68 38 68" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
      <g className={`svg-self ${open ? 'animate-lid-pop' : ''}`}>
        <rect x="10" y="38" width="140" height="26" rx="10" fill="#F7B6C8" {...outline} />
        <rect x="68" y="38" width="24" height="26" fill="var(--color-butter)" {...outline} strokeWidth={3} />
        <path d="M80 38 C68 14 44 14 48 30 C50 40 66 40 80 38 Z" fill="var(--color-butter)" {...outline} strokeWidth={3} />
        <path d="M80 38 C92 14 116 14 112 30 C110 40 94 40 80 38 Z" fill="var(--color-butter)" {...outline} strokeWidth={3} />
        <circle cx="80" cy="36" r="7" fill="#F6C65B" {...outline} strokeWidth={3} />
      </g>
    </svg>
  )
}

/** Hộp quà + hoa bay ra xếp thành 2 hàng, mỗi hàng 3 bông phía trên hộp */
function GiftStage({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  return (
    <div className="relative mx-auto aspect-square w-[min(88vw,340px,46dvh)]">
      {open &&
        WOMENS_DAY_FLOWERS.map((id, i) => {
          // Đích bay tới, tính theo % kích thước của chính bông hoa
          const style = {
            '--dx': `${((i % 3) - 1) * 120}%`,
            '--dy': i < 3 ? '-218%' : '-92%',
            animationDelay: `${120 + i * 90}ms`,
          } as CSSProperties
          return (
            <div key={id} className="absolute top-[50%] left-[38%] w-[24%] animate-flower-burst" style={style}>
              <div className="animate-float" style={{ animationDelay: `${i * 0.4}s` }}>
                <FlowerIcon id={id} className="block w-full" />
              </div>
              <span className="absolute top-[92%] left-1/2 -translate-x-1/2 rounded-full bg-paper px-2 py-0.5 text-[11px] font-extrabold whitespace-nowrap text-plum shadow-float">
                {ITEM_BY_ID[id]?.name}
              </span>
            </div>
          )
        })}
      <button
        type="button"
        onClick={onOpen}
        disabled={open}
        aria-label="Open your gift"
        className="absolute top-[72%] left-1/2 w-[40%] -translate-x-1/2 -translate-y-1/2"
      >
        <span className={`block origin-bottom ${open ? '' : 'animate-gift-shake'}`}>
          <GiftBox open={open} />
        </span>
      </button>
    </div>
  )
}

export function WomensDayIntro({ mode }: { mode: Mode }) {
  const claimWomensDay = useGame((s) => s.claimWomensDay)
  const setWomensLetterOpen = useUi((s) => s.setWomensLetterOpen)
  const setTab = useUi((s) => s.setTab)
  const [stage, setStage] = useState<Stage>('letter')
  const [revealed, setRevealed] = useState(false)
  const [closing, setClosing] = useState(false)

  const close = () => {
    setClosing(true)
    window.setTimeout(() => {
      if (mode === 'first') {
        claimWomensDay()
        setTab('collection') // vào xem hoa ngay
      } else setWomensLetterOpen(false)
    }, CLOSE_MS)
  }

  const finishLetter = () => {
    if (mode === 'reread') return close()
    setStage('gift')
    playSfx('chime')
  }

  const openGift = () => {
    setStage('burst')
    playSfx('levelUp')
    window.setTimeout(() => {
      setRevealed(true)
      playSfx('sparkle')
    }, REVEAL_MS)
  }

  // Bàn phím (thử trên Mac): Esc đóng khi đọc lại
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mode === 'reread') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const bubble = stage === 'gift' ? WOMENS_DAY_BUBBLES.gift : stage === 'burst' ? WOMENS_DAY_BUBBLES.burst : null
  const safeBottom = 'max(env(safe-area-inset-bottom), 10px)'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Women's Day letter"
      className={`fixed inset-0 z-[60] overflow-hidden transition-opacity duration-300 ${closing ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Game phía sau tối đi một chút */}
      <div aria-hidden className="absolute inset-0 animate-fade-in bg-plum/45 backdrop-blur-[2px]" />
      <FallingPetals count={stage === 'letter' ? 22 : 34} key={stage === 'letter' ? 'calm' : 'party'} />

      <div
        className="absolute inset-x-0 flex flex-col items-center justify-center px-4"
        style={{
          top: 'calc(max(env(safe-area-inset-top), 12px) + 10px)',
          bottom: `calc(${safeBottom} + ${stage === 'letter' ? '8px' : 'min(26dvh, 220px)'})`,
        }}
      >
        {stage === 'letter' && (
          <Letter
            pages={WOMENS_DAY_PAGES}
            title={WOMENS_DAY_TITLE}
            signature={WOMENS_DAY_SIGNATURE}
            stamp="🌷"
            finishLabel={mode === 'first' ? 'Open your gift 🎁' : 'Close 💗'}
            swipeToFinish={mode === 'first'}
            onFinish={finishLetter}
          />
        )}

        {stage !== 'letter' && (
          <div className="w-full max-w-sm animate-pop-in text-center">
            <GiftStage open={stage === 'burst'} onOpen={openGift} />
            {stage === 'gift' && (
              <>
                <p className="font-display text-[24px] leading-tight font-bold text-paper">A gift from {HUSBAND_NAME} 💐</p>
                <span className="mt-3 inline-block rounded-full bg-paper px-5 py-2.5 text-[15px] font-extrabold text-plum shadow-float">
                  Tap the box to open
                </span>
              </>
            )}
            {revealed && (
              <section className="mx-auto mt-1 animate-pop-in rounded-[28px] bg-paper px-5 pt-4 pb-4 shadow-float ring-4 ring-white">
                <h2 className="font-display text-[22px] leading-tight font-bold">Full flower collection!</h2>
                <p className="mt-1 text-[14px] font-bold text-plum-soft">
                  {WOMENS_DAY_FLOWERS.length} bouquets are in your Collection now. Tap one to see what it means.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="press mt-3 w-full rounded-full bg-peony py-3 text-[17px] font-extrabold"
                >
                  See my flowers 💐
                </button>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Chằm Chằm ló ra ở góc dưới bên phải khi tới phần quà */}
      {stage !== 'letter' && (
        <div className="pointer-events-none absolute -right-3.5" style={{ bottom: safeBottom }}>
          <div className="animate-peek-in">
            <img
              src={ART.husband.full}
              alt={HUSBAND_NAME}
              draggable={false}
              className="sticker-art block h-[min(28dvh,230px)] w-auto"
            />
          </div>
          {bubble && (
            <p
              key={bubble}
              className="absolute top-[6%] right-[78%] w-max max-w-[58vw] origin-bottom-right animate-pop-in rounded-[20px] rounded-br-md bg-paper px-3.5 py-2 text-[15px] leading-snug font-extrabold text-plum shadow-float"
              style={{ animationDelay: '500ms', animationFillMode: 'both' }}
            >
              {bubble}
            </p>
          )}
        </div>
      )}

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
