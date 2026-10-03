// Các con số cân bằng game. Sửa ở đây để đổi nhịp chơi.

/** Giá tạm cho mọi sản phẩm/dịch vụ. Muốn sửa giá từng món thì sửa trong places.ts */
export const PRICE = 500_000

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
