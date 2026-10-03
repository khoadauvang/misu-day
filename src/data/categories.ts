// Các nhóm đồ trong Collection. Module 5 sẽ gắn từng món đồ vào một nhóm.

export type Category = {
  id: string
  label: string
  emoji: string
}

export const CATEGORIES: Category[] = [
  { id: 'bags', label: 'Bags', emoji: '👜' },
  { id: 'shoes', label: 'Shoes', emoji: '👟' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'jewelry', label: 'Jewelry', emoji: '💍' },
  { id: 'tech', label: 'Tech', emoji: '🎧' },
  { id: 'plushies', label: 'Plushies', emoji: '🧸' },
  { id: 'flowers', label: 'Flowers', emoji: '💐' },
  { id: 'books', label: 'Books', emoji: '📚' },
  { id: 'decor', label: 'Home decor', emoji: '🕯️' },
]
