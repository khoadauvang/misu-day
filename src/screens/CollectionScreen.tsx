import { Sticker } from '../components/Sticker.tsx'
import { HUSBAND_NAME } from '../config.ts'
import { CATEGORIES } from '../data/categories.ts'
import { ITEMS } from '../data/items.ts'
import { useGame } from '../game/store.ts'
import { useUi } from '../game/ui.ts'
import { CouponsSection } from './CouponsSection.tsx'

/** Đọc lại thư sinh nhật */
function LetterCard() {
  const birthdayAt = useGame((s) => s.save.birthdayAt)
  const setLetterOpen = useUi((s) => s.setLetterOpen)
  if (birthdayAt === null) return null
  return (
    <button
      type="button"
      onClick={() => setLetterOpen(true)}
      className="press mt-5 flex w-full items-center gap-3 rounded-[24px] bg-petal p-3.5 text-left ring-1 ring-peony/40"
    >
      <Sticker emoji="💌" className="text-[34px]" />
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[18px] leading-tight font-bold">Your birthday letter</span>
        <span className="mt-0.5 block text-[13px] font-bold text-plum-soft">From {HUSBAND_NAME} · Read it again</span>
      </span>
      <span aria-hidden className="text-[24px] leading-none text-plum-soft">
        ›
      </span>
    </button>
  )
}

// Sổ sticker: mỗi món đã mua/nhận hiện màu, món chưa có là ô trống viền đứt.

export function CollectionScreen() {
  const collection = useGame((s) => s.save.collection)
  const owned = ITEMS.filter((item) => (collection[item.id] ?? 0) > 0).length

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-[34px] leading-none font-bold">Collection</h1>
      <p className="mt-1.5 text-[15px] font-semibold text-plum-soft">
        {owned === 0
          ? 'Everything you buy or win turns into a sticker here.'
          : `${owned} of ${ITEMS.length} stickers collected`}
      </p>

      <LetterCard />
      <CouponsSection />

      {CATEGORIES.map((category) => {
        const items = ITEMS.filter((item) => item.category === category.id)
        const have = items.filter((item) => (collection[item.id] ?? 0) > 0).length
        return (
          <section key={category.id} className="mt-7">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-display text-[20px] leading-tight font-bold">{category.label}</h2>
              <span className="text-[13px] font-bold text-plum-soft">
                {have} of {items.length}
              </span>
            </div>
            <ul className="mt-3 grid grid-cols-3 gap-x-3 gap-y-4">
              {items.map((item) => {
                const count = collection[item.id] ?? 0
                return (
                  <li key={item.id} className="flex flex-col items-center gap-1.5 text-center">
                    <div
                      className={`relative grid aspect-square w-full place-items-center rounded-full ${
                        count > 0 ? 'bg-white ring-1 ring-petal' : 'border-2 border-dashed border-peony/50'
                      }`}
                    >
                      {count > 0 ? (
                        <Sticker emoji={item.emoji} className="text-[38px]" />
                      ) : (
                        <span aria-hidden className="text-[32px] opacity-25 grayscale">
                          {item.emoji}
                        </span>
                      )}
                      {count > 1 && (
                        <span className="absolute -top-1 -right-1 rounded-full bg-peony px-2 py-0.5 text-[12px] font-extrabold tabular-nums">
                          ×{count}
                        </span>
                      )}
                    </div>
                    <span className={`text-[12px] leading-tight font-bold ${count > 0 ? '' : 'text-plum-soft'}`}>
                      {item.name}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
