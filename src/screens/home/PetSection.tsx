import { useState } from 'react'
import { Chip } from '../../components/Chip.tsx'
import { GoldenPup } from '../../components/GoldenPup.tsx'
import { Sheet } from '../../components/Sheet.tsx'
import { Sticker } from '../../components/Sticker.tsx'
import { DISTRICT_BY_ID } from '../../data/districts.ts'
import { FEED_ACTIVITIES, PET_BREED, PET_CARE, PET_FOOD_BY_ID, PET_MOOD_LINES, PET_TAP_LINES } from '../../data/pet.ts'
import { findAdoptActivity, runPetCare } from '../../game/actions.ts'
import { levelInfo } from '../../game/level.ts'
import { daysTogether, fillPet, pantryCount, petMood, petStats } from '../../game/pet.ts'
import { checkActivity } from '../../game/rules.ts'
import { useGame } from '../../game/store.ts'
import type { Activity, PetState, SaveData } from '../../game/types.ts'
import { useUi } from '../../game/ui.ts'
import { playSfx } from '../../lib/sound.ts'

// Cún Golden ở tab Home: chưa nhận nuôi thì hiện lời mời, có cún rồi thì hiện thẻ chăm cún.

function Meter({ emoji, label, value, className }: { emoji: string; label: string; value: number; className: string }) {
  return (
    <div className="flex items-center gap-2">
      <Sticker emoji={emoji} className="w-6 text-center text-[18px]" />
      <span className="w-12 text-[13px] font-extrabold">{label}</span>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        className="h-3 flex-1 overflow-hidden rounded-full bg-paper ring-1 ring-petal"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ${className}`}
          style={{ width: `${Math.max(4, value)}%` }}
        />
      </div>
      <span className="w-10 text-right text-[12px] font-extrabold text-plum-soft tabular-nums">{Math.round(value)}%</span>
    </div>
  )
}

type CareButtonProps = { emoji: string; label: string; note: string; disabled?: boolean; onClick: () => void }

function CareButton({ emoji, label, note, disabled, onClick }: CareButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="press flex flex-col items-center rounded-[20px] bg-paper px-1.5 py-2.5 text-center ring-1 ring-petal disabled:opacity-55"
    >
      <Sticker emoji={emoji} className="text-[26px]" />
      <span className="mt-1 font-display text-[15px] leading-tight font-bold">{label}</span>
      <span className="mt-0.5 text-[11px] leading-tight font-bold text-plum-soft">{note}</span>
    </button>
  )
}

/** "−15 ⚡ · +20 XP" */
function careNote(activity: Activity): string {
  const parts = []
  if (activity.energy > 0) parts.push(`−${activity.energy} ⚡`)
  if (activity.xp > 0) parts.push(`+${activity.xp} XP`)
  return parts.join(' · ')
}

/** Nút sang Pet Shop (tab Map → District 2 → Pet Shop) */
function ShopButton({ className = '', label, onGo }: { className?: string; label?: string; onGo?: () => void }) {
  const goToPlace = useUi((s) => s.goToPlace)
  const shop = findAdoptActivity()?.place
  if (!shop) return null
  return (
    <button
      type="button"
      onClick={() => {
        onGo?.()
        goToPlace(shop.id)
      }}
      className={`press rounded-full px-4 py-2.5 text-[14px] font-extrabold ${className}`}
    >
      {label ?? `Go to the ${shop.name} 🛒`}
    </button>
  )
}

function FeedSheet({ open, onClose, pet, save, now }: { open: boolean; onClose: () => void; pet: PetState; save: SaveData; now: number }) {
  const shop = findAdoptActivity()?.place
  return (
    <Sheet open={open} onClose={onClose} labelledBy="feed-title">
      <h2 id="feed-title" className="pr-12 font-display text-[24px] leading-tight font-bold">
        Feed {pet.name}
      </h2>
      <p className="mt-1 text-[14px] font-semibold text-plum-soft">Pick something yummy from the pantry.</p>

      <ul className="mt-4 space-y-2.5">
        {FEED_ACTIVITIES.map((activity) => {
          const food = PET_FOOD_BY_ID[activity.pet?.feed ?? '']
          if (!food) return null
          const left = save.pantry[food.id] ?? 0
          const check = checkActivity(save, null, activity, now)
          return (
            <li key={activity.id} className="rounded-[24px] bg-white p-3.5 ring-1 ring-petal">
              <div className="flex items-center gap-3">
                <Sticker emoji={food.emoji} className={`text-[30px] ${left === 0 ? 'opacity-40 grayscale' : ''}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[17px] leading-tight font-bold">{food.name}</p>
                  <p className="text-[12px] font-extrabold text-plum-soft">{left} left</p>
                </div>
                <button
                  type="button"
                  disabled={!check.ok}
                  onClick={() => {
                    onClose()
                    runPetCare(activity)
                  }}
                  aria-label={`Feed ${pet.name}: ${food.name}`}
                  className="press shrink-0 rounded-full bg-peony px-4 py-2 text-[14px] font-extrabold disabled:bg-petal disabled:text-plum-soft"
                >
                  Feed
                </button>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5 pl-[42px]">
                {food.fullness > 0 && <Chip className="bg-peach">+{food.fullness} 🍖</Chip>}
                {food.happiness > 0 && <Chip className="bg-butter">+{food.happiness} 💛</Chip>}
                <Chip className="bg-lavender/70">+{food.xp} XP</Chip>
              </div>
              {!check.ok && left > 0 && (
                <p className="mt-2 pl-[42px] text-[13px] font-bold text-plum-soft">
                  {check.icon} {check.reason}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      {shop && (
        <div className="mt-4 rounded-[24px] bg-petal px-4 py-3.5">
          <p className="text-[14px] leading-snug font-bold">
            Need more food? The {shop.name} in {DISTRICT_BY_ID[shop.district].name} has it all.
          </p>
          <ShopButton onGo={onClose} className="mt-2.5 w-full bg-white ring-1 ring-peony" />
        </div>
      )}
    </Sheet>
  )
}

function PetCard({ pet, save, now }: { pet: PetState; save: SaveData; now: number }) {
  const [feedOpen, setFeedOpen] = useState(false)
  const reaction = useUi((s) => s.petReaction)
  const showPetReaction = useUi((s) => s.showPetReaction)
  const mood = petMood(pet, now)
  const { fullness, happiness } = petStats(pet, now)
  const fresh = reaction // tự tắt sau vài giây (xem showPetReaction trong ui.ts)
  const count = pantryCount(save.pantry)

  const pat = () => {
    const line = PET_TAP_LINES[Math.floor(Math.random() * PET_TAP_LINES.length)]
    showPetReaction({ emoji: '', text: line })
    playSfx('squeak')
  }

  return (
    <section aria-labelledby="pet-name" className="mt-7 rounded-[28px] bg-white p-4 ring-1 ring-petal">
      <div className="flex items-center gap-3.5">
        <button type="button" onClick={pat} aria-label={`Pat ${pet.name}`} className="relative shrink-0">
          <GoldenPup
            key={fresh?.id ?? 'idle'}
            mood={fresh ? 'happy' : mood}
            className={`block h-28 w-28 ${fresh ? 'animate-hop' : ''}`}
          />
          {fresh && (
            <span className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="block animate-bubble-up rounded-full bg-butter px-3 py-1 text-[13px] font-extrabold whitespace-nowrap shadow-float">
                {fresh.emoji} {fresh.text}
              </span>
            </span>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <h2 id="pet-name" className="font-display text-[22px] leading-tight font-bold break-words">
            {pet.name}
          </h2>
          <p className="text-[12px] font-extrabold text-plum-soft">
            {PET_BREED} · Day {daysTogether(pet, now)} together
          </p>
          <p className="mt-1.5 text-[14px] leading-snug">{fillPet(PET_MOOD_LINES[mood], pet.name)}</p>
        </div>
      </div>

      <div className="mt-3.5 space-y-2">
        <Meter emoji="🍖" label="Full" value={fullness} className="bg-peach" />
        <Meter emoji="💛" label="Happy" value={happiness} className="bg-butter" />
      </div>

      <div className="mt-3.5 grid grid-cols-3 gap-2">
        <CareButton
          emoji="🥣"
          label="Feed"
          note={count > 0 ? `${count} in pantry` : 'Pantry empty'}
          onClick={() => setFeedOpen(true)}
        />
        {PET_CARE.map((activity) => {
          const check = checkActivity(save, null, activity, now)
          return (
            <CareButton
              key={activity.id}
              emoji={activity.emoji}
              label={activity.name}
              note={check.ok ? careNote(activity) : `${check.icon} ${check.reason}`}
              disabled={!check.ok}
              onClick={() => runPetCare(activity)}
            />
          )
        })}
      </div>

      <FeedSheet open={feedOpen} onClose={() => setFeedOpen(false)} pet={pet} save={save} now={now} />
    </section>
  )
}

/** Chưa có cún: lời mời (chưa đủ level thì hiện mờ + level cần đạt) */
function PetTeaser({ level }: { level: number }) {
  const found = findAdoptActivity()
  if (!found) return null
  const { place, activity } = found
  const need = Math.max(place.unlockLevel, activity.unlockLevel ?? 1)
  const ready = level >= need

  return (
    <section
      className={`mt-7 flex items-center gap-3.5 rounded-[28px] px-4 py-3.5 ${
        ready ? 'bg-butter/70' : 'border-2 border-dashed border-peony/50'
      }`}
    >
      <GoldenPup
        mood={ready ? 'happy' : 'sleeping'}
        wag={ready}
        className={`h-24 w-24 shrink-0 ${ready ? '' : 'opacity-60 grayscale'}`}
      />
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-[19px] leading-tight font-bold">
          {ready ? 'A puppy is waiting for you 🐾' : 'Someone fluffy is waiting 🐾'}
        </h2>
        <p className="mt-1 text-[14px] leading-snug text-plum-soft">
          {ready
            ? `Adopt a ${PET_BREED} at the ${place.name} in ${DISTRICT_BY_ID[place.district].name}.`
            : `Reach Level ${need} to adopt a ${PET_BREED} puppy.`}
        </p>
        {ready && <ShopButton className="mt-2.5 bg-peony" label="Meet your puppy 🐾" />}
      </div>
    </section>
  )
}

export function PetSection() {
  const now = useUi((s) => s.now)
  const save = useGame((s) => s.save)
  if (!save.pet) return <PetTeaser level={levelInfo(save.xp).level} />
  return <PetCard pet={save.pet} save={save} now={now} />
}
