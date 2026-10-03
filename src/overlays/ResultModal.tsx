import { Chip } from '../components/Chip.tsx'
import { Modal } from '../components/Modal.tsx'
import { Sticker } from '../components/Sticker.tsx'
import { formatMoney } from '../game/format.ts'
import { useUi } from '../game/ui.ts'

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
      {levelUp && (
        <p className="mt-3 rounded-[20px] bg-lavender/60 px-4 py-3 text-[15px] font-extrabold">
          Level up! You're now Level {result.levelAfter} 🎉
        </p>
      )}

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
