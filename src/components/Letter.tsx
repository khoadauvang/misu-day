import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react'
import { colorVar, type ColorToken } from '../data/districts.ts'
import { playSfx } from '../lib/sound.ts'
import { Sticker } from './Sticker.tsx'

// Xấp thư viết tay dùng chung (thư sinh nhật, thư 20/10):
// mỗi trang một tờ giấy, vuốt hoặc bấm ‹ › để lật "xoẹt", trang cuối có nút kết thúc.

export type LetterPage = {
  text: string
  /** Màu giấy (tên màu trong src/index.css) */
  paper: ColorToken
  /** Dòng chữ to, đậm ở dưới đoạn thư (xuống dòng bằng \n) */
  big?: string
  /** Ký tên ở cuối trang này */
  signed?: boolean
}

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

type LetterProps = {
  pages: LetterPage[]
  /** Tiêu đề ở trang đầu, mỗi phần tử một dòng */
  title: string[]
  signature: string
  /** Sticker dán góc thư */
  stamp?: string
  /** Chữ trên nút ở trang cuối */
  finishLabel: string
  /** Vuốt sang trái ở trang cuối cũng như bấm nút trang cuối */
  swipeToFinish?: boolean
  onFinish: () => void
}

type LetterCardProps = {
  letter: LetterProps
  index: number
  className?: string
  onNext: () => void
  onBack: () => void
  onFinish: () => void
  onAnimationEnd?: () => void
}

/** Một trang thư */
function LetterCard({ letter, index, className = '', onNext, onBack, onFinish, onAnimationEnd }: LetterCardProps) {
  const { pages, title, signature, stamp = '💗', finishLabel, swipeToFinish } = letter
  const last = pages.length - 1
  const page = pages[index]
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
    if (dx < 0 && index < last) onNext()
    else if (dx < 0 && swipeToFinish) onFinish()
    if (dx > 0 && index > 0) onBack()
  }

  return (
    <article
      aria-label={`Page ${index + 1} of ${pages.length}`}
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
      <Sticker emoji={stamp} className="absolute top-3 left-4 -rotate-12 text-[20px]" />

      {index === 0 && <FitTitle lines={title} />}

      <div
        ref={textRef}
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto font-hand leading-[1.62] font-medium text-pretty ${index === 0 ? 'mt-4' : 'mt-1'} ${page.big ? 'justify-center' : ''}`}
      >
        <p>{page.text}</p>
        {page.big && (
          <p className="mt-5 text-center font-display text-[1.45em] leading-[1.15] font-extrabold break-words whitespace-pre-line text-peony-deep">
            {page.big}
          </p>
        )}
        {page.signed && (
          <p className="mt-4 text-right font-semibold">
            — {signature} <Sticker emoji="💗" />
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
        {index === last ? (
          <button
            type="button"
            onClick={onFinish}
            className="press rounded-full bg-peony px-6 py-3 text-[16px] font-extrabold shadow-float"
          >
            {finishLabel}
          </button>
        ) : (
          <>
            <ol aria-hidden className="flex items-center gap-1.5">
              {pages.map((_, i) => (
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

/** Thời gian tối đa của hiệu ứng lật trang (mili giây) */
const TURN_FALLBACK_MS = 900
const noop = () => {}

/** Xấp thư: trang trên cùng đọc được, tờ tiếp theo ló ra phía sau */
export function Letter(props: LetterProps) {
  const { pages, onFinish } = props
  const last = pages.length - 1
  const [page, setPage] = useState(0)
  /** Trang đang bay đi (lật tới) hoặc nằm dưới (lật lui) trong lúc chạy hiệu ứng */
  const [turn, setTurn] = useState<{ from: number; dir: 'next' | 'back' } | null>(null)

  const go = (dir: 'next' | 'back') => {
    if (turn) return
    const from = page
    const to = dir === 'next' ? page + 1 : page - 1
    if (to < 0 || to > last) return
    setTurn({ from, dir })
    setPage(to)
    playSfx('page')
    // Phòng khi hiệu ứng bị ngắt (ví dụ thoát app giữa chừng): tự mở khóa lật trang
    window.setTimeout(() => setTurn((t) => (t?.from === from ? null : t)), TURN_FALLBACK_MS)
  }

  // Bàn phím (thử trên Mac): ← → lật trang
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go('next')
      if (event.key === 'ArrowLeft') go('back')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="relative h-full w-full max-w-sm animate-letter-open">
      {page < last && (
        <div
          aria-hidden
          className="absolute inset-0 translate-x-1.5 translate-y-2 rotate-[2.5deg] rounded-[30px] ring-4 ring-white/70"
          style={paperStyle(pages[page + 1].paper)}
        />
      )}
      {turn?.dir === 'back' && (
        <LetterCard letter={props} index={turn.from} onNext={noop} onBack={noop} onFinish={noop} />
      )}
      <LetterCard
        key={page}
        letter={props}
        index={page}
        className={turn ? (turn.dir === 'next' ? 'animate-stack-up' : 'z-10 animate-swoosh-back') : ''}
        onAnimationEnd={turn?.dir === 'back' ? () => setTurn(null) : undefined}
        onNext={() => go('next')}
        onBack={() => go('back')}
        onFinish={() => {
          if (!turn) onFinish()
        }}
      />
      {turn?.dir === 'next' && (
        <LetterCard
          key={`leaving-${turn.from}`}
          letter={props}
          index={turn.from}
          className="pointer-events-none z-10 animate-swoosh-out"
          onAnimationEnd={() => setTurn(null)}
          onNext={noop}
          onBack={noop}
          onFinish={noop}
        />
      )}
    </div>
  )
}
