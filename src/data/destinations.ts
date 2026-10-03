// Các chuyến đi trong World. Bản 1.0 đều hiện "This trip opens in a future update";
// khi làm xong nội dung một nơi, đổi open thành true.

export type Region = 'Vietnam' | 'Asia' | 'Europe' | 'Americas'

export type Destination = {
  id: string
  city: string
  country: string
  flag: string
  region: Region
  unlockLevel: number
  /** Giá vé máy bay (₫) */
  flight: number
  open: boolean
}

export const REGIONS: Region[] = ['Vietnam', 'Asia', 'Europe', 'Americas']

export const DESTINATIONS: Destination[] = [
  { id: 'dalat', city: 'Đà Lạt', country: 'Vietnam', flag: '🇻🇳', region: 'Vietnam', unlockLevel: 7, flight: 3_000_000, open: false },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', flag: '🇰🇷', region: 'Asia', unlockLevel: 8, flight: 12_000_000, open: false },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', region: 'Asia', unlockLevel: 10, flight: 15_000_000, open: false },
  { id: 'paris', city: 'Paris', country: 'France', flag: '🇫🇷', region: 'Europe', unlockLevel: 14, flight: 35_000_000, open: false },
  { id: 'london', city: 'London', country: 'United Kingdom', flag: '🇬🇧', region: 'Europe', unlockLevel: 14, flight: 35_000_000, open: false },
  { id: 'milan', city: 'Milan', country: 'Italy', flag: '🇮🇹', region: 'Europe', unlockLevel: 16, flight: 38_000_000, open: false },
  { id: 'new-york', city: 'New York', country: 'United States', flag: '🇺🇸', region: 'Americas', unlockLevel: 20, flight: 45_000_000, open: false },
]
