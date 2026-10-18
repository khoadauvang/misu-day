import { useCallback, useEffect, useRef, useState } from 'react'
import { Sticker } from '../components/Sticker.tsx'
import { DISTRICT_BY_ID, HOME_DISTRICT } from '../data/districts.ts'
import { runRide } from '../game/actions.ts'
import { useGame } from '../game/store.ts'
import type { DistrictId } from '../game/types.ts'
import { useUi } from '../game/ui.ts'
import { DistrictScene } from './map/DistrictScene.tsx'
import { PlaceSheet } from './map/PlaceSheet.tsx'
import { RideOverlay, RideSheet } from './map/Ride.tsx'
import { SaigonMap, ZOOM_MS } from './map/SaigonMap.tsx'
import { WorldView } from './map/WorldView.tsx'

type View = 'saigon' | 'world'

const VIEWS: { id: View; label: string; emoji: string }[] = [
  { id: 'saigon', label: 'Saigon', emoji: '🏙️' },
  { id: 'world', label: 'World', emoji: '🌏' },
]

/**
 * Tab Map: bản đồ Sài Gòn (hoặc World) → chạm quận → (đi xe Xanh SM nếu đang ở quận khác)
 * → cảnh phố của quận → chạm tòa nhà → các hoạt động. Nút "‹ Saigon map" để quay lại.
 */
export function MapScreen() {
  // Từ tab khác bấm "Go to the Pet Shop": đang ở đúng quận thì vào thẳng, chưa thì hỏi gọi xe trước
  const [start] = useState(() => {
    const target = useUi.getState().mapTarget
    if (!target) return null
    return { ...target, here: useGame.getState().save.location === target.district }
  })
  const location = useGame((s) => s.save.location)
  const [view, setView] = useState<View>('saigon')
  /** Đang ở trong cảnh của quận nào (null = đang xem bản đồ) */
  const [scene, setScene] = useState<DistrictId | null>(start?.here ? start.district : null)
  const [placeId, setPlaceId] = useState<string | null>(start?.here ? start.place : null)
  /** Sheet xác nhận gọi xe tới quận này */
  const [rideTo, setRideTo] = useState<DistrictId | null>(start && !start.here ? start.district : null)
  /** Đi xe xong thì mở sẵn địa điểm này (ví dụ Pet Shop) */
  const [afterRide, setAfterRide] = useState<string | null>(start && !start.here ? start.place : null)
  /** Đang chạy màn đi xe */
  const [riding, setRiding] = useState<{ from: DistrictId; to: DistrictId } | null>(null)
  const [zoomTo, setZoomTo] = useState<DistrictId | null>(null)
  const [cameBack, setCameBack] = useState(false)
  const zoomTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (start) useUi.getState().clearMapTarget()
  }, [start])
  useEffect(() => () => clearTimeout(zoomTimer.current), [])

  const pickDistrict = (id: DistrictId) => {
    if (id !== location) {
      setAfterRide(null)
      setRideTo(id)
      return
    }
    // Đang ở quận này rồi: phóng to bản đồ vào quận rồi hiện cảnh
    setZoomTo(id)
    zoomTimer.current = setTimeout(() => {
      setScene(id)
      setZoomTo(null)
    }, ZOOM_MS)
  }

  const bookRide = (to: DistrictId) => {
    const from = location
    if (!runRide(to)) return
    setRideTo(null)
    setRiding({ from, to })
  }

  // Tới nơi (hết màn đi xe hoặc Misu chạm để bỏ qua): vào cảnh quận, mở sẵn địa điểm nếu có
  const arrive = useCallback(() => {
    if (!riding) return
    setScene(riding.to)
    setRiding(null)
    setPlaceId(afterRide)
    setAfterRide(null)
  }, [riding, afterRide])

  const leaveScene = () => {
    setScene(null)
    setPlaceId(null)
    setCameBack(true)
  }

  const closeRide = useCallback(() => {
    setRideTo(null)
    setAfterRide(null)
  }, [])
  const closePlace = useCallback(() => setPlaceId(null), [])

  const here = DISTRICT_BY_ID[location]

  return (
    <>
      {scene ? (
        <DistrictScene districtId={scene} onBack={leaveScene} onPickPlace={setPlaceId} />
      ) : (
        <div className="mx-auto max-w-md">
          <header>
            <h1 className="font-display text-[34px] leading-none font-bold">{view === 'saigon' ? 'Saigon' : 'World'}</h1>
            <p className="mt-1.5 text-[15px] font-semibold text-plum-soft">
              {view === 'saigon'
                ? `You're in ${here.name}${location === HOME_DISTRICT ? ' (home)' : ''} · tap a district to go`
                : 'Trips unlock as you level up and save'}
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

          {view === 'saigon' ? (
            <>
              <SaigonMap onPick={pickDistrict} location={location} zoomTo={zoomTo} cameBack={cameBack} />
              <p className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] font-bold text-plum-soft">
                <span>🏡 Home</span>
                <span>📍 You're here</span>
                <span>🚙 Rides by Xanh SM</span>
              </p>
            </>
          ) : (
            <WorldView />
          )}
        </div>
      )}

      <PlaceSheet placeId={scene ? placeId : null} onClose={closePlace} />
      <RideSheet to={rideTo} onClose={closeRide} onBook={bookRide} />
      {riding && <RideOverlay from={riding.from} to={riding.to} onDone={arrive} />}
    </>
  )
}
