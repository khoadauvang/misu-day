import type { Movie } from '../game/types.ts'

// GIF phim cho Movie night, lấy từ GIPHY (developers.giphy.com).
// - Key nằm trong biến môi trường VITE_GIPHY_KEY (Vercel → Environment Variables, rồi Redeploy).
//   Không có key thì game hiện emoji như cũ, không lỗi gì.
// - GIPHY yêu cầu gọi tìm kiếm từ máy người chơi, nên app gọi thẳng từ iPhone (không qua /api).
//   Key nằm trong code chạy trên máy là bình thường; lộ ra thì cùng lắm bị dùng hết lượt gọi.
// - Key beta: 100 lần gọi mỗi giờ. Mỗi phim thường chỉ gọi 1 lần (tối đa 3 từ khóa) cho tới khi tắt app.
// - Tìm theo tên phim hay ra GIF không liên quan (tìm "Friends" ra GIF bạn bè bất kỳ), nên mỗi kết quả
//   phải nhắc đúng tên phim, và nếu tên phim là từ phổ thông thì phải nhắc thêm diễn viên (movie.stars)
//   hoặc đến từ kênh chính thức của phim. Không có GIF nào đạt thì hiện emoji, không hiện GIF sai.
// - Chỗ nào hiện GIF phải ghi "Powered by GIPHY" (điều khoản của GIPHY).

const KEY = import.meta.env.VITE_GIPHY_KEY?.trim() ?? ''
const API = 'https://api.giphy.com/v1'
/** Chờ GIPHY trả lời tối đa bao lâu */
const API_TIMEOUT_MS = 6_000
/** Mỗi lần tìm lấy bao nhiêu kết quả để lọc */
const SEARCH_LIMIT = 50
/** Đã có bấy nhiêu GIF đúng phim thì thôi, không tìm từ khóa tiếp (để tiết kiệm lượt gọi) */
const ENOUGH_GIFS = 3
/** Giữ bao nhiêu GIF đúng nhất để chọn ngẫu nhiên */
const KEEP_GIFS = 8
/** Từ không mang nghĩa riêng, không tính khi xét tên phim có đặc biệt không */
const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'of', 'in', 'on', 'at', 'to', 'it', 'up', 'i', 'me', 'my', 'you', 'is', 'be', 'about'])
/** Bản gốc nặng hơn mức này thì dùng bản nhỏ (cao 200px) cho nhẹ */
const MAX_ORIGINAL_BYTES = 2_500_000

/** Một GIF đã chọn để hiện */
export type GifPick = { id: string; url: string; width: number; height: number }

/** Đã cài key GIPHY chưa */
export function hasGiphy(): boolean {
  return KEY.length > 0
}

/** Các từ khóa tìm GIF của một phim, thử lần lượt tới khi đủ GIF đúng phim */
export function gifQueries(movie: Movie): string[] {
  const kind = movie.kind === 'series' ? 'tv show' : 'movie'
  const star = movie.stars[0]
  const queries = [movie.gif?.q, star && `${movie.title} ${star}`, `${movie.title} ${kind}`]
  return [...new Set(queries.filter((q): q is string => Boolean(q)))]
}

type Rendition = { url?: string; width?: string; height?: string; webp?: string; webp_size?: string }
type GiphyGif = {
  id: string
  title?: string
  slug?: string
  alt_text?: string
  username?: string
  user?: { username?: string; display_name?: string; is_verified?: boolean }
  images?: { original?: Rendition; fixed_height?: Rendition }
}

// --- Lọc GIF đúng phim ---

/** Chữ thường, bỏ dấu, bỏ dấu nháy, chỉ giữ chữ và số: "You've Got Mail!" → "youve got mail" */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replaceAll('&', ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** text có chứa nguyên cụm phrase (đủ từ, không tính khớp nửa từ) */
function hasPhrase(text: string, phrase: string): boolean {
  return phrase !== '' && ` ${text} `.includes(` ${phrase} `)
}

/** Tên phim đã chuẩn hóa: tên chính + tên gọi khác, có thêm bản bỏ "the"/"a" ở đầu */
function movieNames(movie: Movie): string[] {
  const names = [movie.title, ...(movie.gif?.aka ?? [])].map(normalize)
  return [...new Set(names.flatMap((name) => [name, name.replace(/^(the|a|an) /, '')]))].filter(Boolean)
}

/** Tên có từ 2 từ mang nghĩa trở lên ("mean girls") thì nhắc tới là đủ tin; "friends", "the holiday" thì chưa */
function isDistinctive(name: string): boolean {
  return name.split(' ').filter((word) => !STOP_WORDS.has(word)).length >= 2
}

/** Điểm GIF đúng phim: 0 = không chắc là phim này (bỏ), càng cao càng đúng */
function relevance(gif: GiphyGif, movie: Movie): number {
  const text = normalize([gif.title, gif.slug, gif.alt_text].join(' '))
  const channel = normalize(gif.user?.display_name ?? '')
  const handle = normalize(gif.username || gif.user?.username || '').replaceAll(' ', '')
  const names = movieNames(movie)

  // Kênh chính thức của phim (ví dụ kênh "Friends", @brooklyn99)
  const fromChannel = names.some((name) => channel === name || handle === name.replaceAll(' ', ''))
  const named = names.filter((name) => hasPhrase(text, name) || hasPhrase(channel, name))
  const starred = movie.stars.some((star) => hasPhrase(text, normalize(star)))
  const sure = fromChannel || (named.length > 0 && (starred || named.some(isDistinctive)))
  if (!sure) return 0
  return (
    (fromChannel ? 4 : 0) +
    (named.length > 0 ? 2 : 0) +
    (starred ? 2 : 0) +
    (gif.user?.is_verified ? 1 : 0) +
    (hasPhrase(text, String(movie.year)) ? 1 : 0)
  )
}

/**
 * Chọn bản để hiện: ảnh động WebP (nhẹ hơn GIF, iPhone hiện tốt).
 * Dùng <img> chứ không dùng video, vì iPhone bật Chế độ nguồn điện thấp sẽ không tự chạy video.
 */
function toPick(gif: GiphyGif): GifPick | null {
  const { original, fixed_height: small } = gif.images ?? {}
  const make = (r: Rendition | undefined, url: string | undefined) =>
    r && url && Number(r.width) > 0 && Number(r.height) > 0
      ? { id: gif.id, url, width: Number(r.width), height: Number(r.height) }
      : null
  const big = Number(original?.webp_size) <= MAX_ORIGINAL_BYTES ? make(original, original?.webp) : null
  return big ?? make(small, small?.webp) ?? make(small, small?.url)
}

/** Gọi GIPHY; null = lỗi (key sai, hết lượt, mất mạng…) */
async function request(path: string, params: Record<string, string>): Promise<GiphyGif[] | null> {
  const url = `${API}/${path}?${new URLSearchParams({ api_key: KEY, ...params })}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) return null // key sai, hết lượt gọi (429)…
    const body = (await res.json()) as { data?: GiphyGif[] }
    return body.data ?? []
  } catch {
    return null // mất mạng, quá thời gian…
  } finally {
    clearTimeout(timer)
  }
}

const toPicks = (gifs: GiphyGif[]) => gifs.map(toPick).filter((gif): gif is GifPick => gif !== null)

/** Tìm theo từng từ khóa, chỉ giữ GIF đúng phim, xếp cái đúng nhất lên trước */
async function searchMovie(movie: Movie): Promise<GifPick[]> {
  const found = new Map<string, { pick: GifPick; score: number }>()
  for (const q of gifQueries(movie)) {
    const gifs = await request('gifs/search', { q, limit: String(SEARCH_LIMIT), rating: 'pg', lang: 'en' })
    if (gifs === null) break // lỗi thì thôi, lần sau thử lại
    for (const gif of gifs) {
      if (found.has(gif.id)) continue
      const score = relevance(gif, movie)
      const pick = score > 0 ? toPick(gif) : null
      if (pick) found.set(gif.id, { pick, score })
    }
    if (found.size >= ENOUGH_GIFS) break
  }
  // sort giữ nguyên thứ tự của GIPHY khi bằng điểm
  return [...found.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, KEEP_GIFS)
    .map((f) => f.pick)
}

/** Danh sách GIF của từng phim, chỉ nhớ trong lúc mở app (tắt app là quên) */
const lists = new Map<string, Promise<GifPick[]>>()

function gifsFor(movie: Movie): Promise<GifPick[]> {
  let list = lists.get(movie.id)
  if (!list) {
    const ids = movie.gif?.ids ?? []
    // GIF tự chọn thì tin luôn, không cần lọc
    list = ids.length > 0 ? request('gifs', { ids: ids.join(',') }).then((gifs) => toPicks(gifs ?? [])) : searchMovie(movie)
    lists.set(movie.id, list)
    // Lỗi hoặc không tìm thấy: lần sau thử lại
    void list.then((found) => {
      if (found.length === 0) lists.delete(movie.id)
    })
  }
  return list
}

/** GIF hiện lần trước của mỗi phim, để lần sau đổi cái khác */
const lastShown = new Map<string, string>()

async function pickGif(movie: Movie): Promise<GifPick | null> {
  const list = await gifsFor(movie)
  if (list.length === 0) return null
  const last = lastShown.get(movie.id)
  const pool = list.length > 1 ? list.filter((gif) => gif.id !== last) : list
  const gif = pool[Math.floor(Math.random() * pool.length)]
  lastShown.set(movie.id, gif.id)
  return gif
}

/** Giữ các ảnh đang tải trước, để trình duyệt không hủy giữa chừng */
const preloading = new Set<HTMLImageElement>()

function preload(url: string) {
  const img = new Image()
  const done = () => preloading.delete(img)
  img.onload = done
  img.onerror = done
  img.src = url
  preloading.add(img)
}

/** GIF đã chọn sẵn cho từng phim, chờ Misu bấm Watch */
const ready = new Map<string, Promise<GifPick | null>>()

/** Misu vừa mở một phim: chọn GIF và tải trước, để lúc bấm Watch là có ngay */
export function prefetchMovieGif(movie: Movie) {
  if (!hasGiphy() || ready.has(movie.id)) return
  ready.set(
    movie.id,
    pickGif(movie).then((gif) => {
      if (gif) preload(gif.url)
      return gif
    }),
  )
}

/** Lấy GIF để hiện trong popup (GIF đã tải trước, hoặc bắt đầu tìm ngay). Không có key thì trả về null */
export function takeMovieGif(movie: Movie): Promise<GifPick | null> | null {
  if (!hasGiphy()) return null
  prefetchMovieGif(movie)
  const gif = ready.get(movie.id) ?? null
  ready.delete(movie.id) // lần xem sau chọn GIF khác
  return gif
}
