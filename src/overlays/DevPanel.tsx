import { useState, type ReactNode } from 'react'
import { MovieGifFrame } from '../components/MovieGif.tsx'
import { Sheet } from '../components/Sheet.tsx'
import { MAX_ENERGY } from '../data/economy.ts'
import { MOVIES } from '../data/movies.ts'
import { addDevOffset, clearDevOffset, gameNow, getDevOffset, nextDayStart } from '../game/clock.ts'
import { useGame } from '../game/store.ts'
import { useUi } from '../game/ui.ts'
import { refreshClock } from '../game/useGameClock.ts'
import { gifQuery, hasGiphy, takeMovieGif } from '../lib/giphy.ts'
import { SFX_NAMES } from '../lib/sfx.ts'
import { playBirthdaySong, playSfx, soundStatus } from '../lib/sound.ts'

function DevButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="press rounded-[18px] bg-white px-3 py-3 text-[14px] font-extrabold ring-1 ring-petal"
    >
      {children}
    </button>
  )
}

/** Nghe thử từng tiếng hiệu ứng + xem âm thanh đang chạy chưa (iPhone gạt im lặng thì không có tiếng) */
function SoundCheck() {
  const [status, setStatus] = useState(soundStatus)
  const refresh = () => window.setTimeout(() => setStatus(soundStatus()), 400)
  return (
    <div className="mt-2 rounded-[22px] bg-white px-4 py-3 ring-1 ring-petal">
      <p className="text-[12px] font-bold text-plum-soft">
        Audio: {status.state} · music {status.music} · sounds ready {status.effects}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {SFX_NAMES.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              playSfx(name)
              refresh()
            }}
            className="press rounded-full bg-petal px-3 py-1.5 text-[13px] font-extrabold"
          >
            {name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            playBirthdaySong()
            refresh()
          }}
          className="press rounded-full bg-butter px-3 py-1.5 text-[13px] font-extrabold"
        >
          Happy Birthday 🎂
        </button>
      </div>
    </div>
  )
}

/**
 * Lướt qua GIF của từng phim trong Movie night để bắt GIF sai trước khi trao quà.
 * GIF sai: thêm gif.q (từ khóa khác) hoặc gif.ids (id GIF tự chọn) cho phim đó trong src/data/movies.ts.
 */
function GifCheck() {
  const [index, setIndex] = useState(0)
  const [round, setRound] = useState(0)
  const movie = MOVIES[index]
  // Mỗi lần đổi phim hoặc bấm "Another" thì lấy GIF mới
  const [gif, setGif] = useState(() => takeMovieGif(movie))
  const go = (next: number) => {
    const i = (next + MOVIES.length) % MOVIES.length
    setIndex(i)
    setGif(takeMovieGif(MOVIES[i]))
    setRound((r) => r + 1)
  }

  if (!hasGiphy()) {
    return (
      <p className="mt-2 rounded-[18px] bg-petal px-4 py-3 text-[14px] leading-snug font-bold">
        No GIPHY key yet. Add VITE_GIPHY_KEY in Vercel → Settings → Environment Variables, then redeploy.
      </p>
    )
  }
  return (
    <div className="mt-2 rounded-[22px] bg-white px-4 py-4 ring-1 ring-petal">
      <p className="text-[13px] font-extrabold text-plum-soft">
        {index + 1} / {MOVIES.length}
      </p>
      <p className="font-display text-[18px] leading-tight font-bold">{movie.title}</p>
      <p className="mt-0.5 text-[12px] font-bold text-plum-soft select-text">
        {movie.gif?.ids ? `ids: ${movie.gif.ids.join(', ')}` : `search: "${gifQuery(movie)}"`}
      </p>
      {gif && <MovieGifFrame key={round} movie={movie} gif={gif} className="mt-3" />}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <DevButton onClick={() => go(index - 1)}>‹ Prev</DevButton>
        <DevButton onClick={() => go(index)}>Another</DevButton>
        <DevButton onClick={() => go(index + 1)}>Next ›</DevButton>
      </div>
    </div>
  )
}

/**
 * Công cụ thử nghiệm: chỉ hiện khi link có ?dev, nên Misu không bao giờ thấy.
 * Dùng trong tab Safari với link …vercel.app/?preview&dev — dữ liệu ở đó tách riêng với app đã cài.
 */
export function DevPanel() {
  const [open, setOpen] = useState(false)
  const now = useUi((s) => s.now)
  const save = useGame((s) => s.save)
  const devPatch = useGame((s) => s.devPatch)

  const shiftTime = (ms: number) => {
    addDevOffset(ms)
    refreshClock()
  }
  const offsetHours = Math.round(getDevOffset() / 3_600_000)
  const time = new Date(now).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="press fixed top-[max(env(safe-area-inset-top),12px)] right-4 z-30 rounded-full bg-plum px-3.5 py-2 text-[13px] font-extrabold text-paper shadow-float"
      >
        🛠 Dev
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} labelledBy="dev-title">
        <h2 id="dev-title" className="font-display text-[24px] font-bold">
          Developer tools
        </h2>
        <p className="mt-1 text-[14px] font-semibold text-plum-soft">
          Game time: {time}
          {offsetHours !== 0 && ` (${offsetHours > 0 ? '+' : ''}${offsetHours}h)`}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <DevButton onClick={() => shiftTime(3_600_000)}>+1 hour</DevButton>
          <DevButton onClick={() => shiftTime(nextDayStart(gameNow()) - gameNow() + 60_000)}>
            Next morning
          </DevButton>
          <DevButton onClick={() => devPatch({ money: save.money + 10_000_000 })}>+10,000,000₫</DevButton>
          <DevButton onClick={() => devPatch({ xp: save.xp + 500 })}>+500 XP</DevButton>
          <DevButton onClick={() => devPatch({ energy: MAX_ENERGY, energyAt: gameNow() })}>
            Refill energy
          </DevButton>
          <DevButton
            onClick={() => {
              clearDevOffset()
              refreshClock()
            }}
          >
            Reset time
          </DevButton>
        </div>

        <p className="mt-5 text-[13px] font-extrabold text-plum-soft">Birthday & puppy</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {/* Xem lại màn mở đầu như lần đầu (quà nhận lại được, chỉ ở chế độ dev) */}
          <DevButton
            onClick={() => {
              setOpen(false)
              devPatch({ birthdayAt: null })
            }}
          >
            Replay birthday 🎂
          </DevButton>
          <DevButton
            onClick={() =>
              save.pet && devPatch({ pet: { ...save.pet, fullness: 10, happiness: 20, statsAt: gameNow() } })
            }
          >
            Puppy hungry 🥺
          </DevButton>
          <DevButton onClick={() => devPatch({ pet: null, pantry: {} })}>Remove puppy</DevButton>
        </div>
        <p className="mt-5 text-[13px] font-extrabold text-plum-soft">Sounds 🔊</p>
        <SoundCheck />
        <p className="mt-5 text-[13px] font-extrabold text-plum-soft">Movie night GIFs 🎬</p>
        <GifCheck />
        <div className="mt-2 grid">
          <DevButton onClick={() => devPatch({ movies: {} })}>Forget watched movies</DevButton>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!window.confirm('Reset the whole game?')) return
            clearDevOffset()
            useGame.persist.clearStorage()
            window.location.reload()
          }}
          className="press mt-3 w-full rounded-full bg-white py-3 text-[15px] font-extrabold text-peony-deep ring-1 ring-peony"
        >
          Reset game
        </button>
      </Sheet>
    </>
  )
}
