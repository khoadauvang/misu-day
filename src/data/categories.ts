import type { CategoryId } from '../game/types.ts'

// Các nhóm đồ trong Collection. Mỗi món đồ (items.ts) thuộc một nhóm.

export type Category = {
  id: CategoryId
  label: string
  emoji: string
}

export const CATEGORIES: Category[] = [
  { id: 'bags', label: 'Bags', emoji: '👜' },
  { id: 'shoes', label: 'Shoes', emoji: '👟' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'jewelry', label: 'Jewelry & watches', emoji: '💍' },
  { id: 'tech', label: 'Tech', emoji: '🎧' },
  { id: 'plushies', label: 'Plushies', emoji: '🧸' },
  { id: 'flowers', label: 'Flowers', emoji: '💐' },
  { id: 'books', label: 'Books', emoji: '📚' },
  { id: 'decor', label: 'Home decor', emoji: '🕯️' },
  { id: 'souvenirs', label: 'Souvenirs', emoji: '🎁' },
]
