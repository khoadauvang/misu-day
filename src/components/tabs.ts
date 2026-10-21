// Danh sách tab ở thanh dưới. Thêm/bớt tab ở đây.
// home = căn phòng của Misu (chỉ vào được khi đang ở Phú Nhuận), profile = trang trạng thái
export const TABS = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'map', label: 'Map', emoji: '🗺️' },
  { id: 'messages', label: 'Messages', emoji: '💌' },
  { id: 'collection', label: 'Collection', emoji: '🎀' },
  { id: 'profile', label: 'Profile', emoji: '🌸' },
] as const

export type TabId = (typeof TABS)[number]['id']
