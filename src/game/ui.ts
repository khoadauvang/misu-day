import { create } from 'zustand'
import { gameNow } from './clock.ts'

// Trạng thái tạm của giao diện, không lưu lại khi tắt app

type UiStore = {
  /** Giờ hiện tại của game, cập nhật mỗi 30 giây */
  now: number
  setNow: (t: number) => void
}

export const useUi = create<UiStore>()((set) => ({
  now: gameNow(),
  setNow: (now) => set({ now }),
}))
