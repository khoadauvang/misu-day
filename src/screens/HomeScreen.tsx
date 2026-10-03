import { useState } from 'react'
import { Sticker } from '../components/Sticker.tsx'
import { HUSBAND_NAME, PLAYER_NAME } from '../config.ts'

// Module 1: màn hình mẫu với số liệu giả. Module 2–3 sẽ nối vào dữ liệu thật.

function greeting(hour: number) {
  if (hour < 5) return 'Hey night owl'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

type StatProps = { emoji: string; label: string; value: string; className: string }

function Stat({ emoji, label, value, className }: StatProps) {
  return (
    <div className={`rounded-[26px] p-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Sticker emoji={emoji} className="text-[22px]" />
        <span className="text-[14px] font-bold">{label}</span>
      </div>
      <p className="mt-2.5 font-display text-[23px] leading-none font-bold tabular-nums">{value}</p>
    </div>
  )
}

export function HomeScreen() {
  // Module 3 sẽ thay bằng đồng hồ game chạy theo giờ thật
  const [now] = useState(() => new Date())
  const today = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="mx-auto max-w-md">
      <header>
        <p className="flex items-center gap-2 text-[14px] font-bold text-plum-soft">
          {today}
          <span className="rounded-full bg-white/85 px-2.5 py-0.5 text-[12px] font-extrabold ring-1 ring-petal">
            Preview
          </span>
        </p>
        <h1 className="mt-1 font-display text-[34px] leading-[1.02] font-bold text-balance">
          {greeting(now.getHours())}, {PLAYER_NAME}
        </h1>
      </header>

      <section className="mt-6 flex items-center gap-4" aria-label="Level">
        <img src="/stickers/bunny.svg" alt={`${PLAYER_NAME}'s avatar`} className="h-32 w-32 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-[26px] leading-none font-bold">Level 1</p>
          <div
            role="progressbar"
            aria-label="XP"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            className="mt-3 h-3.5 overflow-hidden rounded-full bg-white ring-1 ring-lavender"
          >
            <div className="h-full w-0 rounded-full bg-lavender" />
          </div>
          <p className="mt-2 text-[13px] font-bold text-plum-soft">0 of 100 XP to Level 2</p>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-[1.3fr_1fr] gap-3" aria-label="Wallet and energy">
        <Stat emoji="💰" label="Wallet" value="4,000,000₫" className="bg-butter" />
        <Stat emoji="⚡" label="Energy" value="100" className="bg-hydrangea/60" />
      </section>

      <section className="mt-6 flex items-center gap-3 rounded-[26px] bg-white/85 p-4 ring-1 ring-petal">
        <Sticker emoji="🤵🏻" className="text-[38px]" />
        <div className="min-w-0">
          <p className="font-display text-[20px] leading-tight font-bold">{HUSBAND_NAME}</p>
          <p className="text-[14px] font-semibold text-plum-soft">Live status arrives in Module 8.</p>
        </div>
      </section>

      <section className="mt-6 rounded-[26px] border-2 border-dashed border-peony/60 px-4 py-5">
        <h2 className="font-display text-[21px] leading-tight font-bold">Today's diary</h2>
        <p className="mt-1.5 text-[15px] leading-relaxed text-plum-soft">
          Nothing yet. Pick a place on the map to start your day.
        </p>
      </section>
    </div>
  )
}
