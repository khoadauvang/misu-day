import { Sticker } from '../../components/Sticker.tsx'
import { runActivity } from '../../game/actions.ts'
import { checkActivity } from '../../game/rules.ts'
import type { Activity, SaveData } from '../../game/types.ts'

/** Ô hoạt động ở nhà: chạm là làm luôn */
export function HomeTile({ activity, save, now }: { activity: Activity; save: SaveData; now: number }) {
  const check = checkActivity(save, null, activity, now)
  const energy = activity.energy > 0 ? `−${activity.energy} ⚡` : `+${-activity.energy} ⚡`
  return (
    <button
      type="button"
      disabled={!check.ok}
      onClick={() => runActivity(null, activity)}
      className="press flex flex-col items-start rounded-[24px] bg-white p-3.5 text-left ring-1 ring-petal disabled:opacity-60"
    >
      <Sticker emoji={activity.emoji} className="text-[28px]" />
      <span className="mt-2 font-display text-[16px] leading-tight font-bold">{activity.name}</span>
      <span className="mt-1 text-[12px] font-bold text-plum-soft">
        {check.ok ? `${energy}${activity.xp > 0 ? `  +${activity.xp} XP` : ''}` : `${check.icon} ${check.reason}`}
      </span>
    </button>
  )
}
