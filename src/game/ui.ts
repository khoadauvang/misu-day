import { create } from 'zustand'
import type { TabId } from '../components/tabs.ts'
import { PLACE_BY_ID } from '../data/places.ts'
import type { GifPick } from '../lib/giphy.ts'
import { gameNow } from './clock.ts'
import type { ActivityResult, DistrictId } from './types.ts'

// Trạng thái tạm của giao diện, không lưu lại khi tắt app

/** Cún phản ứng sau khi được chăm: bong bóng nhỏ trên thẻ cún ở Home */
export type PetReaction = { id: number; emoji: string; text: string }

type UiStore = {
  /** Giờ hiện tại của game, cập nhật mỗi 30 giây */
  now: number
  setNow: (t: number) => void
  /** Kết quả hoạt động vừa làm, hiện trong popup */
  result: ActivityResult | null
  /** GIF phim đi kèm popup Movie night (đang tải hoặc đã có); null nếu không có */
  resultGif: Promise<GifPick | null> | null
  showResult: (result: ActivityResult, gif?: Promise<GifPick | null> | null) => void
  closeResult: () => void
  /** Tab đang mở ở thanh dưới */
  tab: TabId
  setTab: (tab: TabId) => void
  /** Sang tab Map và mở sẵn một địa điểm (ví dụ nút "Go to the Pet Shop") */
  mapTarget: { district: DistrictId; place: string } | null
  goToPlace: (placeId: string) => void
  clearMapTarget: () => void
  /** Đọc lại thư sinh nhật (nút trong Collection) */
  letterOpen: boolean
  setLetterOpen: (open: boolean) => void
  /** Hộp đặt tên khi nhận nuôi cún */
  adoptOpen: boolean
  setAdoptOpen: (open: boolean) => void
  petReaction: PetReaction | null
  showPetReaction: (reaction: Omit<PetReaction, 'id'>) => void
}

/** Bong bóng phản ứng của cún tự tắt sau bao lâu */
const PET_REACTION_MS = 2400

export const useUi = create<UiStore>()((set, get) => ({
  now: gameNow(),
  setNow: (now) => set({ now }),
  result: null,
  resultGif: null,
  showResult: (result, gif = null) => set({ result, resultGif: gif }),
  closeResult: () => set({ result: null, resultGif: null }),
  tab: 'home',
  setTab: (tab) => set({ tab }),
  mapTarget: null,
  goToPlace: (placeId) => {
    const place = PLACE_BY_ID[placeId]
    if (place) set({ tab: 'map', mapTarget: { district: place.district, place: place.id } })
  },
  clearMapTarget: () => set({ mapTarget: null }),
  letterOpen: false,
  setLetterOpen: (letterOpen) => set({ letterOpen }),
  adoptOpen: false,
  setAdoptOpen: (adoptOpen) => set({ adoptOpen }),
  petReaction: null,
  showPetReaction: (reaction) => {
    const id = Date.now()
    set({ petReaction: { ...reaction, id } })
    setTimeout(() => {
      if (get().petReaction?.id === id) set({ petReaction: null })
    }, PET_REACTION_MS)
  },
}))
