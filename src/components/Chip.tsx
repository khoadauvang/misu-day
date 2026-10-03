import type { ReactNode } from 'react'
import { formatMoney } from '../game/format.ts'
import type { Activity } from '../game/types.ts'

type ChipProps = { children: ReactNode; className?: string }

/** Nhãn nhỏ bo tròn, ví dụ giá tiền hay XP */
export function Chip({ children, className = 'bg-white' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] leading-none font-extrabold whitespace-nowrap tabular-nums ${className}`}
    >
      {children}
    </span>
  )
}

/** Giá, năng lượng, XP của một hoạt động */
export function ActivityChips({ activity }: { activity: Activity }) {
  const { cost, energy, xp } = activity
  return (
    <>
      {cost > 0 ? <Chip className="bg-butter">{formatMoney(cost)}</Chip> : <Chip className="bg-mint">Free</Chip>}
      {energy !== 0 && (
        <Chip className="bg-hydrangea/60">
          {energy > 0 ? `−${energy}` : `+${-energy}`} ⚡
        </Chip>
      )}
      {xp > 0 && <Chip className="bg-lavender/70">+{xp} XP</Chip>}
      {activity.item && <Chip className="bg-petal">+ sticker</Chip>}
    </>
  )
}
