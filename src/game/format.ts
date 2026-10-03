// Định dạng số và giờ để hiển thị

/** 4000000 → "4,000,000₫" */
export function formatMoney(n: number): string {
  return `${Math.round(n).toLocaleString('en-US')}₫`
}

/** 17 → "5 PM", 0 → "12 AM" */
export function formatHour(hour: number): string {
  const h = ((hour % 24) + 24) % 24
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12} ${h < 12 ? 'AM' : 'PM'}`
}

/** Thời điểm → "8:05 PM" */
export function formatClock(t: number): string {
  return new Date(t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

/** Khoảng thời gian → "2h 15m" hoặc "40m" */
export function formatDuration(ms: number): string {
  const minutes = Math.max(1, Math.ceil(ms / 60_000))
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}
