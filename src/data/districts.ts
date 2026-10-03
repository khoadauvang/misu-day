import type { DistrictId } from '../game/types.ts'

// Các quận của map Sài Gòn. Thêm/sửa quận ở đây; địa điểm trong từng quận nằm ở places.ts.

/** Tên màu trong src/index.css */
export type ColorToken = 'petal' | 'butter' | 'mint' | 'hydrangea' | 'peach' | 'lavender' | 'peony'

export type District = {
  id: DistrictId
  name: string
  theme: string
  emoji: string
  color: ColorToken
  /** Vị trí tâm và bán kính trên bản đồ (khung 360 × 460) */
  map: { x: number; y: number; r: number }
}

export const DISTRICTS: District[] = [
  { id: 'pn', name: 'Phú Nhuận', theme: 'Street snacks', emoji: '🧋', color: 'mint', map: { x: 116, y: 92, r: 44 } },
  { id: 'd9', name: 'District 9', theme: 'Concerts & cinema', emoji: '🎤', color: 'peony', map: { x: 298, y: 82, r: 46 } },
  { id: 'd3', name: 'District 3', theme: 'Cafés, books & beauty', emoji: '☕', color: 'butter', map: { x: 86, y: 202, r: 48 } },
  { id: 'd2', name: 'District 2', theme: 'Thảo Điền chill', emoji: '🍸', color: 'lavender', map: { x: 294, y: 216, r: 48 } },
  { id: 'd1', name: 'District 1', theme: 'Luxury & fashion', emoji: '👜', color: 'petal', map: { x: 172, y: 272, r: 52 } },
  { id: 'd5', name: 'District 5', theme: 'Chinatown eats', emoji: '🥟', color: 'peach', map: { x: 70, y: 344, r: 46 } },
  { id: 'd7', name: 'District 7', theme: 'Japan & Korea town', emoji: '🍣', color: 'hydrangea', map: { x: 204, y: 396, r: 50 } },
]

export const DISTRICT_BY_ID = Object.fromEntries(DISTRICTS.map((d) => [d.id, d])) as Record<DistrictId, District>

/** Đường nối giữa các quận trên bản đồ (D1 – D2 là cây cầu qua sông) */
export const ROADS: [DistrictId, DistrictId][] = [
  ['pn', 'd3'],
  ['pn', 'd1'],
  ['d3', 'd1'],
  ['d3', 'd5'],
  ['d5', 'd7'],
  ['d1', 'd7'],
  ['d1', 'd2'],
  ['d2', 'd9'],
]

/** Tên màu → biến CSS, dùng được cho cả SVG lẫn style */
export const colorVar = (token: ColorToken) => `var(--color-${token})`
