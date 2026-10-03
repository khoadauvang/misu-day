import { Sticker } from '../components/Sticker.tsx'
import { DISTRICTS } from '../data/districts.ts'

// Module 1: xem trước các quận. Module 4 biến thành bản đồ vẽ tay, chạm vào quận để xem POI.

export function MapScreen() {
  return (
    <div className="mx-auto max-w-md">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[34px] leading-none font-bold">Saigon</h1>
          <p className="mt-1.5 text-[15px] font-semibold text-plum-soft">Pick a district to explore</p>
        </div>
        <button
          type="button"
          disabled
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/85 px-3.5 py-2 text-[14px] font-extrabold text-plum-soft ring-1 ring-petal"
        >
          <Sticker emoji="🌏" className="text-[18px]" />
          World
          <span aria-label="locked">🔒</span>
        </button>
      </header>

      <ul className="mt-6 grid grid-cols-2 gap-3">
        {DISTRICTS.map((district) => (
          <li key={district.id} className={`rounded-[26px] p-4 ${district.tint}`}>
            <Sticker emoji={district.emoji} className="text-[40px]" />
            <p className="mt-3 font-display text-[19px] leading-tight font-bold">{district.name}</p>
            <p className="mt-0.5 text-[13px] leading-snug font-semibold">{district.theme}</p>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-center text-[13px] font-semibold text-plum-soft">
        Exploring districts opens in Module 4.
      </p>
    </div>
  )
}
