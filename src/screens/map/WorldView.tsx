import { useState } from 'react'
import { Chip } from '../../components/Chip.tsx'
import { Sheet } from '../../components/Sheet.tsx'
import { Sticker } from '../../components/Sticker.tsx'
import { DESTINATIONS, REGIONS, type Destination } from '../../data/destinations.ts'
import { formatMoney } from '../../game/format.ts'
import { levelInfo } from '../../game/level.ts'
import { useGame } from '../../game/store.ts'

// Danh sách chuyến đi theo vùng. Bản 1.0: xem được yêu cầu, chuyến đi mở ở các bản cập nhật sau.

/** 15000000 → "15M₫" cho nhãn ngắn */
const shortMoney = (n: number) => `${n / 1_000_000}M₫`

function Requirement({ done, label, detail }: { done: boolean; label: string; detail: string }) {
  return (
    <li className="flex items-center gap-3 rounded-[20px] bg-white px-4 py-3 ring-1 ring-petal">
      <span aria-hidden className="text-[20px]">
        {done ? '✅' : '⬜️'}
      </span>
      <div>
        <p className="text-[15px] font-bold">{label}</p>
        <p className="text-[13px] font-semibold text-plum-soft">{detail}</p>
      </div>
    </li>
  )
}

export function WorldView() {
  const [picked, setPicked] = useState<Destination | null>(null)
  const save = useGame((s) => s.save)
  const level = levelInfo(save.xp).level

  return (
    <>
      {REGIONS.map((region) => (
        <section key={region} className="mt-6">
          <h2 className="font-display text-[20px] font-bold">{region}</h2>
          <ul className="mt-2.5 grid grid-cols-2 gap-3">
            {DESTINATIONS.filter((d) => d.region === region).map((destination) => (
              <li key={destination.id}>
                <button
                  type="button"
                  onClick={() => setPicked(destination)}
                  className="press h-full w-full rounded-[26px] bg-white/85 p-4 text-left ring-1 ring-petal"
                >
                  <Sticker emoji={destination.flag} className="text-[34px]" />
                  <p className="mt-2 font-display text-[19px] leading-tight font-bold">{destination.city}</p>
                  <p className="text-[13px] font-semibold text-plum-soft">{destination.country}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <Chip className="bg-lavender/70">🔒 Lv {destination.unlockLevel}</Chip>
                    <Chip className="bg-butter">✈️ {shortMoney(destination.flight)}</Chip>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <Sheet open={picked !== null} onClose={() => setPicked(null)} labelledBy="trip-title">
        {picked && (
          <div className="text-center">
            <Sticker emoji={picked.flag} className="mt-2 text-[56px]" />
            <h2 id="trip-title" className="mt-3 font-display text-[28px] leading-tight font-bold">
              {picked.city}
            </h2>
            <p className="text-[15px] font-semibold text-plum-soft">{picked.country}</p>
            <ul className="mt-5 space-y-2 text-left">
              <Requirement
                done={level >= picked.unlockLevel}
                label={`Reach Level ${picked.unlockLevel}`}
                detail={`You're Level ${level}`}
              />
              <Requirement
                done={save.money >= picked.flight}
                label={`Save ${formatMoney(picked.flight)} for the flight`}
                detail={`Wallet: ${formatMoney(save.money)}`}
              />
            </ul>
            <p className="mt-5 rounded-[20px] bg-petal px-4 py-3 text-[15px] font-bold">
              This trip opens in a future update ✈️
            </p>
          </div>
        )}
      </Sheet>
    </>
  )
}
