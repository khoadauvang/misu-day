// Các quận của map Sài Gòn. Nội dung là dữ liệu: thêm/sửa quận ở đây, không đụng tới giao diện.
// Module 4 sẽ thêm vị trí trên bản đồ; Module 5 thêm POI và hoạt động cho từng quận.

export type DistrictId = 'd1' | 'd2' | 'd3' | 'd5' | 'd7' | 'd9'

export type District = {
  id: DistrictId
  name: string
  theme: string
  emoji: string
  /** Màu nền riêng của quận (class Tailwind) */
  tint: string
}

export const DISTRICTS: District[] = [
  { id: 'd1', name: 'District 1', theme: 'Luxury & fashion', emoji: '👜', tint: 'bg-petal' },
  { id: 'd3', name: 'District 3', theme: 'Cafés, books & beauty', emoji: '☕', tint: 'bg-butter/70' },
  { id: 'd7', name: 'District 7', theme: 'Japan & Korea town', emoji: '🍣', tint: 'bg-hydrangea/55' },
  { id: 'd5', name: 'District 5', theme: 'Chinatown eats', emoji: '🥟', tint: 'bg-peach' },
  { id: 'd2', name: 'District 2', theme: 'Thảo Điền bars & chill', emoji: '🍸', tint: 'bg-lavender/70' },
  { id: 'd9', name: 'District 9', theme: 'Concerts & cinema', emoji: '🎤', tint: 'bg-white' },
]
