import { Chip } from '../components/Chip.tsx'
import { Modal } from '../components/Modal.tsx'
import { Sticker } from '../components/Sticker.tsx'
import { HUSBAND_NAME } from '../config.ts'
import { DISTRICT_BY_ID } from '../data/districts.ts'
import { formatMoney } from '../game/format.ts'
import type { ActivityResult } from '../game/types.ts'
import { useUi } from '../game/ui.ts'

/** Module 6: lên level → thưởng của Chằm Chằm + những nơi vừa mở khóa */
function LevelUpBox({ result }: { result: ActivityResult }) {
  const { unlocked } = result
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
  const close = useUi((s) => s.closeResult)
  if (!result) return null

  const { activity, item, itemCount } = result
  const levelUp = result.levelAfter > result.levelBefore

  return (
    <Modal labelledBy="result-title" onClose={close}>
      <Sticker emoji={item?.emoji ?? activity.emoji} className="text-[64px]" />
      <p className="mt-3 text-[14px] font-bold text-plum-soft">{result.placeName}</p>
      <h2 id="result-title" className="font-display text-[26px] leading-tight font-bold text-balance">
        {activity.name}
      </h2>
      <p className="mt-2.5 text-[16px] leading-relaxed text-pretty">{result.text}</p>

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
      {levelUp && <LevelUpBox result={result} />}

      <button
        type="button"
        onClick={close}
        className="press mt-6 w-full rounded-full bg-peony py-3.5 text-[17px] font-extrabold"
      >
        Nice!
      </button>
    </Modal>
  )
}
