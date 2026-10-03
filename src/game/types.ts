// Kiểu dữ liệu của game

export type DistrictId = 'pn' | 'd1' | 'd2' | 'd3' | 'd5' | 'd7' | 'd9'

export type CategoryId =
  | 'bags'
  | 'shoes'
  | 'beauty'
  | 'jewelry'
  | 'tech'
  | 'plushies'
  | 'flowers'
  | 'books'
  | 'decor'
  | 'souvenirs'

/** Món đồ sưu tầm, hiện thành sticker trong Collection */
export type Item = {
  id: string
  name: string
  emoji: string
  category: CategoryId
}

export type OpenHours = {
  /** Giờ mở và giờ đóng (0–24). Giờ đóng nhỏ hơn giờ mở nghĩa là mở qua đêm, ví dụ [17, 2] */
  hours?: [number, number]
  /** Các ngày mở cửa: 0 = Chủ nhật, 1 = Thứ Hai … 6 = Thứ Bảy */
  days?: number[]
}

export type Activity = {
  id: string
  name: string
  emoji: string
  /** Giá (₫). 0 là miễn phí */
  cost: number
  /** Năng lượng tốn. Số âm là hồi năng lượng (chợp mắt, massage…) */
  energy: number
  xp: number
  /** id món đồ nhận được (xem items.ts) */
  item?: string
  /** Level tối thiểu, nếu cao hơn level của địa điểm */
  unlockLevel?: number
  /** Giờ mở cửa riêng của hoạt động; không có thì theo địa điểm */
  open?: OpenHours
  /** Mỗi ngày chỉ làm được 1 lần */
  oncePerDay?: boolean
  /** Phải có ít nhất một món thuộc nhóm này, ví dụ đọc sách thì phải có sách */
  requires?: { category: CategoryId; hint: string }
  /** Tính năng chưa làm xong, hiện "Coming soon" */
  comingSoon?: boolean
  /** Câu ghi vào nhật ký, chọn ngẫu nhiên một câu */
  diary: string[]
}

export type Place = {
  id: string
  name: string
  emoji: string
  district: DistrictId
  tagline: string
  unlockLevel: number
  open?: OpenHours
  /** Quán ruột của Misu, hiện ngôi sao ⭐ */
  favorite?: boolean
  activities: Activity[]
}

/** Kết quả sau khi làm một hoạt động, hiện trong popup */
export type ActivityResult = {
  placeName: string
  activity: Activity
  text: string
  /** Tiền thay đổi (âm là tiêu) */
  money: number
  /** Năng lượng thay đổi (âm là tốn) */
  energy: number
  xp: number
  item?: Item
  itemCount?: number
  levelBefore: number
  levelAfter: number
}

/** Một dòng trong nhật ký của Misu */
export type DiaryEntry = {
  id: string
  /** Thời điểm (mili giây) */
  at: number
  emoji: string
  text: string
  /** Tiền thay đổi: dương là nhận, âm là tiêu */
  money?: number
  energy?: number
  xp?: number
}

/** Tiền Chằm Chằm đã gửi, đang chờ Misu bấm Collect */
export type PendingAllowance = {
  days: number
  amount: number
  /** Ngày gửi gần nhất, dùng để chọn lời nhắn */
  day: string
}

/** Toàn bộ dữ liệu được lưu trên điện thoại */
export type SaveData = {
  startedAt: number
  money: number
  /** Năng lượng tại thời điểm energyAt (có thể lẻ, hiển thị thì làm tròn xuống) */
  energy: number
  energyAt: number
  xp: number
  /** Ngày gần nhất Chằm Chằm đã gửi tiền (mã ngày dạng 2026-10-09) */
  lastAllowanceDay: string | null
  pendingAllowance: PendingAllowance | null
  diary: DiaryEntry[]
  /** Đồ đã có: id món đồ → số lượng */
  collection: Record<string, number>
  /** Hoạt động chỉ làm được 1 lần/ngày: mã hoạt động → ngày làm gần nhất */
  doneToday: Record<string, string>
  stats: { activities: number; spent: number }
}
