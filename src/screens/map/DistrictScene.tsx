import { useEffect, useMemo, useRef } from 'react'
import { Chip } from '../../components/Chip.tsx'
import { Sticker } from '../../components/Sticker.tsx'
import { colorVar, DISTRICT_BY_ID } from '../../data/districts.ts'
import { PLACE_BY_ID } from '../../data/places.ts'
import { goHome } from '../../game/actions.ts'
import { levelInfo } from '../../game/level.ts'
import { isOpenAt } from '../../game/rules.ts'
import { useGame } from '../../game/store.ts'
import type { DistrictId } from '../../game/types.ts'
import { useUi } from '../../game/ui.ts'
import { PlaceList } from './PlaceSheet.tsx'
import { HOME_SPOT, SceneContext, type SceneApi } from './scenes/context.ts'
import { SCENE_H, SCENE_W } from './scenes/geometry.ts'
import { SCENES } from './scenes/index.ts'

// Màn hình bên trong một quận: cảnh phố vẽ tay (chạm tòa nhà để vào) + danh sách địa điểm + nút quay lại bản đồ.

type DistrictSceneProps = {
  districtId: DistrictId
  onBack: () => void
  onPickPlace: (placeId: string) => void
}

export function DistrictScene({ districtId, onBack, onPickPlace }: DistrictSceneProps) {
  const district = DISTRICT_BY_ID[districtId]
  const Scene = SCENES[districtId]
  const now = useUi((s) => s.now)
  const level = levelInfo(useGame((s) => s.save.xp)).level
  const here = useGame((s) => s.save.location) === districtId
  const rootRef = useRef<HTMLDivElement>(null)

  // Vào quận thì cuộn vùng nội dung lên đầu, để thấy cả cảnh phố
  useEffect(() => {
    rootRef.current?.closest('main')?.scrollTo({ top: 0 })
  }, [districtId])

  const scene = useMemo<SceneApi>(
    () => ({
      // Biệt thự nhà Misu: vào phòng (tab Home)
      pick: (id) => (id === HOME_SPOT ? goHome() : onPickPlace(id)),
      status: (id) => {
        const place = PLACE_BY_ID[id]
        const locked = level < (place?.unlockLevel ?? 1)
        return { locked, closed: !locked && !isOpenAt(place?.open, now), unlockLevel: place?.unlockLevel ?? 1 }
      },
    }),
    [level, now, onPickPlace],
  )

  return (
    <div ref={rootRef} className="mx-auto max-w-md animate-scene-in">
      <button
        type="button"
        onClick={onBack}
        className="press -ml-1 flex items-center gap-1 rounded-full bg-white/85 py-1.5 pr-4 pl-2 text-[15px] font-extrabold text-plum-soft ring-1 ring-petal"
      >
        <span aria-hidden className="text-[22px] leading-none">
          ‹
        </span>
        Saigon map
      </button>

      <header className="mt-4 flex items-center gap-3">
        <span
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full ring-4 ring-white"
          style={{ backgroundColor: colorVar(district.color) }}
        >
          <Sticker emoji={district.emoji} className="text-[30px]" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-[30px] leading-none font-bold">{district.name}</h1>
          <p className="mt-1 text-[14px] font-semibold text-plum-soft">{district.theme}</p>
        </div>
        {here && <Chip className="shrink-0 bg-mint">📍 You're here</Chip>}
      </header>

      <div className="mt-4 overflow-hidden rounded-[32px] bg-paper ring-1 ring-petal">
        <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} className="block h-auto w-full" role="group" aria-label={`Street in ${district.name}`}>
          <SceneContext.Provider value={scene}>
            <Scene />
          </SceneContext.Provider>
        </svg>
      </div>
      <p className="mt-2.5 text-center text-[13px] font-bold text-plum-soft">Tap a building to step inside</p>

      <h2 className="mt-5 font-display text-[20px] font-bold">Places</h2>
      <div className="mt-2">
        <PlaceList districtId={districtId} onPick={onPickPlace} />
      </div>
    </div>
  )
}
