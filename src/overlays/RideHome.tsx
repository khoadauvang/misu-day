import { useCallback, useState } from 'react'
import { HOME_DISTRICT } from '../data/districts.ts'
import { runRide } from '../game/actions.ts'
import { useGame } from '../game/store.ts'
import type { DistrictId } from '../game/types.ts'
import { useUi } from '../game/ui.ts'
import { RideOverlay, RideSheet } from '../screens/map/Ride.tsx'

// Bấm tab Home khi đang ở quận khác: hỏi gọi xe Xanh SM về Phú Nhuận → màn đi xe → vào phòng (có màn mở cửa).

export function RideHome() {
  const open = useUi((s) => s.rideHomeOpen)
  const setOpen = useUi((s) => s.setRideHomeOpen)
  const setTab = useUi((s) => s.setTab)
  const [from, setFrom] = useState<DistrictId | null>(null)

  const close = useCallback(() => setOpen(false), [setOpen])
  const book = () => {
    const start = useGame.getState().save.location
    if (!runRide(HOME_DISTRICT)) return
    setOpen(false)
    setFrom(start)
  }
  const arrive = useCallback(() => {
    setFrom(null)
    setTab('home')
  }, [setTab])

  return (
    <>
      <RideSheet to={open ? HOME_DISTRICT : null} onClose={close} onBook={book} />
      {from && <RideOverlay from={from} to={HOME_DISTRICT} onDone={arrive} />}
    </>
  )
}
