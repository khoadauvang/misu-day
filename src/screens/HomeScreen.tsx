import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Sticker } from '../components/Sticker.tsx'
import { HUSBAND_NAME, PLAYER_NAME } from '../config.ts'
import { ART } from '../data/art.ts'
import { ITEM_BY_ID } from '../data/items.ts'
import { HOME_ACTIVITIES } from '../data/places.ts'
import { ROOM_MISU_LINES, ROOM_PIGEON_NOTES, ROOM_SPOT_BY_ID, ROOM_SPOTS, type RoomSpotId } from '../data/room.ts'
import { currentEnergy } from '../game/energy.ts'
import { formatMoney } from '../game/format.ts'
import { levelInfo } from '../game/level.ts'
import { petMood } from '../game/pet.ts'
import { useGame } from '../game/store.ts'
import { useUi } from '../game/ui.ts'
import { playSfx } from '../lib/sound.ts'
import { HomeTile } from './home/HomeTile.tsx'
import { MovieNightTile } from './home/MovieNight.tsx'
import { C } from './map/scenes/geometry.ts'
import { dayPart, FLOOR_Y, ROOM_H, ROOM_W, trinketEmojis, WALL_L, WALL_R, WALL_TOP } from './room/geometry.ts'
import {
  RoomBed,
  RoomClock,
  RoomDesk,
  RoomMat,
  RoomPlant,
  RoomPup,
  RoomShelf,
  RoomShell,
  RoomWindow,
} from './room/RoomArt.tsx'

// Tab Home: căn phòng của Misu, góc nhìn kiểu PewDiePie's Tuber Simulator
// (cắt ngang như nhà búp bê, đồ đạc chạm được, tim bay lên từ đồ, bồ câu đưa thư bay ngang, chế độ Decorate có lưới).
// Chỉ vào được khi đang ở Phú Nhuận (xem goHome trong actions.ts). Bố cục phòng hiện là bản demo.

/** Chỗ tim bay lên phía trên mỗi món đồ (toạ độ trong khung 360 × 440) */
const HEART_AT: Record<RoomSpotId, [number, number]> = {
  computer: [264, 196],
  bed: [104, 236],
  shelf: [260, 86],
  mat: [178, 398],
}
/** Bao lâu có một trái tim bay lên */
const HEART_EVERY_MS = 2600
/** Bồ câu bay qua lần đầu sau bao lâu, rồi lặp lại */
const PIGEON_FIRST_MS = 5000
const PIGEON_EVERY_MS = 30_000
const PIGEON_FLY_MS = 9000
/** Màn mở cửa vào nhà */
const DOOR_MS = 1050

const pct = (x: number, y: number) => ({ left: `${(x / ROOM_W) * 100}%`, top: `${(y / ROOM_H) * 100}%` })
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]

/** Vào nhà: cửa biệt thự mở hai cánh rồi máy quay tiến vào trong (giống zoom vào quận trên bản đồ) */
function DoorIntro({ onDone }: { onDone: () => void }) {
  const done = useRef(onDone)
  useEffect(() => {
    done.current = onDone
  }, [onDone])
  useEffect(() => {
    playSfx('chime')
    const timer = setTimeout(() => done.current(), DOOR_MS)
    return () => clearTimeout(timer)
  }, [])

  const leaf = { stroke: C.plum, strokeWidth: 4, strokeLinejoin: 'round' as const }
  return (
    <div aria-hidden className="paper-dots fixed inset-0 z-30 grid place-items-center overflow-hidden">
      <div className="w-[min(70vw,300px)] animate-door-zoom">
        <svg viewBox="0 0 200 260" className="block w-full overflow-visible">
          {/* tường + khung cửa vòm */}
          <rect x={-200} y={-200} width={600} height={660} fill={C.petal} />
          <path d="M 20 250 L 20 90 Q 20 20 100 20 Q 180 20 180 90 L 180 250 Z" fill={C.white} {...leaf} />
          <path d="M 34 250 L 34 94 Q 34 36 100 36 Q 166 36 166 94 L 166 250 Z" fill={C.butter} {...leaf} />
          {/* hai cánh cửa mở ra về hai phía */}
          <g className="svg-self animate-door-open" style={{ transformOrigin: '0% 50%' }}>
            <path d="M 34 250 L 34 94 Q 34 38 100 36 L 100 250 Z" fill={C.peonyDeep} {...leaf} />
            <circle cx={90} cy={156} r={4} fill={C.butter} />
          </g>
          <g className="svg-self animate-door-open" style={{ transformOrigin: '100% 50%' }}>
            <path d="M 166 250 L 166 94 Q 166 38 100 36 L 100 250 Z" fill={C.peonyDeep} {...leaf} />
            <circle cx={110} cy={156} r={4} fill={C.butter} />
          </g>
          {/* bảng tim trên vòm cửa */}
          <circle cx={100} cy={22} r={15} fill={C.mint} {...leaf} strokeWidth={3} />
          <text x={100} y={23} fontSize={14} textAnchor="middle" dominantBaseline="central">
            💗
          </text>
          {/* thảm chùi chân */}
          <rect x={52} y={244} width={96} height={14} rx={7} fill={C.peony} {...leaf} strokeWidth={3} />
        </svg>
      </div>
      <p className="absolute bottom-[22%] font-display text-[26px] font-bold">Welcome home 🏡</p>
    </div>
  )
}

/** Một món đồ chạm được trong phòng */
function Spot({ id, selected, onPick, children }: { id: RoomSpotId; selected: boolean; onPick: (id: RoomSpotId) => void; children: ReactNode }) {
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onPick(id)
    }
  }
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={ROOM_SPOT_BY_ID[id].name}
      aria-pressed={selected}
      className="scene-spot"
      onClick={() => onPick(id)}
      onKeyDown={onKey}
      style={selected ? { filter: 'drop-shadow(0 0 6px var(--color-butter))' } : undefined}
    >
      {children}
    </g>
  )
}

/** Lưới chế độ Decorate: ô vuông trên tường, ô xa dần trên sàn (bố cục thật sẽ có sau) */
function DecorateGrid() {
  const line = { stroke: C.peonyDeep, strokeWidth: 1, strokeDasharray: '3 4', opacity: 0.55 }
  const cols = 12
  return (
    <g pointerEvents="none">
      {Array.from({ length: cols + 1 }, (_, i) => {
        const x = WALL_L + (i * (WALL_R - WALL_L)) / cols
        return <line key={`w${i}`} x1={x} y1={WALL_TOP} x2={x} y2={FLOOR_Y} {...line} />
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const y = WALL_TOP + ((i + 1) * (FLOOR_Y - WALL_TOP)) / 12
        return <line key={`h${i}`} x1={WALL_L} y1={y} x2={WALL_R} y2={y} {...line} />
      })}
      {Array.from({ length: cols + 1 }, (_, i) => {
        const t = i / cols
        return <line key={`f${i}`} x1={WALL_L + t * (WALL_R - WALL_L)} y1={FLOOR_Y} x2={t * ROOM_W} y2={ROOM_H} {...line} />
      })}
      {[0.18, 0.4, 0.66, 1].map((t) => {
        const y = FLOOR_Y + t * (ROOM_H - FLOOR_Y)
        const inset = WALL_L * (1 - t)
        return <line key={`r${t}`} x1={inset} y1={y} x2={ROOM_W - inset} y2={y} {...line} />
      })}
    </g>
  )
}

/** Thẻ dưới phòng: món đồ đang chọn + việc làm được */
function SpotCard({ id }: { id: RoomSpotId | null }) {
  const save = useGame((s) => s.save)
  const now = useUi((s) => s.now)
  if (!id) {
    return (
      <p className="mt-3 rounded-[24px] border-2 border-dashed border-peony/60 px-4 py-3.5 text-center text-[14px] font-bold text-plum-soft">
        Tap anything in your room ✨
      </p>
    )
  }
  const spot = ROOM_SPOT_BY_ID[id]
  const activity = HOME_ACTIVITIES.find((a) => a.id === spot.activity)
  return (
    <section key={id} aria-label={spot.name} className="mt-3 flex animate-pop-in items-stretch gap-3 rounded-[26px] bg-white p-3 ring-1 ring-petal">
      <div className="flex min-w-0 flex-1 flex-col justify-center pl-1">
        <p className="font-display text-[19px] leading-tight font-bold">
          <Sticker emoji={spot.emoji} className="text-[20px]" /> {spot.name}
        </p>
        <p className="mt-1 text-[13px] leading-snug font-semibold text-plum-soft">{spot.line}</p>
      </div>
      <div className="w-[46%] shrink-0 [&>button]:h-full [&>button]:w-full [&>button]:bg-petal/60">
        {spot.activity === 'movie' ? (
          <MovieNightTile save={save} now={now} />
        ) : (
          activity && <HomeTile activity={activity} save={save} now={now} />
        )}
      </div>
    </section>
  )
}

export function HomeScreen() {
  const save = useGame((s) => s.save)
  const now = useUi((s) => s.now)
  const [entering, setEntering] = useState(true)
  const [selected, setSelected] = useState<RoomSpotId | null>(null)
  const [decorate, setDecorate] = useState(false)
  const [misu, setMisu] = useState<{ hops: number; line: string | null }>({ hops: 0, line: null })
  const [hearts, setHearts] = useState<{ key: number; at: [number, number] }[]>([])
  const [pigeon, setPigeon] = useState<number | null>(null)
  const [note, setNote] = useState<{ key: number; text: string } | null>(null)

  const part = dayPart(new Date(now).getHours())
  const { level } = levelInfo(save.xp)
  const energy = Math.floor(currentEnergy(save, now))
  const owned = (category: string) =>
    Object.entries(save.collection).filter(([id, n]) => n > 0 && ITEM_BY_ID[id]?.category === category).map(([id]) => id)
  const books = owned('books').reduce((sum, id) => sum + save.collection[id], 0)
  const plushies = owned('plushies').map((id) => ITEM_BY_ID[id].emoji)
  const flowers = owned('flowers')

  // Tim nhỏ bay lên từ đồ đạc (giống view bay ra từ món đồ trong Tuber Simulator)
  useEffect(() => {
    if (entering) return
    const timer = setInterval(() => {
      const at = HEART_AT[pick(ROOM_SPOTS).id]
      const key = Date.now()
      setHearts((list) => [...list.slice(-3), { key, at }])
    }, HEART_EVERY_MS)
    return () => clearInterval(timer)
  }, [entering])

  // Bồ câu của Chằm Chằm thỉnh thoảng bay ngang phòng, ngậm thư
  useEffect(() => {
    if (entering) return
    const fly = () => setPigeon(Date.now())
    const first = setTimeout(fly, PIGEON_FIRST_MS)
    const again = setInterval(fly, PIGEON_EVERY_MS)
    return () => {
      clearTimeout(first)
      clearInterval(again)
    }
  }, [entering])
  useEffect(() => {
    if (pigeon === null) return
    const timer = setTimeout(() => setPigeon((p) => (p === pigeon ? null : p)), PIGEON_FLY_MS)
    return () => clearTimeout(timer)
  }, [pigeon])
  useEffect(() => {
    if (!note) return
    const timer = setTimeout(() => setNote((n) => (n?.key === note.key ? null : n)), 3200)
    return () => clearTimeout(timer)
  }, [note])

  const pickSpot = (id: RoomSpotId) => {
    playSfx('tap')
    setSelected((s) => (s === id ? null : id))
  }
  const tapMisu = () => {
    playSfx('boing')
    setMisu((m) => ({ hops: m.hops + 1, line: pick(ROOM_MISU_LINES) }))
  }
  const catchPigeon = () => {
    playSfx('sparkle')
    setPigeon(null)
    setNote({ key: Date.now(), text: pick(ROOM_PIGEON_NOTES) })
  }

  const stats = [
    { emoji: '💰', value: formatMoney(save.money), className: 'bg-butter' },
    { emoji: '⚡', value: String(energy), className: 'bg-hydrangea/70' },
    { emoji: '⭐', value: `Lv ${level}`, className: 'bg-lavender/80' },
  ]

  return (
    <>
      {entering && <DoorIntro onDone={() => setEntering(false)} />}
      <div className={`mx-auto max-w-md ${entering ? 'invisible' : 'animate-scene-in'}`}>
        <header className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-[30px] leading-none font-bold">{PLAYER_NAME}'s room</h1>
            <p className="mt-1 text-[14px] font-semibold text-plum-soft">Phú Nhuận · home sweet home</p>
          </div>
          <button
            type="button"
            aria-pressed={decorate}
            onClick={() => {
              playSfx('tap')
              setDecorate((d) => !d)
            }}
            className={`press shrink-0 rounded-full px-3.5 py-2 text-[14px] font-extrabold ring-1 ${
              decorate ? 'bg-peony ring-peony' : 'bg-white ring-petal'
            }`}
          >
            {decorate ? 'Done ✓' : 'Decorate ✏️'}
          </button>
        </header>

        {/* Bộ đếm kiểu Tuber Simulator: tiền, năng lượng, level */}
        <div className="mt-3 flex gap-2">
          {stats.map((s) => (
            <span key={s.emoji} className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-[14px] font-extrabold tabular-nums ${s.className}`}>
              <Sticker emoji={s.emoji} className="text-[16px]" />
              {s.value}
            </span>
          ))}
        </div>

        <div className="relative mt-3 overflow-hidden rounded-[32px] bg-paper shadow-float ring-4 ring-white">
          <svg viewBox={`0 0 ${ROOM_W} ${ROOM_H}`} className="block h-auto w-full" role="group" aria-label={`${PLAYER_NAME}'s room`}>
            <RoomShell />
            <RoomWindow part={part} />
            <RoomClock now={now} />
            <Spot id="shelf" selected={selected === 'shelf'} onPick={pickSpot}>
              <RoomShelf books={books} trinkets={trinketEmojis(save.collection)} />
            </Spot>
            <Spot id="computer" selected={selected === 'computer'} onPick={pickSpot}>
              <RoomDesk part={part} flowers={flowers} />
            </Spot>
            <Spot id="bed" selected={selected === 'bed'} onPick={pickSpot}>
              <RoomBed plushies={plushies} />
            </Spot>
            <RoomPlant x={30} />
            {save.pet ? <RoomPup mood={petMood(save.pet, now)} /> : <RoomPlant x={330} />}
            <Spot id="mat" selected={selected === 'mat'} onPick={pickSpot}>
              <RoomMat />
            </Spot>
            {/* Misu đứng giữa phòng, chạm thì nhún + nói */}
            <g role="button" tabIndex={0} aria-label={PLAYER_NAME} className="scene-spot" onClick={tapMisu}>
              <image
                key={misu.hops}
                href={ART.misu.full}
                x={142}
                y={226}
                width={86}
                height={173}
                className={`svg-self ${misu.hops > 0 ? 'animate-hop' : ''}`}
                style={{ filter: 'drop-shadow(0 6px 6px rgb(90 58 74 / 0.25))' }}
              />
            </g>
            {decorate && <DecorateGrid />}
            {/* Buổi tối: phòng tối đi một chút */}
            {part === 'night' && <rect width={ROOM_W} height={ROOM_H} fill={C.plum} opacity={0.14} pointerEvents="none" />}
          </svg>

          {/* Tim bay lên */}
          {hearts.map((h) => (
            <span
              key={h.key}
              aria-hidden
              className="pointer-events-none absolute -translate-x-1/2 animate-heart-rise"
              style={pct(h.at[0], h.at[1])}
              onAnimationEnd={() => setHearts((list) => list.filter((x) => x.key !== h.key))}
            >
              <Sticker emoji="💗" className="text-[18px]" />
            </span>
          ))}

          {/* Bồ câu đưa thư */}
          {pigeon !== null && (
            <button
              key={pigeon}
              type="button"
              onClick={catchPigeon}
              aria-label={`A note from ${HUSBAND_NAME}`}
              className="absolute top-[13%] animate-fly-across"
            >
              <span className="block animate-float">
                <Sticker emoji="🕊️" className="text-[30px]" />
                <Sticker emoji="💌" className="-ml-2 text-[16px]" />
              </span>
            </button>
          )}

          {/* Bong bóng lời Misu */}
          {misu.line && (
            <p
              key={misu.hops}
              className="pointer-events-none absolute w-max max-w-[50%] -translate-x-1/2 animate-pop-in rounded-[16px] rounded-bl-sm bg-paper px-3 py-1.5 text-[13px] font-extrabold shadow-float"
              style={pct(206, 196)}
            >
              {misu.line}
            </p>
          )}

          {/* Thư bồ câu mang tới */}
          {note && (
            <p
              key={note.key}
              role="status"
              className="absolute inset-x-6 top-3 animate-pop-in rounded-full bg-paper px-4 py-2 text-center text-[14px] font-extrabold shadow-float"
            >
              {note.text}
            </p>
          )}

          {decorate && (
            <p className="absolute inset-x-6 bottom-3 rounded-full bg-paper/95 px-4 py-2 text-center text-[13px] font-extrabold text-plum-soft shadow-float">
              ✏️ Moving furniture is coming soon
            </p>
          )}
        </div>

        <SpotCard id={selected} />
      </div>
    </>
  )
}
