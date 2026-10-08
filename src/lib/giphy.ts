import type { Movie } from '../game/types.ts'

// GIF phim cho Movie night, lấy từ GIPHY (developers.giphy.com).
// - Key nằm trong biến môi trường VITE_GIPHY_KEY (Vercel → Environment Variables, rồi Redeploy).
//   Không có key thì game hiện emoji như cũ, không lỗi gì.
// - GIPHY yêu cầu gọi tìm kiếm từ máy người chơi, nên app gọi thẳng từ iPhone (không qua /api).
//   Key nằm trong code chạy trên máy là bình thường; lộ ra thì cùng lắm bị dùng hết lượt gọi.
// - Key beta: 100 lần gọi mỗi giờ. Mỗi phim chỉ gọi 1 lần cho tới khi tắt app.
// - Chỗ nào hiện GIF phải ghi "Powered by GIPHY" (điều khoản của GIPHY).

const KEY = import.meta.env.VITE_GIPHY_KEY?.trim() ?? ''
const API = 'https://api.giphy.com/v1'
/** Chờ GIPHY trả lời tối đa bao lâu */
const API_TIMEOUT_MS = 6_000
/** Lấy bao nhiêu kết quả đầu khi tìm kiếm, rồi chọn ngẫu nhiên một cái */
const SEARCH_LIMIT = 8
/** Bản gốc nặng hơn mức này thì dùng bản nhỏ (cao 200px) cho nhẹ */
const MAX_ORIGINAL_BYTES = 2_500_000

/** Một GIF đã chọn để hiện */
export type GifPick = { id: string; url: string; width: number; height: number }

/** Đã cài key GIPHY chưa */
export function hasGiphy(): boolean {
  return KEY.length > 0
}

/** Từ khóa tìm GIF của một phim */
export function gifQuery(movie: Movie): string {
  return movie.gif?.q ?? `${movie.title} ${movie.kind === 'series' ? 'tv show' : 'movie'}`
}

type Rendition = { url?: string; width?: string; height?: string; webp?: string; webp_size?: string }
type GiphyGif = { id: string; images?: { original?: Rendition; fixed_height?: Rendition } }

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

async function request(path: string, params: Record<string, string>): Promise<GifPick[]> {
  const url = `${API}/${path}?${new URLSearchParams({ api_key: KEY, ...params })}`
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)
  try {
    const res = await fetch(url, { signal: controller.signal })
    if (!res.ok) return [] // key sai, hết lượt gọi (429)…
    const body = (await res.json()) as { data?: GiphyGif[] }
    return (body.data ?? []).map(toPick).filter((gif): gif is GifPick => gif !== null)
  } catch {
    return [] // mất mạng, quá thời gian…
  } finally {
    clearTimeout(timer)
  }
}

/** Danh sách GIF của từng phim, chỉ nhớ trong lúc mở app (tắt app là quên) */
const lists = new Map<string, Promise<GifPick[]>>()

function gifsFor(movie: Movie): Promise<GifPick[]> {
  const ids = movie.gif?.ids ?? []
  const key = ids.length > 0 ? `ids:${ids.join(',')}` : `q:${gifQuery(movie)}`
  let list = lists.get(key)
  if (!list) {
    list =
      ids.length > 0
        ? request('gifs', { ids: ids.join(',') })
        : request('gifs/search', { q: gifQuery(movie), limit: String(SEARCH_LIMIT), rating: 'pg', lang: 'en' })
    lists.set(key, list)
    // Lỗi hoặc không tìm thấy: lần sau thử lại
    void list.then((found) => {
      if (found.length === 0) lists.delete(key)
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
