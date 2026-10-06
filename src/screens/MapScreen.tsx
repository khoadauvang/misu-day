import { useCallback, useEffect, useState } from 'react'
import { Sticker } from '../components/Sticker.tsx'
import type { DistrictId } from '../game/types.ts'
import { useUi } from '../game/ui.ts'
import { DistrictSheet } from './map/DistrictSheet.tsx'
import { SaigonMap } from './map/SaigonMap.tsx'
import { WorldView } from './map/WorldView.tsx'

type View = 'saigon' | 'world'

const VIEWS: { id: View; label: string; emoji: string }[] = [
  { id: 'saigon', label: 'Saigon', emoji: '🏙️' },
  { id: 'world', label: 'World', emoji: '🌏' },
]

/** Tab Map: chọn map (Sài Gòn hoặc World) → chạm quận → địa điểm → hoạt động */
export function MapScreen() {
  // Từ tab khác bấm "Go to the Pet Shop": mở sẵn quận + địa điểm đó ngay khi vào tab Map
  const [target] = useState(() => useUi.getState().mapTarget)
  const [view, setView] = useState<View>('saigon')
  const [districtId, setDistrictId] = useState<DistrictId | null>(target?.district ?? null)
  const [placeId, setPlaceId] = useState<string | undefined>(target?.place)
  const closeSheet = useCallback(() => {
    setDistrictId(null)
    setPlaceId(undefined)
  }, [])

  useEffect(() => {
    if (target) useUi.getState().clearMapTarget()
  }, [target])

  return (
    <div className="mx-auto max-w-md">
      <header>
        <h1 className="font-display text-[34px] leading-none font-bold">{view === 'saigon' ? 'Saigon' : 'World'}</h1>
        <p className="mt-1.5 text-[15px] font-semibold text-plum-soft">
          {view === 'saigon' ? 'Tap a district to explore' : 'Trips unlock as you level up and save'}
        </p>
      </header>

      <div role="tablist" aria-label="Maps" className="mt-4 flex rounded-full bg-white/85 p-1 ring-1 ring-petal">
        {VIEWS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={view === option.id}
            onClick={() => setView(option.id)}
            className={`press flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-[15px] font-extrabold transition-colors ${
              view === option.id ? 'bg-petal text-plum' : 'text-plum-soft'
            }`}
          >
            <Sticker emoji={option.emoji} className="text-[18px]" />
            {option.label}
          </button>
        ))}
      </div>

      {view === 'saigon' ? <SaigonMap onPick={setDistrictId} /> : <WorldView />}

      {/* key: đổi quận thì sheet mở lại từ danh sách địa điểm (hoặc từ địa điểm được chọn sẵn) */}
      <DistrictSheet
        key={`${districtId ?? 'none'}/${placeId ?? ''}`}
        districtId={districtId}
        initialPlaceId={placeId}
        onClose={closeSheet}
      />
    </div>
  )
}
