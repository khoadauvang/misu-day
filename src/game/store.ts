import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { gameNow } from './clock.ts'
import {
  applyActivity,
  applyMessage,
  applyTick,
  collectAllowance,
  markCouponDone,
  newSave,
  setCouponDelivery,
  setDelivery,
  redeemCoupon,
  type ActivityOutcome,
  type MessageInput,
  type MessageOutcome,
} from './engine.ts'
import type { Activity, Delivery, Place, SaveData } from './types.ts'

// Kho dữ liệu của game. Mọi thay đổi đều tự lưu vào localStorage của điện thoại,
// tắt app mở lại là đọc ra chơi tiếp.

/**
 * Phiên bản cấu trúc dữ liệu. Khi đổi SaveData (thêm, bớt, đổi tên trường)
 * thì tăng số này và viết cách chuyển save cũ sang mới trong migrateSave().
 */
export const SAVE_VERSION = 1
export const SAVE_KEY = 'misu-day:save'

type GameStore = {
  save: SaveData
  /** Cập nhật theo giờ thật: hồi năng lượng, qua ngày mới */
  tick: () => void
  collectAllowance: () => void
  /** Làm một hoạt động; place = null là hoạt động ở nhà */
  doActivity: (place: Place | null, activity: Activity) => Omit<ActivityOutcome, 'save'>
  /** Misu gửi tin cho Chằm Chằm (Module 9) */
  sendMessage: (input: MessageInput) => Omit<MessageOutcome, 'save'>
  setDelivery: (id: string, delivery: Delivery) => void
  /** Love Coupons (Module 10) */
  redeemCoupon: (id: string) => void
  markCouponDone: (id: string) => void
  setCouponDelivery: (id: string, delivery: Delivery) => void
  /** Chỉ dùng trong chế độ ?dev */
  devPatch: (patch: Partial<SaveData>) => void
}

type Persisted = { save: SaveData }

/** Save cũ thiếu trường nào (do bản mới thêm vào) thì lấy giá trị mặc định */
function withDefaults(save: Partial<SaveData> | undefined): SaveData {
  return { ...newSave(gameNow()), ...save }
}

/** Chuyển save từ phiên bản cũ sang phiên bản hiện tại */
function migrateSave(persisted: unknown, version: number): Persisted {
  const old = (persisted as Partial<Persisted> | null)?.save
  // Ví dụ khi lên SAVE_VERSION 2:
  // if (version < 2) { ...đổi dữ liệu cũ ở đây... }
  void version
  return { save: withDefaults(old) }
}

export const useGame = create<GameStore>()(
  persist(
    (set, get) => ({
      save: newSave(gameNow()),
      tick: () => set((s) => ({ save: applyTick(s.save, gameNow()) })),
      collectAllowance: () => set((s) => ({ save: collectAllowance(s.save, gameNow()) })),
      doActivity: (place, activity) => {
        const { save, ...outcome } = applyActivity(get().save, place, activity, gameNow())
        set({ save })
        return outcome
      },
      sendMessage: (input) => {
        const { save, ...outcome } = applyMessage(get().save, input, gameNow())
        set({ save })
        return outcome
      },
      setDelivery: (id, delivery) => set((s) => ({ save: setDelivery(s.save, id, delivery, gameNow()) })),
      redeemCoupon: (id) => set((s) => ({ save: redeemCoupon(s.save, id, gameNow()) })),
      markCouponDone: (id) => set((s) => ({ save: markCouponDone(s.save, id, gameNow()) })),
      setCouponDelivery: (id, delivery) => set((s) => ({ save: setCouponDelivery(s.save, id, delivery, gameNow()) })),
      devPatch: (patch) => set((s) => ({ save: { ...s.save, ...patch } })),
    }),
    {
      name: SAVE_KEY,
      version: SAVE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s): Persisted => ({ save: s.save }), // chỉ lưu dữ liệu, không lưu các hàm
      migrate: migrateSave,
      merge: (persisted, current) => ({
        ...current,
        save: withDefaults((persisted as Partial<Persisted> | undefined)?.save),
      }),
    },
  ),
)
