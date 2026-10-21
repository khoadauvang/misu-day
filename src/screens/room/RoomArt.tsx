import { FlowerIcon } from '../../components/Flowers.tsx'
import { GoldenPup } from '../../components/GoldenPup.tsx'
import type { PetMood } from '../../game/pet.ts'
import { Emoji } from '../map/scenes/parts.tsx'
import { C, ink, thin } from '../map/scenes/geometry.ts'
import { FLOOR_Y, ROOM_H, ROOM_W, WALL_L, WALL_R, WALL_TOP, type DayPart } from './geometry.ts'

// Hình vẽ căn phòng (tab Home), nhìn thẳng như cắt ngang một ngôi nhà búp bê:
// tường sau + hai vách bên + sàn gỗ xa dần, đồ đạc đặt theo khung 360 × 440.
// Ý tưởng góc nhìn lấy từ PewDiePie's Tuber Simulator, nét vẽ thì giữ kiểu tròn trịa của game.

/** Đường sàn: điểm ở mép tường sau (t = 0..1) nối ra mép trước */
const floorLine = (t: number) => ({
  x1: WALL_L + t * (WALL_R - WALL_L),
  x2: t * ROOM_W,
})

/** Vỏ phòng: trần, tường giấy dán sọc, vách bên, sàn gỗ, dây đèn trang trí */
export function RoomShell() {
  return (
    <g>
      <defs>
        <pattern id="room-stripes" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill={C.petal} />
          <rect width="11" height="24" fill={C.paper} opacity={0.75} />
          <circle cx="17.5" cy="12" r="1.6" fill={C.peony} opacity={0.5} />
        </pattern>
      </defs>
      {/* trần */}
      <path d={`M 0 0 L ${ROOM_W} 0 L ${WALL_R} ${WALL_TOP} L ${WALL_L} ${WALL_TOP} Z`} fill={C.lavender} />
      {/* tường sau */}
      <rect x={WALL_L} y={WALL_TOP} width={WALL_R - WALL_L} height={FLOOR_Y - WALL_TOP} fill="url(#room-stripes)" />
      {/* hai vách bên, đậm hơn chút cho có chiều sâu */}
      <path d={`M 0 0 L ${WALL_L} ${WALL_TOP} L ${WALL_L} ${FLOOR_Y} L 0 ${ROOM_H} Z`} fill={C.peony} opacity={0.55} />
      <path d={`M ${ROOM_W} 0 L ${WALL_R} ${WALL_TOP} L ${WALL_R} ${FLOOR_Y} L ${ROOM_W} ${ROOM_H} Z`} fill={C.peony} opacity={0.55} />
      {/* sàn gỗ: các tấm ván chụm về phía tường sau */}
      <path d={`M ${WALL_L} ${FLOOR_Y} L ${WALL_R} ${FLOOR_Y} L ${ROOM_W} ${ROOM_H} L 0 ${ROOM_H} Z`} fill={C.peach} />
      {Array.from({ length: 9 }, (_, i) => {
        const { x1, x2 } = floorLine((i + 1) / 10)
        return <line key={i} x1={x1} y1={FLOOR_Y} x2={x2} y2={ROOM_H} stroke={C.peonyDeep} strokeWidth={1.2} opacity={0.22} />
      })}
      {[318, 352, 398].map((y) => (
        <line key={y} x1={0} y1={y} x2={ROOM_W} y2={y} stroke={C.peonyDeep} strokeWidth={1} opacity={0.14} />
      ))}
      {/* chân tường */}
      <rect x={WALL_L} y={FLOOR_Y - 9} width={WALL_R - WALL_L} height={9} fill={C.white} />
      <line x1={WALL_L} y1={FLOOR_Y} x2={WALL_R} y2={FLOOR_Y} {...thin} opacity={0.5} />
      {/* thảm tròn giữa phòng */}
      <ellipse cx={180} cy={372} rx={124} ry={30} fill={C.lavender} {...thin} />
      <ellipse cx={180} cy={372} rx={104} ry={22} fill="none" stroke={C.white} strokeWidth={3} strokeDasharray="2 8" strokeLinecap="round" />
      {/* dây đèn nhỏ dọc trần */}
      <path d={`M ${WALL_L + 4} 30 Q 110 54 180 34 Q 250 54 ${WALL_R - 4} 30`} fill="none" stroke={C.plumSoft} strokeWidth={1.4} />
      {[58, 92, 128, 162, 198, 232, 268, 302].map((x, i) => {
        const y = x < 180 ? 30 + Math.sin(((x - 38) / 142) * Math.PI) * 13 : 30 + Math.sin(((x - 180) / 142) * Math.PI) * 13
        const fill = [C.butter, C.peony, C.mint, C.hydrangea][i % 4]
        return <ellipse key={x} cx={x} cy={y + 6} rx={3.4} ry={4.6} fill={fill} {...thin} strokeWidth={1.2} />
      })}
    </g>
  )
}

const SKY: Record<DayPart, string> = { day: C.hydrangea, sunset: C.peach, night: C.plum }

/** Cửa sổ có rèm, trời đổi màu theo giờ trong game */
export function RoomWindow({ part }: { part: DayPart }) {
  return (
    <g>
      <rect x={58} y={66} width={86} height={96} rx={14} fill={SKY[part]} {...ink} />
      {part === 'night' ? (
        <>
          <circle cx={120} cy={88} r={10} fill={C.butter} />
          <circle cx={125} cy={84} r={9} fill={SKY.night} />
          {[
            [76, 84],
            [96, 104],
            [80, 128],
            [124, 124],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={1.6} fill={C.butter} />
          ))}
        </>
      ) : (
        <>
          <circle cx={118} cy={90} r={11} fill={C.butter} opacity={part === 'sunset' ? 1 : 0.9} />
          <path d="M 70 124 Q 70 114 80 114 Q 84 106 94 110 Q 104 108 104 118 Q 110 120 108 126 Z" fill={C.white} opacity={0.9} />
        </>
      )}
      {/* song cửa */}
      <line x1={101} y1={66} x2={101} y2={162} {...thin} />
      <line x1={58} y1={114} x2={144} y2={114} {...thin} />
      {/* bậu cửa + chậu cây nhỏ */}
      <rect x={52} y={160} width={98} height={9} rx={4} fill={C.white} {...thin} />
      <path d="M 66 160 L 68 148 L 82 148 L 84 160 Z" fill={C.peach} {...thin} />
      <Emoji x={75} y={142} size={14}>
        🌵
      </Emoji>
      {/* rèm hai bên + thanh treo */}
      <path d="M 48 60 Q 66 100 52 172 L 40 172 Q 44 110 40 60 Z" fill={C.peony} {...thin} />
      <path d="M 154 60 Q 136 100 150 172 L 162 172 Q 158 110 162 60 Z" fill={C.peony} {...thin} />
      <rect x={36} y={56} width={130} height={7} rx={3.5} fill={C.butter} {...thin} />
    </g>
  )
}

/** Đồng hồ treo tường chạy theo giờ trong game */
export function RoomClock({ now }: { now: number }) {
  const d = new Date(now)
  const hourDeg = ((d.getHours() % 12) + d.getMinutes() / 60) * 30
  const minDeg = d.getMinutes() * 6
  const cx = 176
  const cy = 92
  return (
    <g>
      <circle cx={cx} cy={cy} r={17} fill={C.white} {...ink} />
      <circle cx={cx} cy={cy} r={12.5} fill="none" stroke={C.petal} strokeWidth={3} />
      <line x1={cx} y1={cy} x2={cx} y2={cy - 7} {...ink} strokeWidth={2.6} transform={`rotate(${hourDeg} ${cx} ${cy})`} />
      <line x1={cx} y1={cy} x2={cx} y2={cy - 11} {...thin} transform={`rotate(${minDeg} ${cx} ${cy})`} />
      <circle cx={cx} cy={cy} r={2} fill={C.peonyDeep} />
    </g>
  )
}

/** Giường: đầu giường hồng tựa tường, nệm trắng, chăn hồng viền sóng, gối; gấu bông nếu có */
export function RoomBed({ plushies }: { plushies: string[] }) {
  return (
    <g>
      <path d="M 38 292 L 38 226 Q 38 206 58 206 L 150 206 Q 170 206 170 226 L 170 292 Z" fill={C.peony} {...ink} />
      <path d="M 54 226 Q 104 212 154 226" fill="none" stroke={C.white} strokeWidth={3} strokeLinecap="round" opacity={0.6} />
      <rect x={30} y={326} width={10} height={22} rx={4} fill={C.peonyDeep} {...thin} />
      <rect x={168} y={326} width={10} height={22} rx={4} fill={C.peonyDeep} {...thin} />
      <rect x={24} y={262} width={160} height={70} rx={18} fill={C.white} {...ink} />
      <rect x={46} y={248} width={58} height={28} rx={13} fill={C.paper} {...ink} />
      <rect x={108} y={252} width={50} height={24} rx={11} fill={C.lavender} {...thin} strokeWidth={2} />
      <path
        d="M 24 296 Q 34 286 44 296 Q 54 286 64 296 Q 74 286 84 296 Q 94 286 104 296 Q 114 286 124 296 Q 134 286 144 296 Q 154 286 164 296 Q 174 286 184 296 L 184 318 Q 184 336 166 336 L 42 336 Q 24 336 24 318 Z"
        fill={C.peony}
        {...ink}
      />
      {[54, 94, 134].map((x) => (
        <circle key={x} cx={x} cy={316} r={3} fill={C.white} opacity={0.75} />
      ))}
      {plushies.slice(0, 2).map((emoji, i) => (
        <Emoji key={i} x={140 + i * 26} y={264} size={22}>
          {emoji}
        </Emoji>
      ))}
    </g>
  )
}

/** Bàn làm việc + máy tính (Movie night), đèn bàn, lọ hoa (hoa Misu có), ghế đẩu */
export function RoomDesk({ part, flowers }: { part: DayPart; flowers: string[] }) {
  const screen = part === 'night' ? C.lavender : C.hydrangea
  return (
    <g>
      {/* màn hình */}
      <rect x={224} y={200} width={80} height={56} rx={10} fill={C.white} {...ink} />
      <rect x={231} y={206} width={66} height={42} rx={6} fill={screen} />
      <path d="M 258 218 L 274 227 L 258 236 Z" fill={C.white} stroke={C.white} strokeWidth={3} strokeLinejoin="round" />
      <rect x={258} y={256} width={12} height={10} fill={C.white} {...thin} />
      <rect x={246} y={264} width={36} height={6} rx={3} fill={C.white} {...thin} />
      {/* lọ hoa */}
      <path d="M 210 248 Q 204 262 212 270 L 228 270 Q 236 262 230 248 Z" fill={C.mint} {...thin} />
      {flowers.length > 0 ? (
        flowers.slice(0, 2).map((id, i) => (
          <svg key={id} x={198 + i * 18} y={210 + i * 4} width={26} height={30} viewBox="0 0 26 30" overflow="visible">
            <FlowerIcon id={id} />
          </svg>
        ))
      ) : (
        <Emoji x={220} y={238} size={18}>
          🌱
        </Emoji>
      )}
      {/* đèn bàn */}
      <path d="M 304 270 L 310 236" {...ink} />
      <path d="M 298 240 Q 310 218 324 240 Z" fill={C.butter} {...ink} />
      {part !== 'day' && <ellipse cx={311} cy={256} rx={22} ry={18} fill={C.butter} opacity={0.35} />}
      {/* mặt bàn + chân + ngăn kéo */}
      <rect x={196} y={268} width={134} height={12} rx={6} fill={C.butter} {...ink} />
      <rect x={202} y={280} width={9} height={60} rx={4} fill={C.butter} {...thin} />
      <rect x={290} y={280} width={34} height={46} rx={6} fill={C.butter} {...thin} strokeWidth={2} />
      <line x1={300} y1={300} x2={314} y2={300} {...thin} />
      {/* ghế đẩu */}
      <rect x={262} y={330} width={7} height={34} rx={3} fill={C.plumSoft} />
      <ellipse cx={265.5} cy={328} rx={22} ry={8} fill={C.peony} {...ink} />
    </g>
  )
}

/** Kệ sách treo tường: tầng trên là gáy sách đã mua, tầng dưới bày đồ sưu tập */
export function RoomShelf({ books, trinkets }: { books: number; trinkets: string[] }) {
  const spines = [C.peony, C.hydrangea, C.butter, C.mint, C.lavender, C.peach]
  return (
    <g>
      {/* gáy sách (ít nhất 0, tối đa 6) */}
      {Array.from({ length: Math.min(books, 6) }, (_, i) => (
        <rect key={i} x={214 + i * 13} y={i % 2 ? 98 : 94} width={11} height={i % 2 ? 26 : 30} rx={3} fill={spines[i]} {...thin} />
      ))}
      {books === 0 && (
        <text x={256} y={110} fontSize={9} fontWeight={800} textAnchor="middle" fill={C.plumSoft} className="font-display">
          no books yet
        </text>
      )}
      <rect x={206} y={124} width={106} height={8} rx={4} fill={C.white} {...ink} />
      {trinkets.slice(0, 4).map((emoji, i) => (
        <Emoji key={i} x={222 + i * 25} y={152} size={18}>
          {emoji}
        </Emoji>
      ))}
      <rect x={206} y={164} width={106} height={8} rx={4} fill={C.white} {...ink} />
      {[214, 304].map((x) => (
        <path key={x} d={`M ${x} 132 L ${x} 140 M ${x} 172 L ${x} 180`} {...thin} />
      ))}
    </g>
  )
}

/** Thảm tập yoga trải ở mép trước */
export function RoomMat() {
  return (
    <g>
      <path d="M 120 404 L 236 404 L 250 430 L 106 430 Z" fill={C.mint} {...ink} />
      <ellipse cx={243} cy={417} rx={9} ry={14} fill={C.mint} {...ink} />
      <path d="M 128 417 L 228 417" stroke={C.white} strokeWidth={2.5} strokeDasharray="6 7" strokeLinecap="round" />
    </g>
  )
}

/** Chậu cây lá to ở góc */
export function RoomPlant({ x }: { x: number }) {
  return (
    <g>
      {[
        'M 0 -40 Q -26 -60 -22 -82 Q 2 -70 0 -40 Z',
        'M 0 -40 Q 22 -66 34 -70 Q 30 -44 0 -40 Z',
        'M 0 -40 Q -30 -40 -36 -54 Q -12 -60 0 -40 Z',
        'M 0 -40 Q 4 -76 14 -90 Q 22 -64 0 -40 Z',
      ].map((d) => (
        <path key={d} d={d} transform={`translate(${x} 410)`} fill={C.mint} {...thin} strokeWidth={2} />
      ))}
      <path d={`M ${x - 18} 372 L ${x + 18} 372 L ${x + 13} 410 L ${x - 13} 410 Z`} fill={C.peach} {...ink} />
      <rect x={x - 21} y={366} width={42} height={9} rx={4} fill={C.peach} {...ink} />
    </g>
  )
}

/** Cún nằm ở góc phòng (nếu đã nhận nuôi) */
export function RoomPup({ mood }: { mood: PetMood }) {
  return (
    <svg x={262} y={344} width={92} height={92} viewBox="0 0 240 240" overflow="visible">
      <GoldenPup mood={mood} />
    </svg>
  )
}
