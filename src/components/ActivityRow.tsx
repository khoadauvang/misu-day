import { runActivity } from '../game/actions.ts'
import { checkActivity } from '../game/rules.ts'
import { useGame } from '../game/store.ts'
import type { Activity, Place } from '../game/types.ts'
import { useUi } from '../game/ui.ts'
import { ActivityChips } from './Chip.tsx'
import { Sticker } from './Sticker.tsx'

type ActivityRowProps = { place: Place | null; activity: Activity }

/** Một hoạt động trong danh sách: tên, giá, năng lượng, XP và nút "Do it" */
export function ActivityRow({ place, activity }: ActivityRowProps) {
  const now = useUi((s) => s.now)
  const save = useGame((s) => s.save)
  const setAdoptOpen = useUi((s) => s.setAdoptOpen)
  const check = checkActivity(save, place, activity, now)
  // Nhận nuôi cún: mở hộp đặt tên trước (xem AdoptModal)
  const adopt = Boolean(activity.pet?.adopt)

  return (
    <li className="rounded-[24px] bg-white p-3.5 ring-1 ring-petal">
      <div className="flex items-center gap-3">
        <Sticker emoji={activity.emoji} className="text-[30px]" />
        <p className="min-w-0 flex-1 font-display text-[17px] leading-tight font-bold">{activity.name}</p>
        <button
          type="button"
          disabled={!check.ok}
          onClick={() => (adopt ? setAdoptOpen(true) : runActivity(place, activity))}
          aria-label={`${adopt ? 'Adopt' : 'Do it'}: ${activity.name}`}
          className="press shrink-0 rounded-full bg-peony px-4 py-2 text-[14px] font-extrabold disabled:bg-petal disabled:text-plum-soft"
        >
          {adopt ? 'Adopt' : 'Do it'}
        </button>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pl-[42px]">
        <ActivityChips activity={activity} />
      </div>
      {!check.ok && (
        <p className="mt-2 pl-[42px] text-[13px] font-bold text-plum-soft">
          {check.icon} {check.reason}
        </p>
      )}
    </li>
  )
}
