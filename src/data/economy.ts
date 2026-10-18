// Các con số cân bằng game. Sửa ở đây để đổi nhịp chơi.
// Giá từng món/hoạt động nằm ở `cost` trong places.ts.

/** Tiền Chằm Chằm gửi mỗi sáng */
export const DAILY_ALLOWANCE = 4_000_000

/** Ngày mới trong game bắt đầu lúc mấy giờ sáng (nhận tiền + lời nhắn) */
export const DAY_START_HOUR = 6

export const MAX_ENERGY = 100

/** Năng lượng hồi mỗi giờ, kể cả khi tắt app */
export const ENERGY_PER_HOUR = 10

/** Từ level n lên n+1 cần XP_STEP × n XP */
export const XP_STEP = 100

/** Nhật ký giữ tối đa bao nhiêu dòng (dòng cũ nhất bị xóa trước) */
export const DIARY_LIMIT = 300

/** Lên level L thì Chằm Chằm thưởng L × LEVEL_REWARD_STEP (Level 2 = 1,000,000₫, Level 5 = 2,500,000₫…) */
export const LEVEL_REWARD_STEP = 500_000

/**
 * Đi xe giữa các quận (Xanh SM Car). Giá = mở cửa + số km × giá mỗi km, làm tròn lên nghìn.
 * Số km lấy từ tọa độ quận (districts.ts) nhân roadFactor vì đường thật quanh co hơn đường chim bay.
 */
export const RIDE = {
  name: 'Xanh SM',
  emoji: '🚙',
  base: 15_000,
  perKm: 14_500,
  roadFactor: 1.35,
  /** Phút mỗi km (giờ thường ở Sài Gòn), chỉ để hiện "~15 min" */
  minutesPerKm: 3,
}

/** "Can I have a little extra? 💸": Chằm Chằm gửi thêm bao nhiêu (mỗi ngày 1 lần) */
export const EXTRA_MONEY = 1_000_000
