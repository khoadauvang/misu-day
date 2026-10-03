import { CATEGORIES } from '../data/categories.ts'

// Module 1: cuốn sổ sticker còn trống. Module 5 lấp đầy bằng đồ Misu mua hoặc được tặng.

export function CollectionScreen() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-[34px] leading-none font-bold">Collection</h1>
      <p className="mt-1.5 text-[15px] font-semibold text-plum-soft">
        Everything you buy or win turns into a sticker here.
      </p>

      <ul className="mt-6 grid grid-cols-3 gap-x-3 gap-y-4">
        {CATEGORIES.map((category) => (
          <li key={category.id} className="flex flex-col items-center gap-2">
            <div className="grid aspect-square w-full place-items-center rounded-full border-2 border-dashed border-peony/60">
              <span aria-hidden className="text-[34px] opacity-30 grayscale">
                {category.emoji}
              </span>
            </div>
            <span className="text-[13px] font-bold text-plum-soft">{category.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
