import { useState } from 'react'

// Hoa và cánh hoa rơi lả tả (màn quà 20/10). Mỗi bông rơi thẳng xuống (animate-petal-fall)
// và đung đưa qua lại (animate-petal-sway); thời gian, độ trễ, vị trí ngẫu nhiên.
// Máy bật "Giảm chuyển động" thì CSS chung trong index.css tự tắt hiệu ứng.

const COLORS = ['--color-peony', '--color-petal', '--color-lavender', '--color-butter', '--color-peach', '--color-hydrangea']

type Petal = { left: number; size: number; fall: number; sway: number; delay: number; color: string; blossom: boolean }

function makePetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100,
    size: 14 + Math.random() * 14,
    fall: 7 + Math.random() * 6,
    sway: 1.6 + Math.random() * 1.6,
    // Độ trễ âm: vừa mở là đã có hoa rải khắp màn hình
    delay: -Math.random() * 12,
    color: `var(${COLORS[i % COLORS.length]})`,
    blossom: i % 3 === 0,
  }))
}

/** Bông hoa 5 cánh nhỏ */
function Blossom({ color }: { color: string }) {
  return (
    <svg viewBox="-12 -12 24 24" className="block h-full w-full">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-5.5" rx="4.2" ry="5.6" transform={`rotate(${a})`} fill={color} stroke="#fff" strokeWidth="1" />
      ))}
      <circle r="2.6" fill="var(--color-butter)" />
    </svg>
  )
}

/** Một cánh hoa rời */
function Petal({ color }: { color: string }) {
  return (
    <svg viewBox="-10 -12 20 24" className="block h-full w-full">
      <path d="M0 11 C-8 5 -8 -6 -3 -11 C-1 -8 1 -8 3 -11 C8 -6 8 5 0 11 Z" fill={color} stroke="#fff" strokeWidth="1" />
    </svg>
  )
}

export function FallingPetals({ count = 26 }: { count?: number }) {
  const [petals] = useState(() => makePetals(count))
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block animate-petal-fall"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.fall}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <span
            className="block h-full w-full animate-petal-sway"
            style={{ animationDuration: `${p.sway}s`, animationDelay: `${p.delay}s` }}
          >
            {p.blossom ? <Blossom color={p.color} /> : <Petal color={p.color} />}
          </span>
        </span>
      ))}
    </div>
  )
}
