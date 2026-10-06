import { useState } from 'react'
import { Avatar } from '../components/Avatar.tsx'
import { Sticker } from '../components/Sticker.tsx'
import { HUSBAND_NAME, PLAYER_NAME } from '../config.ts'
import { ART } from '../data/art.ts'
import { ENERGY_PER_HOUR, MAX_ENERGY } from '../data/economy.ts'
import { noteForDay } from '../data/morningNotes.ts'
import { HOME_ACTIVITIES } from '../data/places.ts'
import { runActivity } from '../game/actions.ts'
import { gameDayKey } from '../game/clock.ts'
import { currentEnergy } from '../game/energy.ts'
import { diaryForDay } from '../game/engine.ts'
import { formatClock, formatDuration, formatMoney } from '../game/format.ts'
import { husbandStatus, isWithMisu } from '../game/husband.ts'
import { levelInfo } from '../game/level.ts'
import { nextUnlockLevel } from '../game/unlocks.ts'
import { checkActivity } from '../game/rules.ts'
import { useGame } from '../game/store.ts'
import type { Activity, SaveData } from '../game/types.ts'
import { useUi } from '../game/ui.ts'
import { PetSection } from './home/PetSection.tsx'

function greeting(hour: number) {
  if (hour < 5) return 'Hey night owl'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

type StatProps = { emoji: string; label: string; value: string; note?: string; className: string }

function Stat({ emoji, label, value, note, className }: StatProps) {
  return (
    <div className={`rounded-[26px] p-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Sticker emoji={emoji} className="text-[22px]" />
        <span className="text-[14px] font-bold">{label}</span>
      </div>
      <p className="mt-2.5 font-display text-[23px] leading-none font-bold tabular-nums">{value}</p>
      {note && <p className="mt-1.5 text-[12px] font-bold">{note}</p>}
    </div>
  )
}

/** Module 8: giờ này Chằm Chằm đang làm gì */
function HusbandCard({ now }: { now: number }) {
  const status = husbandStatus(now)
  return (
    <section
      aria-label={`What ${HUSBAND_NAME} is doing`}
      className={`mt-3 flex items-center gap-3.5 rounded-[26px] px-4 py-3.5 ring-1 ${
        isWithMisu(status) ? 'bg-mint/70 ring-mint' : 'bg-white ring-petal'
      }`}
    >
      <Avatar who="husband" className="h-14 w-14" badge={status.emoji} badgeClassName="text-[22px]" />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-extrabold text-plum-soft">
          {HUSBAND_NAME} · until {formatClock(status.until)}
        </p>
        <p className="font-display text-[18px] leading-tight font-bold">{status.label}</p>
        {status.detail && <p className="mt-0.5 text-[14px] leading-snug text-plum-soft">{status.detail}</p>}
      </div>
    </section>
  )
}

/** Chibi Misu: chạm vào thì nhún nhảy một cái */
function MisuChibi() {
  const [hops, setHops] = useState(0)
  return (
    <button type="button" onClick={() => setHops((n) => n + 1)} aria-label={PLAYER_NAME} className="shrink-0">
      <img
        key={hops}
        src={ART.misu.full}
        alt=""
        draggable={false}
        className={`sticker-art h-44 w-auto -rotate-2 ${hops > 0 ? 'animate-hop' : ''}`}
      />
    </button>
  )
}

/** Ô hoạt động ở nhà: chạm là làm luôn */
function HomeTile({ activity, save, now }: { activity: Activity; save: SaveData; now: number }) {
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

export function HomeScreen() {
  const now = useUi((s) => s.now)
  const save = useGame((s) => s.save)

  const { level, into, needed } = levelInfo(save.xp)
  const nextUnlock = nextUnlockLevel(level)
  const energy = currentEnergy(save, now)
  const energyNote =
    energy >= MAX_ENERGY
      ? 'Full'
      : `Full in ${formatDuration(((MAX_ENERGY - energy) / ENERGY_PER_HOUR) * 3_600_000)}`
  const today = gameDayKey(now)
  const diary = diaryForDay(save.diary, today).reverse()
  const date = new Date(now).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="mx-auto max-w-md">
      <header>
        <p className="text-[14px] font-bold text-plum-soft">{date}</p>
        <h1 className="mt-1 font-display text-[34px] leading-[1.02] font-bold text-balance">
          {greeting(new Date(now).getHours())}, {PLAYER_NAME}
        </h1>
      </header>

      <section className="mt-5 flex items-center gap-4" aria-label="Level">
        <MisuChibi />
        <div className="min-w-0 flex-1">
          <p className="font-display text-[26px] leading-none font-bold">Level {level}</p>
          <div
            role="progressbar"
            aria-label="XP"
            aria-valuemin={0}
            aria-valuemax={needed}
            aria-valuenow={into}
            className="mt-3 h-3.5 overflow-hidden rounded-full bg-white ring-1 ring-lavender"
          >
            <div
              className="h-full rounded-full bg-lavender transition-[width] duration-500"
              style={{ width: `${(into / needed) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-[13px] font-bold text-plum-soft">
            {into} of {needed} XP to Level {level + 1}
          </p>
          {nextUnlock && (
            <p className="mt-0.5 text-[13px] font-bold text-plum-soft">🔓 New places at Level {nextUnlock}</p>
          )}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-[1.3fr_1fr] gap-3" aria-label="Wallet and energy">
        <Stat emoji="💰" label="Wallet" value={formatMoney(save.money)} className="bg-butter" />
        <Stat
          emoji="⚡"
          label="Energy"
          value={String(Math.floor(energy))}
          note={energyNote}
          className="bg-hydrangea/60"
        />
      </section>

      <HusbandCard now={now} />

      {save.lastAllowanceDay === today && !save.pendingAllowance && (
        <section className="relative mt-8 -rotate-1 rounded-[22px] bg-white px-5 pt-6 pb-5 shadow-[0_10px_24px_-14px_rgb(90_58_74/0.4)] ring-1 ring-petal">
          <span
            aria-hidden
            className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-3 rounded-md bg-peony/45"
          />
          <p className="text-[13px] font-extrabold text-plum-soft">From {HUSBAND_NAME}</p>
          <p className="mt-1.5 text-[16px] leading-relaxed">{noteForDay(today)}</p>
        </section>
      )}

      <PetSection />

      <section className="mt-7" aria-labelledby="home-activities">
        <h2 id="home-activities" className="font-display text-[21px] leading-tight font-bold">
          At home
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {HOME_ACTIVITIES.map((activity) => (
            <HomeTile key={activity.id} activity={activity} save={save} now={now} />
          ))}
        </div>
      </section>

      <section className="mt-7 rounded-[26px] border-2 border-dashed border-peony/60 px-4 py-5">
        <h2 className="font-display text-[21px] leading-tight font-bold">Today's diary</h2>
        {diary.length === 0 ? (
          <p className="mt-1.5 text-[15px] leading-relaxed text-plum-soft">
            Nothing yet. Pick a place on the map to start your day.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {diary.map((entry) => (
              <li key={entry.id} className="flex items-start gap-3">
                <span className="w-8 shrink-0 text-center">
                  <Sticker emoji={entry.emoji} className="mt-0.5 text-[24px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] leading-snug">{entry.text}</p>
                  <p className="mt-0.5 text-[12px] font-bold text-plum-soft">
                    {formatClock(entry.at)}
                    {entry.money ? ` · ${entry.money > 0 ? '+' : '−'}${formatMoney(Math.abs(entry.money))}` : ''}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
