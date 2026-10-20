import { Bouquet } from '../components/Flowers.tsx'
import { Sheet } from '../components/Sheet.tsx'
import { Sticker } from '../components/Sticker.tsx'
import { HUSBAND_NAME } from '../config.ts'
import { FLOWER_BY_ID } from '../data/flowers.ts'
import { ITEM_BY_ID } from '../data/items.ts'
import { useUi } from '../game/ui.ts'

// Chi tiết một loài hoa (bấm hoa trong Collection): bó hoa gói riêng, tên, ý nghĩa, điều thú vị.

export function FlowerSheet() {
  const id = useUi((s) => s.flowerOpen)
  const setFlowerOpen = useUi((s) => s.setFlowerOpen)
  const flower = id ? FLOWER_BY_ID[id] : undefined
  const item = id ? ITEM_BY_ID[id] : undefined

  return (
    <Sheet open={Boolean(flower && item)} onClose={() => setFlowerOpen(null)} labelledBy="flower-title">
      {flower && item && (
        <div className="text-center">
          <div className="paper-dots mx-auto mt-2 rounded-[28px] bg-petal px-4 pt-3 pb-1 ring-1 ring-petal">
            <Bouquet key={flower.id} id={flower.id} className="mx-auto block w-[min(64vw,240px)] animate-pop-in" />
          </div>
          <h2 id="flower-title" className="mt-4 font-display text-[30px] leading-none font-bold">
            {item.name}
          </h2>
          <p className="mt-1.5 text-[13px] font-bold text-plum-soft">
            A bouquet from {HUSBAND_NAME} · 20/10 <Sticker emoji="💗" />
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
            {flower.meanings.map((m) => (
              <li key={m} className="rounded-full bg-lavender/70 px-3 py-1 text-[13px] font-extrabold">
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-left text-[15px] leading-relaxed font-semibold">{flower.story}</p>
          <div className="mt-4 rounded-[22px] bg-butter/60 px-4 py-3 text-left">
            <p className="text-[13px] font-extrabold">
              <Sticker emoji="💡" /> Did you know?
            </p>
            <p className="mt-1 text-[14px] leading-snug font-semibold">{flower.fact}</p>
          </div>
          <p className="mt-3 text-[13px] font-bold text-plum-soft">
            <Sticker emoji="🎀" /> {flower.wrap}
          </p>
        </div>
      )}
    </Sheet>
  )
}
