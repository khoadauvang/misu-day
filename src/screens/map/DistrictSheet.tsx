import { useState } from 'react'
import { ActivityRow } from '../../components/ActivityRow.tsx'
import { Chip } from '../../components/Chip.tsx'
import { Sheet } from '../../components/Sheet.tsx'
import { Sticker } from '../../components/Sticker.tsx'
import { colorVar, DISTRICT_BY_ID, type District } from '../../data/districts.ts'
import { PLACE_BY_ID, placesIn } from '../../data/places.ts'
import { levelInfo } from '../../game/level.ts'
import { isOpenAt, openLabel } from '../../game/rules.ts'
import { useGame } from '../../game/store.ts'
import type { DistrictId, Place } from '../../game/types.ts'
import { useUi } from '../../game/ui.ts'

// Sheet của một quận: danh sách địa điểm → chạm vào một nơi để xem các hoạt động.

function PlaceList({ district, onPick }: { district: District; onPick: (placeId: string) => void }) {
  const now = useUi((s) => s.now)
  const level = levelInfo(useGame((s) => s.save.xp)).level

  return (
    <>
      <header className="flex items-center gap-3 pr-12">
        <span
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full ring-4 ring-white"
          style={{ backgroundColor: colorVar(district.color) }}
        >
          <Sticker emoji={district.emoji} className="text-[30px]" />
        </span>
        <div>
          <h2 id="sheet-title" className="font-display text-[26px] leading-none font-bold">
            {district.name}
          </h2>
          <p className="mt-1 text-[14px] font-semibold text-plum-soft">{district.theme}</p>
        </div>
      </header>

      <ul className="mt-5 space-y-2.5">
        {placesIn(district.id).map((place) => {
          const locked = level < place.unlockLevel
          const closed = !locked && !isOpenAt(place.open, now)
          return (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => onPick(place.id)}
                className="press flex w-full items-center gap-3 rounded-[24px] bg-white p-3.5 text-left ring-1 ring-petal"
              >
                <Sticker emoji={place.emoji} className={`text-[32px] ${locked ? 'opacity-50 grayscale' : ''}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[18px] leading-tight font-bold">
                    {place.name}
                    {place.favorite && <span aria-label="Misu's favorite"> ⭐</span>}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-snug font-semibold text-plum-soft">{place.tagline}</p>
                </div>
                {locked ? (
                  <Chip className="bg-petal">🔒 Lv {place.unlockLevel}</Chip>
                ) : closed ? (
                  <Chip className="bg-hydrangea/50">Closed now</Chip>
                ) : (
                  <span aria-hidden className="text-[24px] leading-none text-plum-soft">
                    ›
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

function PlaceView({ district, place, onBack }: { district: District; place: Place; onBack: () => void }) {
  const level = levelInfo(useGame((s) => s.save.xp)).level
  const locked = level < place.unlockLevel

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="press -ml-1 flex items-center gap-1 rounded-full py-1.5 pr-3 pl-1 text-[15px] font-extrabold text-plum-soft"
      >
        <span aria-hidden className="text-[22px] leading-none">
          ‹
        </span>
        {district.name}
      </button>

      <header className="mt-2 flex items-center gap-3 pr-10">
        <Sticker emoji={place.emoji} className="text-[44px]" />
        <div className="min-w-0">
          <h2 id="sheet-title" className="font-display text-[26px] leading-[1.05] font-bold text-balance">
            {place.name}
          </h2>
          <p className="mt-1 text-[14px] font-semibold text-plum-soft">{place.tagline}</p>
          {place.open && <p className="mt-1 text-[13px] font-bold">⏰ Open {openLabel(place.open)}</p>}
        </div>
      </header>

      {locked && (
        <p className="mt-4 rounded-[20px] bg-petal px-4 py-3 text-[14px] font-bold">
          🔒 Opens at Level {place.unlockLevel}. You're Level {level} now.
        </p>
      )}

      <ul className="mt-4 space-y-2.5">
        {place.activities.map((activity) => (
          <ActivityRow key={activity.id} place={place} activity={activity} />
        ))}
      </ul>
    </>
  )
}

type DistrictSheetProps = { districtId: DistrictId | null; onClose: () => void }

export function DistrictSheet({ districtId, onClose }: DistrictSheetProps) {
  const [placeId, setPlaceId] = useState<string | null>(null)
  const district = districtId ? DISTRICT_BY_ID[districtId] : null
  const place = placeId ? PLACE_BY_ID[placeId] : null

  return (
    <Sheet open={district !== null} onClose={onClose} labelledBy="sheet-title">
      {district &&
        (place ? (
          <PlaceView district={district} place={place} onBack={() => setPlaceId(null)} />
        ) : (
          <PlaceList district={district} onPick={setPlaceId} />
        ))}
    </Sheet>
  )
}
