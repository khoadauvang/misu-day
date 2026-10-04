import { BAND_PRACTICE, HUSBAND_STATUS, OFFICE_TASKS, WORKDAY, type HusbandStatusId } from '../data/husband.ts'
import { daysBetween } from './clock.ts'

// Module 8: giờ này Chằm Chằm đang làm gì.
// Hàm thuần: chỉ cần thời điểm t, không lưu gì cả. Cùng một giờ thì luôn ra cùng một kết quả.

export type HusbandStatus = {
  id: HusbandStatusId
  emoji: string
  label: string
  /** Chi tiết thêm, ví dụ việc đang làm ở công ty */
  detail?: string
  /** Thời điểm trạng thái này kết thúc (mili giây) */
  until: number
}

/** Ngày dương lịch của t, dạng 2026-10-05 (khác gameDayKey: ở đây ngày mới bắt đầu lúc nửa đêm) */
function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Thời điểm "hour giờ" (8.5 = 8:30) của ngày chứa t, cộng thêm addDays ngày */
function atHour(t: number, hour: number, addDays = 0): number {
  const d = new Date(t)
  d.setDate(d.getDate() + addDays)
  d.setHours(Math.floor(hour), Math.round((hour % 1) * 60), 0, 0)
  return d.getTime()
}

/** Trộn số để chọn "ngẫu nhiên nhưng cố định" (cùng đầu vào thì cùng kết quả) */
function hash(n: number): number {
  let x = (n + 0x9e3779b9) | 0
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b)
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35)
  return (x ^ (x >>> 16)) >>> 0
}

/**
 * Hôm nay (ngày của t) có tập band không.
 * Tuần có tập band: cách 1 tuần tính từ BAND_PRACTICE.firstWeek. Trong tuần đó chọn thứ Bảy hoặc Chủ nhật.
 */
export function isBandDay(t: number): boolean {
  const d = new Date(t)
  const day = d.getDay()
  if (day !== 6 && day !== 0) return false
  // Thứ Hai đầu tuần của ngày này (tuần tính từ thứ Hai tới Chủ nhật)
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((day + 6) % 7))
  const week = Math.round(daysBetween(BAND_PRACTICE.firstWeek, dateKey(monday)) / 7)
  if (((week % 2) + 2) % 2 !== 0) return false
  const bandDay = hash(week) % 2 === 0 ? 6 : 0
  return day === bandDay
}

function status(id: HusbandStatusId, until: number, detail?: string): HusbandStatus {
  return { id, ...HUSBAND_STATUS[id], detail, until }
}

/** Trạng thái của Chằm Chằm lúc t */
export function husbandStatus(t: number): HusbandStatus {
  const d = new Date(t)
  const h = d.getHours() + d.getMinutes() / 60
  const day = d.getDay()
  const weekend = day === 6 || day === 0
  const W = WORKDAY

  // Ngủ từ 23:00 tới 6:00 sáng hôm sau, ngày nào cũng vậy
  if (h >= W.bedtime) return status('sleeping', atHour(t, W.wake, 1))
  if (h < W.wake) return status('sleeping', atHour(t, W.wake))

  if (weekend) {
    if (isBandDay(t)) {
      if (h < BAND_PRACTICE.from) return status('weekend', atHour(t, BAND_PRACTICE.from))
      if (h < BAND_PRACTICE.to) return status('band', atHour(t, BAND_PRACTICE.to))
    }
    return status('weekend', atHour(t, W.bedtime))
  }

  if (h < W.leaveHome) return status('getting-ready', atHour(t, W.leaveHome))
  if (h < W.officeStart) return status('driving-to-work', atHour(t, W.officeStart))
  if (h >= W.lunchStart && h < W.lunchEnd) return status('lunch', atHour(t, W.lunchEnd))
  if (h < W.officeEnd) {
    // Mỗi giờ một việc, và mỗi ngày bắt đầu từ một việc khác
    const dayIndex = daysBetween('2026-01-01', dateKey(d))
    const task = OFFICE_TASKS[(hash(dayIndex) + Math.floor(h)) % OFFICE_TASKS.length]
    const nextHour = Math.floor(h) + 1
    const end = h < W.lunchStart ? Math.min(nextHour, W.lunchStart) : Math.min(nextHour, W.officeEnd)
    return status('office', atHour(t, end), task)
  }
  if (h < W.arriveHome) return status('driving-home', atHour(t, W.arriveHome))
  return status('home', atHour(t, W.bedtime))
}

/** Chằm Chằm có đang ở bên Misu không (ở nhà, cuối tuần) */
export function isWithMisu(s: HusbandStatus): boolean {
  return s.id === 'home' || s.id === 'weekend'
}
