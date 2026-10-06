import { HUSBAND_NAME, PLAYER_NAME } from '../config.ts'
import { ART, type ArtWho } from '../data/art.ts'
import { Sticker } from './Sticker.tsx'

const BG: Record<ArtWho, string> = { misu: 'bg-petal', husband: 'bg-hydrangea/60' }
const NAMES: Record<ArtWho, string> = { misu: PLAYER_NAME, husband: HUSBAND_NAME }

type AvatarProps = {
  who: ArtWho
  /** Kích thước, ví dụ "h-12 w-12" */
  className?: string
  /** Emoji nhỏ ở góc dưới bên phải (trạng thái) */
  badge?: string
  badgeClassName?: string
}

/** Avatar tròn: đầu chibi trên nền màu, viền trắng như sticker */
export function Avatar({ who, className = 'h-12 w-12', badge, badgeClassName = 'text-[20px]' }: AvatarProps) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <img
        src={ART[who].head}
        alt={NAMES[who]}
        draggable={false}
        className={`h-full w-full rounded-full object-cover shadow-[0_6px_14px_-6px_rgb(90_58_74/0.4)] ring-[3px] ring-white ${BG[who]}`}
      />
      {badge && <Sticker emoji={badge} className={`absolute -right-1.5 -bottom-1 ${badgeClassName}`} />}
    </span>
  )
}
