// Love Coupons (Module 10): phiếu quà đổi được thành việc thật ngoài đời.
// Mỗi lần Misu lên level, game tặng ngẫu nhiên 1 phiếu chưa có.
// Thêm phiếu mới: thêm một dòng vào cuối danh sách (id không được trùng, đừng đổi id phiếu cũ
// vì save của Misu lưu theo id). Viết bằng tiếng Anh.

export type Coupon = {
  id: string
  emoji: string
  title: string
}

export const COUPONS: Coupon[] = [
  { id: 'gmi-delivery', emoji: '🧋', title: 'A GMI mint milk tea, delivered by Chằm Chằm' },
  { id: 'dairy-queen', emoji: '🍦', title: 'A Dairy Queen run, any time' },
  { id: 'sushi-date', emoji: '🍣', title: 'Sushi date — Chằm Chằm’s treat' },
  { id: 'movie-night', emoji: '🎬', title: 'Movie night — you pick, no complaints' },
  { id: 'bouquet', emoji: '💐', title: 'A bouquet of your favorite flowers' },
  { id: 'massage', emoji: '💆', title: 'A 20-minute shoulder massage' },
  { id: 'shopping-buddy', emoji: '🛍️', title: 'Shopping buddy — Chằm Chằm carries every bag' },
  { id: 'dishes-week', emoji: '🍽️', title: 'Chằm Chằm does the dishes for a week' },
  { id: 'gym-date', emoji: '🏋️', title: 'Gym date together' },
]

export const COUPON_BY_ID: Record<string, Coupon> = Object.fromEntries(COUPONS.map((c) => [c.id, c]))
