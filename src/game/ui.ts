import { create } from 'zustand'
import { gameNow } from './clock.ts'
import type { ActivityResult } from './types.ts'

// Trạng thái tạm của giao diện, không lưu lại khi tắt app

type UiStore = {
  /** Giờ hiện tại của game, cập nhật mỗi 30 giây */
  now: number
  setNow: (t: number) => void
  /** Kết quả hoạt động vừa làm, hiện trong popup */
  result: ActivityResult | null
  showResult: (result: ActivityResult) => void
  closeResult: () => void
}

export const useUi = create<UiStore>()((set) => ({
  now: gameNow(),
  setNow: (now) => set({ now }),
  result: null,
  showResult: (result) => set({ result }),
  closeResult: () => set({ result: null }),
}))
