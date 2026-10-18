import { useEffect, useRef } from 'react'
import { Sheet } from '../../components/Sheet.tsx'
import { Sticker } from '../../components/Sticker.tsx'
import { HUSBAND_NAME } from '../../config.ts'
import { DISTRICT_BY_ID, HOME_DISTRICT } from '../../data/districts.ts'
import { RIDE } from '../../data/economy.ts'
import { formatMoney } from '../../game/format.ts'
import { checkRide } from '../../game/rules.ts'
import { useGame } from '../../game/store.ts'
import { rideFare, rideKm, rideMinutes } from '../../game/travel.ts'
import type { DistrictId } from '../../game/types.ts'

// Đi xe Xanh SM giữa các quận: sheet xác nhận (quãng đường, giá) và màn "đang đi xe".

/** Màn đi xe chạy bao lâu rồi tự vào quận (chạm để bỏ qua) */
const RIDE_ANIM_MS = 2400

/** Màu xanh ngọc của xe Xanh SM: màu riêng của hình vẽ (giống màu lông cún), viền vẫn dùng màu mận */
const CAR_TEAL = '#5ECFD0'
const LINE = 'var(--color-plum)'

const placeName = (id: DistrictId) => (id === HOME_DISTRICT ? `${DISTRICT_BY_ID[id].name} (home)` : DISTRICT_BY_ID[id].name)

type RideSheetProps = {
  /** Quận muốn đi tới; null = đóng sheet */
  to: DistrictId | null
  onClose: () => void
  onBook: (to: DistrictId) => void
}

/** Sheet xác nhận cuốc xe: từ đâu tới đâu, bao xa, bao nhiêu tiền */
export function RideSheet({ to, onClose, onBook }: RideSheetProps) {
  const save = useGame((s) => s.save)
  const from = save.location

  return (
    <Sheet open={to !== null} onClose={onClose} labelledBy="ride-title">
      {to && <RideDetails from={from} to={to} money={save.money} ok={checkRide(save, to)} onBook={() => onBook(to)} />}
    </Sheet>
  )
}

type RideDetailsProps = {
  from: DistrictId
  to: DistrictId
  money: number
  ok: ReturnType<typeof checkRide>
  onBook: () => void
}

function RideDetails({ from, to, money, ok, onBook }: RideDetailsProps) {
  const fare = rideFare(from, to)
  const goingHome = to === HOME_DISTRICT
  return (
    <>
      <header className="flex items-center gap-3 pr-12">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-mint ring-4 ring-white">
          <Sticker emoji={RIDE.emoji} className="text-[30px]" />
        </span>
        <div>
          <h2 id="ride-title" className="font-display text-[26px] leading-none font-bold">
            {goingHome ? 'Ride home' : `Ride to ${DISTRICT_BY_ID[to].name}`}
          </h2>
          <p className="mt-1 text-[14px] font-semibold text-plum-soft">
            {RIDE.name} Car · about {rideMinutes(from, to)} min
          </p>
        </div>
      </header>

      <div className="mt-5 rounded-[24px] bg-white p-4 ring-1 ring-petal">
        <div className="flex items-center gap-3">
          <Sticker emoji="📍" className="text-[22px]" />
          <div>
            <p className="text-[12px] font-extrabold text-plum-soft">From</p>
            <p className="font-display text-[18px] leading-tight font-bold">{placeName(from)}</p>
          </div>
        </div>
        <div className="my-1 ml-[10px] flex items-center gap-4">
          <span aria-hidden className="h-7 border-l-[3px] border-dotted border-peony" />
          <span className="text-[13px] font-extrabold text-plum-soft">{rideKm(from, to)} km</span>
        </div>
        <div className="flex items-center gap-3">
          <Sticker emoji={goingHome ? '🏡' : DISTRICT_BY_ID[to].emoji} className="text-[22px]" />
          <div>
            <p className="text-[12px] font-extrabold text-plum-soft">To</p>
            <p className="font-display text-[18px] leading-tight font-bold">{placeName(to)}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-[24px] bg-butter/60 px-4 py-3">
        <div>
          <p className="text-[12px] font-extrabold text-plum-soft">Fare</p>
          <p className="font-display text-[24px] leading-none font-bold tabular-nums">{formatMoney(fare)}</p>
        </div>
        <p className="text-right text-[12px] font-bold text-plum-soft">
          In your wallet
          <br />
          <span className="tabular-nums">{formatMoney(money)}</span>
        </p>
      </div>

      <button
        type="button"
        disabled={!ok.ok}
        onClick={onBook}
        className="press mt-4 w-full rounded-full bg-peony py-3.5 font-display text-[18px] font-bold disabled:bg-petal disabled:text-plum-soft"
      >
        Book the ride {RIDE.emoji}
      </button>
      {!ok.ok && (
        <p className="mt-2 text-center text-[13px] font-bold text-plum-soft">
          {ok.icon} {ok.reason}. Ask {HUSBAND_NAME} for a little extra in Messages.
        </p>
      )}
    </>
  )
}

/** Xe Xanh SM nhìn ngang, đầu xe quay sang phải (khung 120 × 64) */
function XanhCar() {
  const thin = { stroke: LINE, strokeWidth: 2, strokeLinejoin: 'round' as const }
  return (
    <g>
      <rect x={50} y={1} width={20} height={7} rx={3} fill="#ffffff" {...thin} />
      <path d="M 24 30 C 30 12 42 7 58 7 L 76 7 C 88 7 97 14 104 30 Z" fill={CAR_TEAL} stroke={LINE} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M 33 28 C 37 17 44 13 57 13 L 60 13 L 60 28 Z" fill="var(--color-hydrangea)" {...thin} />
      <path d="M 65 13 L 76 13 C 85 13 91 19 95 28 L 65 28 Z" fill="var(--color-hydrangea)" {...thin} />
      <rect x={4} y={26} width={112} height={26} rx={11} fill={CAR_TEAL} stroke={LINE} strokeWidth={2.5} />
      <text x={60} y={40} fontSize={9} fontWeight={800} textAnchor="middle" dominantBaseline="central" fill="var(--color-paper)" className="font-display">
        Xanh SM
      </text>
      <circle cx={110} cy={34} r={3.5} fill="var(--color-butter)" {...thin} />
      <rect x={4} y={31} width={6} height={6} rx={2} fill="var(--color-peony)" {...thin} />
      {[30, 90].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={52} r={10} fill={LINE} />
          <circle cx={cx} cy={52} r={4} fill="#ffffff" />
        </g>
      ))}
    </g>
  )
}

/** Một dãy phố nền cho màn đi xe (vẽ 2 lần nối nhau để chạy vòng không thấy chỗ nối) */
function Skyline({ offset }: { offset: number }) {
  const blocks: [number, number, number, string][] = [
    [0, 38, 52, 'var(--color-lavender)'],
    [42, 30, 76, 'var(--color-hydrangea)'],
    [76, 44, 40, 'var(--color-petal)'],
    [124, 26, 92, 'var(--color-lavender)'],
    [154, 40, 58, 'var(--color-peach)'],
    [198, 34, 84, 'var(--color-hydrangea)'],
    [236, 46, 46, 'var(--color-butter)'],
    [286, 30, 70, 'var(--color-petal)'],
  ]
  return (
    <g transform={`translate(${offset} 0)`}>
      {blocks.map(([x, w, h, fill]) => (
        <rect key={x} x={x} y={112 - h} width={w} height={h} rx={5} fill={fill} />
      ))}
    </g>
  )
}

type RideOverlayProps = { from: DistrictId; to: DistrictId; onDone: () => void }

/** Màn "đang đi xe": phố chạy lùi, xe nảy nhẹ, thanh tiến trình; xong thì vào quận */
export function RideOverlay({ from, to, onDone }: RideOverlayProps) {
  const done = useRef(onDone)
  useEffect(() => {
    done.current = onDone
  }, [onDone])
  useEffect(() => {
    const timer = setTimeout(() => done.current(), RIDE_ANIM_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={onDone}
      className="paper-dots fixed inset-0 z-50 grid animate-fade-in place-items-center px-6"
    >
      <div className="w-full max-w-sm text-center">
        <p className="font-display text-[28px] leading-tight font-bold">
          {to === HOME_DISTRICT ? 'Heading home' : `On the way to ${DISTRICT_BY_ID[to].name}`}
        </p>
        <p className="mt-1 text-[15px] font-semibold text-plum-soft">
          {RIDE.name} · {DISTRICT_BY_ID[from].name} → {DISTRICT_BY_ID[to].name} · {rideKm(from, to)} km
        </p>

        <div className="mt-6 overflow-hidden rounded-[32px] bg-white ring-1 ring-petal">
          <svg viewBox="0 0 320 170" className="block h-auto w-full" aria-hidden>
            <rect width={320} height={112} fill="var(--color-petal)" opacity={0.5} />
            <g className="animate-skyline">
              <Skyline offset={0} />
              <Skyline offset={320} />
            </g>
            <rect y={112} width={320} height={58} fill="var(--color-plum-soft)" opacity={0.3} />
            <line
              x1={0}
              y1={146}
              x2={360}
              y2={146}
              stroke="#ffffff"
              strokeWidth={4}
              strokeDasharray="20 20"
              strokeLinecap="round"
              className="animate-road"
            />
            <g transform="translate(100 74)">
              <g className="animate-car-bob">
                <XanhCar />
              </g>
            </g>
          </svg>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-petal">
          <div className="h-full origin-left animate-grow-x rounded-full bg-peony" style={{ animationDuration: `${RIDE_ANIM_MS}ms` }} />
        </div>
        <p className="mt-4 text-[13px] font-bold text-plum-soft">Tap to skip</p>
      </div>
    </div>
  )
}
