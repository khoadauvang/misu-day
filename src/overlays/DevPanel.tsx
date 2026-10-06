import { useState, type ReactNode } from 'react'
import { Sheet } from '../components/Sheet.tsx'
import { MAX_ENERGY } from '../data/economy.ts'
import { addDevOffset, clearDevOffset, gameNow, getDevOffset, nextDayStart } from '../game/clock.ts'
import { useGame } from '../game/store.ts'
import { useUi } from '../game/ui.ts'
import { refreshClock } from '../game/useGameClock.ts'

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
