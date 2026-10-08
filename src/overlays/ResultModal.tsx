import { Chip } from '../components/Chip.tsx'
import { GoldenPup } from '../components/GoldenPup.tsx'
import { Modal } from '../components/Modal.tsx'
import { MovieGifFrame } from '../components/MovieGif.tsx'
import { Sticker } from '../components/Sticker.tsx'
import { HUSBAND_NAME } from '../config.ts'
import { COUPON_BY_ID } from '../data/coupons.ts'
import { DISTRICT_BY_ID } from '../data/districts.ts'
import { MOVIE_BY_ID } from '../data/movies.ts'
import { PET_FOOD_BY_ID, PET_STARTER_PANTRY } from '../data/pet.ts'
import { formatMoney } from '../game/format.ts'
import { moviesWatched } from '../game/movies.ts'
import { useGame } from '../game/store.ts'
import type { ActivityResult, PetChange } from '../game/types.ts'
import { useUi } from '../game/ui.ts'

/** Phần của cún trong popup: đồ ăn vừa mua, độ no / độ vui tăng thêm */
function PetBox({ pet }: { pet: PetChange }) {
  const pantry = useGame((s) => s.save.pantry)
  const bought = pet.bought ? PET_FOOD_BY_ID[pet.bought.food] : undefined
  const starter = Object.entries(PET_STARTER_PANTRY)
    .map(([id, n]) => `${n} ${PET_FOOD_BY_ID[id]?.name.toLowerCase() ?? id}`)
    .join(' + ')
  return (
    <div className="mt-4 rounded-[20px] bg-white px-4 py-3 text-[14px] leading-snug font-bold ring-1 ring-petal">
      {pet.adopted && <p>Starter pack in your pantry: {starter} 🎁</p>}
      {bought && pet.bought && (
        <p>
          {bought.emoji} {bought.name} ×{pet.bought.servings} added · {pantry[bought.id] ?? 0} in the pantry
        </p>
      )}
      {!pet.adopted && !bought && (
        <p>
          {pet.name}: {pet.fullnessGain > 0 ? `+${pet.fullnessGain} 🍖 ` : ''}
          {pet.happinessGain > 0 ? `+${pet.happinessGain} 💛` : 'feeling great 💛'}
        </p>
      )}
    </div>
  )
}

/** Movie night: thưởng xem lần đầu, hoặc đã xem mấy lần */
function MovieBox({ count, bonusXp }: { count: number; bonusXp: number }) {
  const { watched, total } = moviesWatched(useGame((s) => s.save))
  return (
    <div className="mt-4 rounded-[20px] bg-white px-4 py-3 text-[14px] leading-snug font-bold ring-1 ring-petal">
      {bonusXp > 0 ? <p>✨ First watch: +{bonusXp} bonus XP</p> : <p>Watched {count} times 💗</p>}
      <p className="mt-0.5 text-plum-soft">
        🎬 {watched} of {total} movies & shows watched
      </p>
    </div>
  )
}

/** Module 6: lên level → thưởng của Chằm Chằm + những nơi vừa mở khóa */
function LevelUpBox({ result }: { result: ActivityResult }) {
  const { unlocked } = result
  const coupons = (result.newCoupons ?? []).map((id) => COUPON_BY_ID[id]).filter(Boolean)
  const rows = [
    ...(unlocked?.places ?? []).map((p) => ({
      key: `p-${p.id}`,
      emoji: p.emoji,
      name: p.name,
      note: DISTRICT_BY_ID[p.district].name,
    })),
    ...(unlocked?.activities ?? []).map(({ place, activity }) => ({
      key: `a-${place.id}-${activity.id}`,
      emoji: activity.emoji,
      name: activity.name,
      note: place.name,
    })),
    ...(unlocked?.destinations ?? []).map((d) => ({
      key: `d-${d.id}`,
      emoji: d.flag,
      name: `Trip to ${d.city}`,
      note: d.open ? 'World map' : 'Coming in a future update',
    })),
  ]

  return (
    <div className="mt-3 rounded-[24px] bg-lavender/60 px-4 py-4">
      <p className="font-display text-[20px] leading-tight font-bold text-balance">Level up! You're now Level {result.levelAfter} 🎉</p>
      {result.levelReward > 0 && (
        <p className="mt-2 text-[15px] leading-snug">
          {HUSBAND_NAME} sent you <span className="font-extrabold">{formatMoney(result.levelReward)}</span> to celebrate 💸
        </p>
      )}
      {coupons.map((coupon) => (
        <div key={coupon.id} className="mt-3 rounded-[20px] border-2 border-dashed border-peony bg-butter/80 px-3 py-2.5">
          <p className="text-[12px] font-extrabold text-plum-soft">New Love Coupon 🎟️ · in your Collection</p>
          <p className="mt-0.5 text-[15px] leading-snug font-extrabold">
            {coupon.emoji} {coupon.title}
          </p>
        </div>
      ))}
      {rows.length > 0 && (
        <>
          <p className="mt-3.5 text-[13px] font-extrabold text-plum-soft">Now open</p>
          <ul className="mt-1.5 space-y-1.5 text-left">
            {rows.map((row) => (
              <li key={row.key} className="flex items-center gap-2.5 rounded-[18px] bg-paper/80 px-3 py-2">
                <Sticker emoji={row.emoji} className="text-[22px]" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] leading-tight font-extrabold">{row.name}</p>
                  <p className="text-[12px] font-bold text-plum-soft">{row.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

/** Popup sau khi làm một hoạt động: nhật ký, tiền, năng lượng, XP, sticker mới */
export function ResultModal() {
  const result = useUi((s) => s.result)
  const resultGif = useUi((s) => s.resultGif)
  const close = useUi((s) => s.closeResult)
  const setTab = useUi((s) => s.setTab)
  if (!result) return null

  const { activity, item, itemCount } = result
  const levelUp = result.levelAfter > result.levelBefore
  const adopted = result.pet?.adopted ? result.pet : undefined
  const movie = result.movie ? MOVIE_BY_ID[result.movie.id] : undefined

  return (
    <Modal labelledBy="result-title" onClose={close}>
      {adopted ? (
        <GoldenPup mood="happy" className="mx-auto block h-36 w-36 animate-hop" />
      ) : movie && resultGif ? (
        <MovieGifFrame movie={movie} gif={resultGif} className="mt-1" />
      ) : (
        <Sticker emoji={movie?.emoji ?? item?.emoji ?? activity.emoji} className="text-[64px]" />
      )}
      <p className="mt-3 text-[14px] font-bold text-plum-soft">{result.placeName}</p>
      <h2 id="result-title" className="font-display text-[26px] leading-tight font-bold text-balance">
        {adopted ? `Welcome home, ${adopted.name}!` : activity.name}
      </h2>
      <p className="mt-2.5 text-[16px] leading-relaxed text-pretty">{movie ? movie.line : result.text}</p>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {result.money < 0 && <Chip className="bg-butter">−{formatMoney(-result.money)}</Chip>}
        {result.energy !== 0 && (
          <Chip className="bg-hydrangea/60">
            {result.energy > 0 ? '+' : '−'}
            {Math.abs(result.energy)} ⚡
          </Chip>
        )}
        {result.xp > 0 && <Chip className="bg-lavender/70">+{result.xp} XP</Chip>}
      </div>

      {item && (
        <p className="mt-4 rounded-[20px] bg-white px-4 py-3 text-[14px] font-bold ring-1 ring-petal">
          {itemCount && itemCount > 1
            ? `Another ${item.name} sticker (×${itemCount})`
            : `New sticker: ${item.name}`}
        </p>
      )}
      {result.pet && <PetBox pet={result.pet} />}
      {result.movie && <MovieBox count={result.movie.count} bonusXp={result.movie.bonusXp} />}
      {levelUp && <LevelUpBox result={result} />}

      <button
        type="button"
        onClick={() => {
          close()
          if (adopted) setTab('home') // vừa nhận nuôi: về nhà gặp cún
        }}
        className="press mt-6 w-full rounded-full bg-peony py-3.5 text-[17px] font-extrabold"
      >
        {adopted ? `Go home with ${adopted.name} 🏠` : movie ? 'Loved it 🍿' : 'Nice!'}
      </button>
    </Modal>
  )
}
