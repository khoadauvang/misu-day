import { ActivityRow } from '../../components/ActivityRow.tsx'
import { Chip } from '../../components/Chip.tsx'
import { Sheet } from '../../components/Sheet.tsx'
import { Sticker } from '../../components/Sticker.tsx'
import { PLACE_BY_ID, placesIn } from '../../data/places.ts'
import { levelInfo } from '../../game/level.ts'
import { isOpenAt, openLabel } from '../../game/rules.ts'
import { useGame } from '../../game/store.ts'
import type { DistrictId, Place } from '../../game/types.ts'
import { useUi } from '../../game/ui.ts'

// Danh sách địa điểm dưới cảnh quận, và sheet của một địa điểm (các hoạt động + nút "Do it").

/** Danh sách địa điểm của một quận (hiện dưới cảnh vẽ, cho ai thích chọn theo tên) */
export function PlaceList({ districtId, onPick }: { districtId: DistrictId; onPick: (placeId: string) => void }) {
  const now = useUi((s) => s.now)
  const level = levelInfo(useGame((s) => s.save.xp)).level

  return (
    <ul className="space-y-2.5">
      {placesIn(districtId).map((place) => {
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
  )
}

function PlaceView({ place }: { place: Place }) {
  const level = levelInfo(useGame((s) => s.save.xp)).level
  const locked = level < place.unlockLevel

  return (
    <>
      <header className="flex items-center gap-3 pr-12">
        <Sticker emoji={place.emoji} className="text-[44px]" />
        <div className="min-w-0">
          <h2 id="place-title" className="font-display text-[26px] leading-[1.05] font-bold text-balance">
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

/** Sheet của một địa điểm: chạm tòa nhà trong cảnh quận (hoặc dòng trong danh sách) để mở */
export function PlaceSheet({ placeId, onClose }: { placeId: string | null; onClose: () => void }) {
  const place = placeId ? PLACE_BY_ID[placeId] : undefined
  return (
    <Sheet open={place !== undefined} onClose={onClose} labelledBy="place-title">
      {place && <PlaceView place={place} />}
    </Sheet>
  )
}
