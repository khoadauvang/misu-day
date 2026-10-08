import { useEffect, useState } from 'react'
import type { GifPick } from '../lib/giphy.ts'
import type { Movie } from '../game/types.ts'
import { Sticker } from './Sticker.tsx'

/** Chờ GIF tối đa bao lâu rồi hiện emoji thay (GIF tới muộn vẫn được thay vào) */
const WAIT_MS = 7_000

type MovieGifFrameProps = {
  movie: Movie
  /** GIF đang tải (xem takeMovieGif trong src/lib/giphy.ts) */
  gif: Promise<GifPick | null>
  className?: string
}

/**
 * Khung sticker hiện GIF của phim: đang tải thì nhấp nháy,
 * không có GIF (mất mạng, lỗi, chờ quá lâu) thì hiện emoji của phim. Popup không bao giờ phải chờ GIF.
 */
export function MovieGifFrame({ movie, gif, className = '' }: MovieGifFrameProps) {
  // undefined = đang tìm GIF, null = không có GIF
  const [pick, setPick] = useState<GifPick | null | undefined>(undefined)
  const [loaded, setLoaded] = useState(false)
  const [waitedTooLong, setWaitedTooLong] = useState(false)

  useEffect(() => {
    let alive = true
    void gif.then((found) => {
      if (alive) setPick(found)
    })
    const timer = setTimeout(() => {
      if (alive) setWaitedTooLong(true)
    }, WAIT_MS)
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [gif])

  const showEmoji = !loaded && (pick === null || waitedTooLong)

  return (
    <figure className={`relative mx-auto w-full ${className}`}>
      <div className="relative aspect-[16/10] -rotate-1 overflow-hidden rounded-[24px] border-4 border-white bg-petal shadow-float">
        {pick && (
          <img
            src={pick.url}
            alt={`A moment from ${movie.title}`}
            draggable={false}
            onLoad={() => setLoaded(true)}
            onError={() => setPick(null)}
            className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {!loaded &&
          (showEmoji ? (
            <span className="absolute inset-0 grid place-items-center">
              <Sticker emoji={movie.emoji} className="text-[64px]" />
            </span>
          ) : (
            <span aria-hidden className="absolute inset-0 animate-pulse bg-peony/25" />
          ))}
      </div>
      {loaded && (
        <span aria-hidden className="absolute -top-3 -left-2">
          <Sticker emoji={movie.emoji} className="-rotate-12 text-[34px]" />
        </span>
      )}
      {pick !== null && (
        <figcaption className="mt-1.5 text-right text-[11px] font-extrabold tracking-wide text-plum-soft">
          Powered by GIPHY
        </figcaption>
      )}
    </figure>
  )
}
