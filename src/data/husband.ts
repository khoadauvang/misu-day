// Lịch sinh hoạt của Chằm Chằm (Module 8). Sửa chữ, emoji, giờ giấc ở đây.
// Logic tính "giờ này Chằm Chằm đang làm gì" nằm ở src/game/husband.ts.

export type HusbandStatusId =
  | 'getting-ready'
  | 'driving-to-work'
  | 'office'
  | 'lunch'
  | 'driving-home'
  | 'home'
  | 'weekend'
  | 'band'
  | 'sleeping'

export type HusbandStatusInfo = {
  emoji: string
  /** Câu ngắn hiện trên Home, ví dụ "At the office" */
  label: string
}

export const HUSBAND_STATUS: Record<HusbandStatusId, HusbandStatusInfo> = {
  'getting-ready': { emoji: '☕', label: 'Getting ready for work' },
  'driving-to-work': { emoji: '🚗', label: 'Driving to the office' },
  office: { emoji: '💼', label: 'At the office' },
  lunch: { emoji: '🍱', label: 'On lunch break' },
  'driving-home': { emoji: '🚗', label: 'Driving home' },
  home: { emoji: '🏠', label: 'Home with you' },
  weekend: { emoji: '💗', label: 'Weekend with you' },
  band: { emoji: '🥁', label: 'At band practice' },
  sleeping: { emoji: '😴', label: 'Sleeping' },
}

/**
 * Lúc ở công ty, mỗi giờ Chằm Chằm làm một việc khác nhau (xoay vòng theo thứ tự).
 * Thêm việc mới vào cuối danh sách.
 */
export const OFFICE_TASKS: string[] = [
  'Leading a board meeting',
  'Closing a big deal',
  'Signing a pile of contracts',
  'Interviewing a new manager',
  'Reviewing the quarterly numbers',
  'On a call with investors',
  'Pitching to a new client',
  'Planning next year with the team',
]

/** Giờ giấc ngày thường (giờ dạng số thập phân: 8.5 = 8:30) */
export const WORKDAY = {
  wake: 6,
  leaveHome: 8.5,
  officeStart: 9,
  lunchStart: 12,
  lunchEnd: 13,
  officeEnd: 17,
  arriveHome: 17.75,
  bedtime: 23,
}

/** Tập band: cách 1 tuần, thứ Bảy hoặc Chủ nhật (chọn ngẫu nhiên nhưng cố định trong tuần đó) */
export const BAND_PRACTICE = {
  /** Một ngày thứ Hai bất kỳ trong tuần có tập band, các tuần khác tính cách 2 tuần từ đây */
  firstWeek: '2026-10-05',
  from: 14,
  to: 18,
}
