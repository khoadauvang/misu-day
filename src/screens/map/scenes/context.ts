import { createContext, useContext } from 'react'

// Cảnh quận cần biết: chạm vào tòa nhà thì làm gì, và mỗi địa điểm đang khóa / đóng cửa hay không.

export type SpotStatus = { locked: boolean; closed: boolean; unlockLevel: number }

export type SceneApi = {
  /** Chạm vào một địa điểm (id trong places.ts), hoặc HOME_SPOT là biệt thự của Misu */
  pick: (spotId: string) => void
  status: (placeId: string) => SpotStatus
}

/** id riêng của biệt thự nhà Misu (không phải địa điểm trong places.ts) */
export const HOME_SPOT = 'home'

export const SceneContext = createContext<SceneApi | null>(null)

export function useScene(): SceneApi {
  const api = useContext(SceneContext)
  if (!api) throw new Error('useScene must be used inside <SceneContext>')
  return api
}
