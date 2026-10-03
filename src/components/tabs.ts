// Danh sách tab ở thanh dưới. Thêm/bớt tab ở đây.
export const TABS = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'map', label: 'Map', emoji: '🗺️' },
  { id: 'messages', label: 'Messages', emoji: '💌' },
  { id: 'collection', label: 'Collection', emoji: '🎀' },
] as const

export type TabId = (typeof TABS)[number]['id']
