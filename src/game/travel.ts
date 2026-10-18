import { DISTRICT_BY_ID } from '../data/districts.ts'
import { RIDE } from '../data/economy.ts'
import type { DistrictId } from './types.ts'

// Đi xe Xanh SM giữa các quận: quãng đường, giá, thời gian. Hàm thuần, không lưu gì.

const EARTH_KM = 6371

/** Quãng đường đi xe (km, 1 số lẻ) giữa tâm hai quận */
export function rideKm(from: DistrictId, to: DistrictId): number {
  if (from === to) return 0
  const a = DISTRICT_BY_ID[from].geo
  const b = DISTRICT_BY_ID[to].geo
  const rad = (deg: number) => (deg * Math.PI) / 180
  // Công thức haversine: khoảng cách đường chim bay trên mặt cầu
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2
  const straight = 2 * EARTH_KM * Math.asin(Math.sqrt(h))
  return Math.round(straight * RIDE.roadFactor * 10) / 10
}

/** Giá cuốc xe (₫), làm tròn lên nghìn. Cùng quận thì 0 */
export function rideFare(from: DistrictId, to: DistrictId): number {
  if (from === to) return 0
  return Math.ceil((RIDE.base + rideKm(from, to) * RIDE.perKm) / 1000) * 1000
}

/** Thời gian đi xe ước chừng (phút, tròn 5) */
export function rideMinutes(from: DistrictId, to: DistrictId): number {
  return Math.max(5, Math.round((rideKm(from, to) * RIDE.minutesPerKm) / 5) * 5)
}
