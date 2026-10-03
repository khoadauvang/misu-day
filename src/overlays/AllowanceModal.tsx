import { Modal } from '../components/Modal.tsx'
import { Sticker } from '../components/Sticker.tsx'
import { HUSBAND_NAME } from '../config.ts'
import { noteForDay } from '../data/morningNotes.ts'
import { formatMoney } from '../game/format.ts'
import { useGame } from '../game/store.ts'

/** Mỗi sáng: lời nhắn + tiền của Chằm Chằm. Misu bấm Collect để nhận. */
export function AllowanceModal() {
  const pending = useGame((s) => s.save.pendingAllowance)
  const collect = useGame((s) => s.collectAllowance)
  if (!pending) return null

  const away = pending.days > 1

  return (
    <Modal labelledBy="allowance-title">
      <Sticker emoji="💌" className="text-[58px]" />
      <p className="mt-3 text-[14px] font-bold text-plum-soft">From {HUSBAND_NAME}</p>
      <h2 id="allowance-title" className="font-display text-[28px] leading-tight font-bold">
        {away ? 'While you were away' : "Today's allowance"}
      </h2>
      <p className="mt-3 text-[16px] leading-relaxed text-pretty">{noteForDay(pending.day)}</p>
      {away && (
        <p className="mt-2 text-[14px] font-semibold text-plum-soft">
          {pending.days} mornings of allowance saved up for you.
        </p>
      )}
      <p className="mt-5 font-display text-[32px] leading-none font-bold tabular-nums">
        +{formatMoney(pending.amount)}
      </p>
      <button
        type="button"
        onClick={collect}
        className="press mt-6 w-full rounded-full bg-peony py-3.5 text-[17px] font-extrabold"
      >
        Collect
      </button>
    </Modal>
  )
}
