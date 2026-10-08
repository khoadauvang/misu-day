import { MOVIE_DIARY, MOVIE_NIGHT, MOVIES } from '../data/movies.ts'
import type { Activity, Movie, MovieKind, SaveData } from './types.ts'

// Movie night: luật nhỏ cho việc xem phim ở nhà. Nội dung phim nằm trong src/data/movies.ts.

/** Misu đã xem phim này mấy lần */
export function timesWatched(save: SaveData, movieId: string): number {
  return save.movies[movieId] ?? 0
}

/** Đã xem bao nhiêu phim khác nhau (trên tổng số phim) */
export function moviesWatched(save: SaveData): { watched: number; total: number } {
  const watched = MOVIES.filter((movie) => timesWatched(save, movie.id) > 0).length
  return { watched, total: MOVIES.length }
}

function fill(line: string, movie: Movie): string {
  return line.replaceAll('{title}', movie.title).replaceAll('{year}', String(movie.year))
}

/**
 * Xem một phim là một hoạt động ở nhà: miễn phí, tốn năng lượng, cộng XP.
 * Lần đầu xem phim nào thì thưởng thêm XP, để Misu có lý do thử phim mới.
 */
export function movieActivity(movie: Movie, firstTime: boolean): Activity {
  const series = movie.kind === 'series'
  const lines = series
    ? firstTime
      ? MOVIE_DIARY.series
      : MOVIE_DIARY.seriesAgain
    : firstTime
      ? MOVIE_DIARY.movie
      : MOVIE_DIARY.movieAgain
  return {
    id: `movie-${movie.id}`,
    name: movie.title,
    emoji: series ? '📺' : MOVIE_NIGHT.emoji,
    cost: 0,
    energy: MOVIE_NIGHT.energy,
    xp: MOVIE_NIGHT.xp[movie.kind] + (firstTime ? MOVIE_NIGHT.firstWatchXp : 0),
    diary: lines.map((line) => fill(line, movie)),
  }
}

/** Danh sách theo nhóm lọc: phim ⭐ trước, rồi phim chưa xem, phim đã xem xuống cuối (giữ thứ tự trong data) */
export function moviesFor(save: SaveData, kind: MovieKind | 'all'): Movie[] {
  const rank = (movie: Movie) => (movie.fav ? 0 : timesWatched(save, movie.id) === 0 ? 1 : 2)
  return MOVIES.filter((movie) => kind === 'all' || movie.kind === kind).sort((a, b) => rank(a) - rank(b))
}

/** "Surprise me 🎲": chọn ngẫu nhiên một phim chưa xem; xem hết rồi thì chọn trong cả danh sách */
export function surpriseMovie(save: SaveData, list: Movie[], random: () => number = Math.random): Movie | undefined {
  const unwatched = list.filter((movie) => timesWatched(save, movie.id) === 0)
  const pool = unwatched.length > 0 ? unwatched : list
  return pool[Math.floor(random() * pool.length)]
}
