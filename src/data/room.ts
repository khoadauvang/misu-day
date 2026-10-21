// Căn phòng của Misu (tab Home): đồ đạc chạm được và việc làm ở mỗi món.
// Bố cục phòng đang là bản demo; hình vẽ ở src/screens/room/.

export type RoomSpotId = 'bed' | 'computer' | 'shelf' | 'mat'

export type RoomSpot = {
  id: RoomSpotId
  name: string
  emoji: string
  /** Một câu ngắn hiện trong thẻ khi chạm vào món đồ */
  line: string
  /** id hoạt động trong HOME_ACTIVITIES (places.ts); 'movie' = Movie night */
  activity: string
}

export const ROOM_SPOTS: RoomSpot[] = [
  { id: 'computer', name: 'Computer', emoji: '💻', line: 'Movie night, right from your desk.', activity: 'movie' },
  { id: 'bed', name: 'Cozy bed', emoji: '🛏️', line: 'Fluffy pillows, pink blanket. Nap time?', activity: 'nap' },
  { id: 'shelf', name: 'Bookshelf', emoji: '📚', line: 'Every book you buy lands here.', activity: 'read-book' },
  { id: 'mat', name: 'Yoga mat', emoji: '🧘‍♀️', line: 'A little stretch, a lot of glow.', activity: 'home-workout' },
]

export const ROOM_SPOT_BY_ID = Object.fromEntries(ROOM_SPOTS.map((s) => [s.id, s])) as Record<RoomSpotId, RoomSpot>

/** Misu nói khi được chạm (chọn ngẫu nhiên) */
export const ROOM_MISU_LINES = ['Home sweet home 💗', 'So cozy in here!', 'Hmm, what should I do?', 'Missing Chằm Chằm 🥺']

/** Bồ câu đưa thư bay ngang phòng thỉnh thoảng; chạm vào thì hiện câu này */
export const ROOM_PIGEON_NOTES = [
  'A hug from Chằm Chằm 🤗',
  'Chằm Chằm says: drink some water 💧',
  'Chằm Chằm misses you 💗',
  'A tiny kiss, special delivery 😘',
]
