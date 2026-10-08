import { useState } from 'react'
import { Chip } from '../../components/Chip.tsx'
import { Sheet } from '../../components/Sheet.tsx'
import { Sticker } from '../../components/Sticker.tsx'
import { COUNTRY_FLAG, KIND_NAME, MOVIE_BY_ID, MOVIE_KINDS, MOVIE_NIGHT } from '../../data/movies.ts'
import { runMovie } from '../../game/actions.ts'
import { movieActivity, moviesFor, moviesWatched, surpriseMovie, timesWatched } from '../../game/movies.ts'
import { checkActivity } from '../../game/rules.ts'
import type { Movie, MovieKind, SaveData } from '../../game/types.ts'
import { prefetchMovieGif } from '../../lib/giphy.ts'

// Movie night ở tab Home: chạm ô → danh sách phim (lọc theo loại) → chạm phim → Watch → popup kèm GIF.

type Filter = MovieKind | 'all'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  ...MOVIE_KINDS.map((k) => ({ id: k.kind, label: `${k.emoji} ${k.label}` })),
]

/** "2003 · 🇺🇸 · Rom-com" */
function movieMeta(movie: Movie): string {
  return `${movie.year} · ${COUNTRY_FLAG[movie.from]} · ${KIND_NAME[movie.kind]}`
}

type ListProps = { save: SaveData; filter: Filter; onFilter: (f: Filter) => void; onPick: (movie: Movie) => void }

function MovieList({ save, filter, onFilter, onPick }: ListProps) {
  const list = moviesFor(save, filter)
  const { watched, total } = moviesWatched(save)

  return (
    <>
      <header className="pr-12">
        <h2 id="movie-title" className="font-display text-[26px] leading-none font-bold">
          {MOVIE_NIGHT.name} {MOVIE_NIGHT.emoji}
        </h2>
        <p className="mt-1.5 text-[14px] font-semibold text-plum-soft">
          {watched} of {total} watched · Free, −{MOVIE_NIGHT.energy} ⚡ each
        </p>
      </header>

      {/* Hàng lọc + Surprise me dính trên đầu khi cuộn danh sách; hàng lọc chừa chỗ cho nút × của sheet */}
      <div className="sticky -top-1 z-[5] -mx-5 mt-3 bg-paper px-5 pt-1 pb-2.5">
        <div role="group" aria-label="Filter" className="no-scrollbar -ml-5 mr-10 flex gap-2 overflow-x-auto pr-2 pl-5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => onFilter(f.id)}
              className={`press shrink-0 rounded-full px-3 py-2 text-[14px] font-extrabold whitespace-nowrap ring-1 ${
                filter === f.id ? 'bg-peony ring-peony' : 'bg-white ring-petal'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            const movie = surpriseMovie(save, list)
            if (movie) onPick(movie)
          }}
          className="press mt-2.5 w-full rounded-full bg-butter py-2.5 text-[15px] font-extrabold"
        >
          🎲 Surprise me
        </button>
      </div>

      <ul className="mt-1 space-y-2">
        {list.map((movie) => {
          const times = timesWatched(save, movie.id)
          return (
            <li key={movie.id}>
              <button
                type="button"
                onClick={() => onPick(movie)}
                className="press flex w-full items-center gap-3 rounded-[22px] bg-white px-3.5 py-3 text-left ring-1 ring-petal"
              >
                <Sticker emoji={movie.emoji} className="w-9 shrink-0 text-center text-[28px]" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[17px] leading-tight font-bold">
                    {movie.title}
                    {movie.fav && <span aria-label="Misu's favorite"> ⭐</span>}
                  </p>
                  <p className="mt-0.5 text-[13px] font-semibold text-plum-soft">{movieMeta(movie)}</p>
                </div>
                {times > 0 ? (
                  <Chip className="bg-mint">✓ ×{times}</Chip>
                ) : (
                  <span aria-hidden className="text-[24px] leading-none text-plum-soft">
                    ›
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

type ViewProps = { movie: Movie; save: SaveData; now: number; onBack: () => void; onWatch: () => void }

function MovieView({ movie, save, now, onBack, onWatch }: ViewProps) {
  const times = timesWatched(save, movie.id)
  const activity = movieActivity(movie, times === 0)
  const check = checkActivity(save, null, activity, now)

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="press -ml-1 flex items-center gap-1 rounded-full py-1.5 pr-3 pl-1 text-[15px] font-extrabold text-plum-soft"
      >
        <span aria-hidden className="text-[22px] leading-none">
          ‹
        </span>
        All movies
      </button>

      <div className="mt-2 text-center">
        <Sticker emoji={movie.emoji} className="text-[60px]" />
        <h2 id="movie-title" className="mt-3 font-display text-[26px] leading-[1.08] font-bold text-balance">
          {movie.title}
        </h2>
        <p className="mt-1 text-[14px] font-bold text-plum-soft">
          {movieMeta(movie)}
          {movie.fav && ' · ⭐ Your favorite'}
        </p>
        <p className="mt-3 text-[17px] leading-relaxed text-pretty">{movie.line}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          <Chip className="bg-mint">Free</Chip>
          <Chip className="bg-hydrangea/60">−{activity.energy} ⚡</Chip>
          <Chip className="bg-lavender/70">+{activity.xp} XP</Chip>
          {times === 0 && <Chip className="bg-butter">✨ First watch bonus</Chip>}
        </div>
        {times > 0 && (
          <p className="mt-3 text-[14px] font-bold text-plum-soft">
            Watched {times === 1 ? 'once' : `${times} times`} 💗
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={!check.ok}
        onClick={onWatch}
        className="press mt-5 w-full rounded-full bg-peony py-3.5 text-[17px] font-extrabold disabled:bg-petal disabled:text-plum-soft"
      >
        Watch 🎬
      </button>
      {!check.ok && (
        <p className="mt-2.5 text-center text-[14px] font-bold text-plum-soft">
          {check.icon} {check.reason}
        </p>
      )}
    </>
  )
}

/** Ô Movie night trong lưới "At home" + sheet chọn phim */
export function MovieNightTile({ save, now }: { save: SaveData; now: number }) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [movieId, setMovieId] = useState<string | null>(null)
  const movie = movieId ? MOVIE_BY_ID[movieId] : undefined
  const { watched, total } = moviesWatched(save)

  const close = () => {
    setOpen(false)
    setMovieId(null)
  }
  const pick = (next: Movie) => {
    prefetchMovieGif(next) // tải trước GIF trong lúc Misu đọc giới thiệu phim
    setMovieId(next.id)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="press flex flex-col items-start rounded-[24px] bg-white p-3.5 text-left ring-1 ring-petal"
      >
        <Sticker emoji={MOVIE_NIGHT.emoji} className="text-[28px]" />
        <span className="mt-2 font-display text-[16px] leading-tight font-bold">{MOVIE_NIGHT.name}</span>
        <span className="mt-1 text-[12px] font-bold text-plum-soft">
          {watched}/{total} watched
        </span>
      </button>

      <Sheet open={open} onClose={close} labelledBy="movie-title">
        {movie ? (
          <MovieView
            movie={movie}
            save={save}
            now={now}
            onBack={() => setMovieId(null)}
            onWatch={() => {
              close()
              runMovie(movie)
            }}
          />
        ) : (
          <MovieList save={save} filter={filter} onFilter={setFilter} onPick={pick} />
        )}
      </Sheet>
    </>
  )
}
