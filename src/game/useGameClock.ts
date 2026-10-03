import { useEffect } from 'react'
import { gameNow } from './clock.ts'
import { useGame } from './store.ts'
import { useUi } from './ui.ts'

const TICK_MS = 30_000

/** Cập nhật giờ cho giao diện và cho thế giới game chạy tiếp */
export function refreshClock() {
  useUi.getState().setNow(gameNow())
  useGame.getState().tick()
}

/** Cho thế giới chạy: khi mở app, khi quay lại app và mỗi 30 giây */
export function useGameClock() {
  useEffect(() => {
    refreshClock()
    const timer = setInterval(refreshClock, TICK_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshClock()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])
}
