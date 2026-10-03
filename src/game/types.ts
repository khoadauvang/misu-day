// Kiểu dữ liệu của game

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
