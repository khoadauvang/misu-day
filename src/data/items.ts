import type { Item } from '../game/types.ts'

// Đồ sưu tầm: mua hoặc nhận được thì thành sticker trong Collection.
// Muốn thêm món mới: thêm một dòng ở đây, rồi gắn id vào một hoạt động trong places.ts.

export const ITEMS: Item[] = [
  // Shoes
  { id: 'mexico-66', name: 'Onitsuka Tiger Mexico 66', emoji: '👟', category: 'shoes' },
  { id: 'birkenstock', name: 'Birkenstock sandals', emoji: '🩴', category: 'shoes' },
  { id: 'pink-sneakers', name: 'Pink sneakers', emoji: '👟', category: 'shoes' },
  // Bags
  { id: 'chanel-bag', name: 'Chanel bag', emoji: '👜', category: 'bags' },
  { id: 'gucci-bag', name: 'Gucci bag', emoji: '👛', category: 'bags' },
  // Beauty
  { id: 'lipstick', name: 'Pink lipstick', emoji: '💄', category: 'beauty' },
  { id: 'perfume', name: 'Perfume', emoji: '🧴', category: 'beauty' },
  // Jewelry & watches
  { id: 'rolex', name: 'Rolex watch', emoji: '⌚', category: 'jewelry' },
  { id: 'diamond-ring', name: 'Diamond ring', emoji: '💍', category: 'jewelry' },
  { id: 'necklace', name: 'Necklace', emoji: '💎', category: 'jewelry' },
  // Tech
  { id: 'airpods', name: 'AirPods', emoji: '🎧', category: 'tech' },
  { id: 'sony-headphones', name: 'Sony headphones', emoji: '🎧', category: 'tech' },
  { id: 'phone-case', name: 'Pink iPhone case', emoji: '📱', category: 'tech' },
  // Plushies
  { id: 'teddy-bear', name: 'Teddy bear', emoji: '🧸', category: 'plushies' },
  { id: 'bunny-plush', name: 'Bunny plush', emoji: '🐰', category: 'plushies' },
  { id: 'puppy-plush', name: 'Puppy plush', emoji: '🐶', category: 'plushies' },
  { id: 'fuggler', name: 'Fuggler', emoji: '👾', category: 'plushies' },
  // Flowers
  { id: 'lavender', name: 'Lavender', emoji: '🪻', category: 'flowers' },
  { id: 'hydrangeas', name: 'Hydrangeas', emoji: '💐', category: 'flowers' },
  { id: 'roses', name: 'Roses', emoji: '🌹', category: 'flowers' },
  { id: 'tulips', name: 'Tulips', emoji: '🌷', category: 'flowers' },
  { id: 'babys-breath', name: "Baby's breath", emoji: '💮', category: 'flowers' },
  { id: 'peonies', name: 'Peonies', emoji: '🌸', category: 'flowers' },
  // Books
  { id: 'novel', name: 'Novel', emoji: '📕', category: 'books' },
  { id: 'history-book', name: 'History book', emoji: '📘', category: 'books' },
  // Home decor
  { id: 'table-lamp', name: 'Pastel table lamp', emoji: '💡', category: 'decor' },
  { id: 'candle', name: 'Scented candle', emoji: '🕯️', category: 'decor' },
  { id: 'vase', name: 'Ceramic vase', emoji: '🏺', category: 'decor' },
  { id: 'cushion', name: 'Fluffy cushion', emoji: '🛋️', category: 'decor' },
  // Souvenirs
  { id: 'blind-box', name: 'Miniso blind box', emoji: '🎁', category: 'souvenirs' },
  { id: 'muji-notebook', name: 'Muji notebook', emoji: '📓', category: 'souvenirs' },
  { id: 'ticket-stub', name: 'Movie ticket stub', emoji: '🎟️', category: 'souvenirs' },
  { id: 'lightstick', name: 'Concert lightstick', emoji: '🪄', category: 'souvenirs' },
]

export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ITEMS.map((item) => [item.id, item]))
