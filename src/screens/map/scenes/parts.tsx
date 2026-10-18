import type { KeyboardEvent, ReactNode } from 'react'
import { PLACE_BY_ID } from '../../../data/places.ts'
import { HOME_SPOT, useScene } from './context.ts'
import { BACK, C, FRONT, ink, ROAD_BOTTOM, SCENE_H, SCENE_W, thin } from './geometry.ts'

// Các "viên gạch" để vẽ cảnh quận kiểu hoạt hình 2D: trời, đường, tòa nhà, quán, cây, xe.
// Khung vẽ và màu ở geometry.ts. Mọi hình đặt theo góc dưới bên trái (x, chân nhà), cao lên phía trên. Màu lấy từ token trong src/index.css.

/** Emoji đặt trong SVG (căn giữa tại x, y) */
export function Emoji({ x, y, size = 20, children }: { x: number; y: number; size?: number; children: string }) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor="middle" dominantBaseline="central" aria-hidden>
      {children}
    </text>
  )
}

/** Chữ trong SVG bằng font tiêu đề */
export function Label({ x, y, size = 10, fill = C.plum, children }: { x: number; y: number; size?: number; fill?: string; children: string }) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight="800" textAnchor="middle" dominantBaseline="central" fill={fill} className="font-display" aria-hidden>
      {children}
    </text>
  )
}

// --- Trời, đất, đường ---

/** Bầu trời chuyển màu từ `top` xuống nền giấy, có mặt trời */
export function Sky({ top, sun = true }: { top: string; sun?: boolean }) {
  return (
    <>
      <defs>
        <linearGradient id="scene-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={C.paper} />
        </linearGradient>
      </defs>
      <rect width={SCENE_W} height={BACK} fill="url(#scene-sky)" />
      {sun && (
        <g>
          <circle cx={300} cy={46} r={30} fill={C.butter} opacity={0.5} />
          <circle cx={300} cy={46} r={20} fill={C.butter} {...thin} />
        </g>
      )}
    </>
  )
}

/** Đám mây trôi lơ lửng */
export function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="animate-float">
        <path d="M -26 8 C -34 8 -34 -4 -24 -4 C -22 -16 -6 -18 0 -8 C 6 -16 22 -14 22 -2 C 32 -2 32 8 24 8 Z" fill={C.white} {...thin} />
      </g>
    </g>
  )
}

/** Mặt đất + con đường có vạch kẻ + vỉa hè hai bên */
export function Ground({ front = C.petal }: { front?: string }) {
  return (
    <>
      <rect y={BACK - 6} width={SCENE_W} height={8} fill={C.petal} />
      <rect y={BACK} width={SCENE_W} height={ROAD_BOTTOM - BACK} fill={C.plumSoft} opacity={0.32} />
      <line x1={0} y1={BACK} x2={SCENE_W} y2={BACK} {...thin} />
      <line x1={-10} y1={(BACK + ROAD_BOTTOM) / 2} x2={SCENE_W + 10} y2={(BACK + ROAD_BOTTOM) / 2} stroke={C.white} strokeWidth={3} strokeDasharray="14 12" strokeLinecap="round" />
      <rect y={ROAD_BOTTOM} width={SCENE_W} height={FRONT - ROAD_BOTTOM} fill={C.paper} />
      <rect y={ROAD_BOTTOM} width={SCENE_W} height={16} fill={C.petal} />
      <line x1={0} y1={ROAD_BOTTOM} x2={SCENE_W} y2={ROAD_BOTTOM} {...thin} />
      <rect y={FRONT} width={SCENE_W} height={SCENE_H - FRONT} fill={front} />
      <line x1={0} y1={FRONT} x2={SCENE_W} y2={FRONT} {...thin} />
    </>
  )
}

/** Xe máy, taxi chạy ngang đường (emoji quay mặt sang trái nên chạy từ phải sang trái) */
export function Traffic({ vehicles = ['🛵', '🚕', '🛵', '🚌'] }: { vehicles?: string[] }) {
  const lanes = [BACK + 11, BACK + 33]
  return (
    <g aria-hidden>
      {vehicles.map((emoji, i) => (
        <text
          key={i}
          x={SCENE_W + 30}
          y={lanes[i % 2]}
          fontSize={i % 2 ? 22 : 18}
          dominantBaseline="central"
          className="animate-drive"
          style={{ animationDuration: `${8 + (i % 3) * 2.5}s`, animationDelay: `${-i * 2.7}s` }}
        >
          {emoji}
        </text>
      ))}
    </g>
  )
}

// --- Cây cối, đồ trang trí ---

export function Tree({ x, base = FRONT, s = 1, fill = C.mint }: { x: number; base?: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${base}) scale(${s})`}>
      <rect x={-3} y={-22} width={6} height={22} rx={3} fill={C.peach} {...thin} />
      <path d="M 0 -58 C 14 -58 22 -46 20 -36 C 26 -32 24 -20 14 -20 L -14 -20 C -24 -20 -26 -32 -20 -36 C -22 -46 -14 -58 0 -58 Z" fill={fill} {...ink} />
      <circle cx={-7} cy={-40} r={3} fill={C.white} opacity={0.7} />
    </g>
  )
}

export function Palm({ x, base = FRONT, s = 1 }: { x: number; base?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${base}) scale(${s})`}>
      <path d="M -2 0 C -2 -24 2 -44 6 -62 L 10 -62 C 7 -44 5 -24 5 0 Z" fill={C.peach} {...thin} />
      {[-150, -110, -60, -20, 20].map((angle) => (
        <path
          key={angle}
          d="M 0 0 C 10 -8 24 -8 34 0 C 24 -3 10 -3 0 0 Z"
          fill={C.mint}
          {...thin}
          transform={`translate(8 -62) rotate(${angle})`}
        />
      ))}
    </g>
  )
}

export function Bush({ x, base = FRONT, w = 30, fill = C.mint }: { x: number; base?: number; w?: number; fill?: string }) {
  return <path d={`M ${x} ${base} C ${x - 2} ${base - 16} ${x + w * 0.4} ${base - 20} ${x + w / 2} ${base - 12} C ${x + w * 0.6} ${base - 22} ${x + w + 2} ${base - 16} ${x + w} ${base} Z`} fill={fill} {...thin} />
}

export function Lamp({ x, base = FRONT }: { x: number; base?: number }) {
  return (
    <g>
      <line x1={x} y1={base} x2={x} y2={base - 46} {...ink} />
      <path d={`M ${x} ${base - 46} Q ${x} ${base - 54} ${x + 9} ${base - 52}`} fill="none" {...ink} />
      <circle cx={x + 10} cy={base - 49} r={4} fill={C.butter} {...thin} />
    </g>
  )
}

/** Dây đèn lồng đỏ giăng ngang (Chợ Lớn) */
export function Lanterns({ x1, x2, y, count = 5, sag = 14 }: { x1: number; x2: number; y: number; count?: number; sag?: number }) {
  const at = (t: number) => {
    // điểm trên đường cong võng xuống giữa
    const x = x1 + (x2 - x1) * t
    return [x, y + sag * 4 * t * (1 - t)] as const
  }
  return (
    <g>
      <path d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}`} fill="none" {...thin} />
      {Array.from({ length: count }, (_, i) => {
        const [x, ly] = at((i + 1) / (count + 1))
        return (
          <g key={i} className="svg-hang animate-sway" style={{ animationDelay: `${-i * 0.5}s` }}>
            <line x1={x} y1={ly} x2={x} y2={ly + 5} {...thin} />
            <ellipse cx={x} cy={ly + 12} rx={7} ry={8} fill={C.peonyDeep} {...thin} />
            <rect x={x - 4} y={ly + 3.5} width={8} height={2.5} rx={1} fill={C.butter} />
            <rect x={x - 4} y={ly + 18.5} width={8} height={2.5} rx={1} fill={C.butter} />
          </g>
        )
      })}
    </g>
  )
}

/** Cột điện và dây điện chằng chịt (phố local) */
export function Wires({ poles }: { poles: number[] }) {
  return (
    <g>
      {poles.map((x) => (
        <g key={x}>
          <rect x={x - 2.5} y={BACK - 120} width={5} height={120} rx={2} fill={C.plumSoft} {...thin} />
          <rect x={x - 10} y={BACK - 112} width={20} height={4} rx={2} fill={C.plumSoft} {...thin} />
        </g>
      ))}
      {poles.slice(1).map((x, i) => {
        const from = poles[i]
        return [0, 6, 13].map((dy) => (
          <path key={`${x}-${dy}`} d={`M ${from} ${BACK - 110 + dy} Q ${(from + x) / 2} ${BACK - 92 + dy * 1.4} ${x} ${BACK - 110 + dy}`} fill="none" stroke={C.plum} strokeWidth={1.2} opacity={0.75} />
        ))
      })}
    </g>
  )
}

/** Ghế nhựa đỏ xanh của quán vỉa hè */
export function Stool({ x, base = FRONT, fill = C.peony }: { x: number; base?: number; fill?: string }) {
  return (
    <g>
      <rect x={x} y={base - 12} width={12} height={4} rx={2} fill={fill} {...thin} />
      <line x1={x + 2} y1={base - 8} x2={x + 1} y2={base} {...thin} />
      <line x1={x + 10} y1={base - 8} x2={x + 11} y2={base} {...thin} />
    </g>
  )
}

// --- Tòa nhà phía sau ---

type GridProps = { x: number; top: number; w: number; h: number; fill?: string; cell?: number; row?: number }

/** Lưới cửa sổ bên trong một khối nhà */
function WindowGrid({ x, top, w, h, fill = C.white, cell = 14, row = 16 }: GridProps) {
  const cols = Math.max(1, Math.floor((w - 8) / cell))
  const rows = Math.max(1, Math.floor((h - 8) / row))
  const cw = (w - 8) / cols
  return (
    <g fill={fill} opacity={0.9}>
      {Array.from({ length: rows * cols }, (_, i) => {
        const c = i % cols
        const r = Math.floor(i / cols)
        return <rect key={i} x={x + 4 + c * cw + 2} y={top + 6 + r * row} width={cw - 4} height={row - 7} rx={2} />
      })}
    </g>
  )
}

type TowerProps = {
  x: number
  w: number
  h: number
  fill: string
  base?: number
  /** grid: cửa sổ ô vuông · bands: kính chạy ngang · fins: sọc dọc */
  facade?: 'grid' | 'bands' | 'fins'
  /** Mái: phẳng, ăng-ten, vương miện, vòm, vườn trên mái */
  roof?: 'flat' | 'spire' | 'crown' | 'dome' | 'garden'
  trim?: string
  /** Vẽ nhạt, không viền: tòa nhà xa phía sau làm nền */
  far?: boolean
}

export function Tower({ x, w, h, fill, base = BACK, facade = 'grid', roof = 'flat', trim = C.white, far = false }: TowerProps) {
  const top = base - h
  const line = far ? { stroke: 'none' } : ink
  return (
    <g opacity={far ? 0.55 : 1}>
      {roof === 'spire' && (
        <>
          <line x1={x + w / 2} y1={top} x2={x + w / 2} y2={top - 22} {...ink} />
          <circle cx={x + w / 2} cy={top - 24} r={3} fill={C.peony} {...thin} />
        </>
      )}
      {roof === 'crown' && <path d={`M ${x + 4} ${top} L ${x + w / 2} ${top - 18} L ${x + w - 4} ${top} Z`} fill={trim === C.white ? C.butter : trim} {...line} />}
      {roof === 'dome' && <path d={`M ${x + 3} ${top} C ${x + 3} ${top - w * 0.55} ${x + w - 3} ${top - w * 0.55} ${x + w - 3} ${top} Z`} fill={C.butter} {...line} />}
      {roof === 'garden' && (
        <>
          <Bush x={x + 4} base={top} w={w * 0.4} />
          <Bush x={x + w * 0.5} base={top} w={w * 0.44} />
        </>
      )}
      <rect x={x} y={top} width={w} height={h} rx={5} fill={fill} {...line} />
      {facade === 'grid' && <WindowGrid x={x} top={top} w={w} h={h - 6} fill={trim} />}
      {facade === 'bands' &&
        Array.from({ length: Math.floor((h - 10) / 13) }, (_, i) => (
          <rect key={i} x={x + 5} y={top + 7 + i * 13} width={w - 10} height={6} rx={3} fill={trim} opacity={0.8} />
        ))}
      {facade === 'fins' &&
        Array.from({ length: Math.floor((w - 6) / 10) }, (_, i) => (
          <rect key={i} x={x + 6 + i * 10} y={top + 6} width={4} height={h - 12} rx={2} fill={trim} opacity={0.8} />
        ))}
      {roof === 'garden' && !far && <rect x={x - 3} y={top - 2} width={w + 6} height={5} rx={2.5} fill={C.white} {...thin} />}
    </g>
  )
}

/** Bitexco: tháp thon dần, có sân đỗ trực thăng nhô ra (biểu tượng Quận 1) */
export function Bitexco({ x, w = 54, h = 196, base = BACK }: { x: number; w?: number; h?: number; base?: number }) {
  const top = base - h
  const padY = top + h * 0.24
  return (
    <g>
      <line x1={x + w * 0.5} y1={top + 2} x2={x + w * 0.5} y2={top - 18} {...ink} />
      <path
        d={`M ${x} ${base} C ${x + 2} ${base - h * 0.5} ${x + w * 0.2} ${top + 20} ${x + w * 0.36} ${top} L ${x + w * 0.64} ${top + 6} C ${x + w * 0.8} ${top + 30} ${x + w - 2} ${base - h * 0.5} ${x + w} ${base} Z`}
        fill={C.hydrangea}
        {...ink}
      />
      {Array.from({ length: 12 }, (_, i) => {
        const y = top + 16 + i * 14
        const inset = Math.max(4, 16 - i * 1.4)
        return <line key={i} x1={x + inset} y1={y} x2={x + w - inset} y2={y} stroke={C.white} strokeWidth={2.5} strokeLinecap="round" opacity={0.85} />
      })}
      <ellipse cx={x + w * 0.62} cy={padY} rx={w * 0.55} ry={6} fill={C.white} {...ink} />
      <Label x={x + w * 0.62} y={padY} size={7} fill={C.peonyDeep}>
        H
      </Label>
    </g>
  )
}

type TubeHouseProps = {
  x: number
  w?: number
  floors?: number
  fill: string
  base?: number
  /** Có thì tầng trệt là tiệm (mái hiên + đồ bày bán), không thì cửa cuốn */
  goods?: string
  awning?: string
}

/** Nhà ống nhiều tầng: ban công, chậu cây, bồn nước inox trên mái (phố Phú Nhuận) */
export function TubeHouse({ x, w = 46, floors = 3, fill, base = BACK, goods, awning = C.peony }: TubeHouseProps) {
  const floorH = 34
  const top = base - floors * floorH - 6
  return (
    <g>
      {/* bồn nước trên mái */}
      <rect x={x + w - 20} y={top - 16} width={14} height={12} rx={6} fill={C.white} {...thin} />
      <rect x={x + w - 18} y={top - 5} width={10} height={5} fill={C.plumSoft} />
      <rect x={x} y={top} width={w} height={base - top} rx={4} fill={fill} {...ink} />
      {Array.from({ length: floors }, (_, i) => {
        const fy = top + 6 + i * floorH
        const last = i === floors - 1
        return (
          <g key={i}>
            {last && goods ? (
              // tầng trệt mở tiệm: mái hiên sọc + đồ bày bán
              <>
                <rect x={x + 5} y={fy + 8} width={w - 10} height={floorH - 8} rx={3} fill={C.white} {...thin} />
                <rect x={x + 2} y={fy + 2} width={w - 4} height={8} rx={3} fill={awning} {...thin} />
                {Array.from({ length: Math.floor((w - 8) / 8) }, (_, k) => (
                  <rect key={k} x={x + 6 + k * 8} y={fy + 3.5} width={4} height={5} fill={C.white} opacity={0.85} />
                ))}
                <Emoji x={x + w / 2} y={fy + 22} size={14}>
                  {goods}
                </Emoji>
              </>
            ) : last ? (
              // tầng trệt: cửa cuốn
              <>
                <rect x={x + 6} y={fy + 4} width={w - 12} height={floorH - 4} rx={3} fill={C.white} {...thin} />
                {[0, 1, 2, 3].map((k) => (
                  <line key={k} x1={x + 8} y1={fy + 10 + k * 6} x2={x + w - 8} y2={fy + 10 + k * 6} stroke={C.plumSoft} strokeWidth={1} />
                ))}
              </>
            ) : (
              <>
                <rect x={x + 8} y={fy + 2} width={w - 16} height={17} rx={3} fill={C.white} {...thin} />
                <line x1={x + w / 2} y1={fy + 2} x2={x + w / 2} y2={fy + 19} {...thin} />
                {/* lan can ban công */}
                <rect x={x + 3} y={fy + 21} width={w - 6} height={6} rx={2} fill="none" {...thin} />
                <Emoji x={x + 10} y={fy + 18} size={9}>
                  🪴
                </Emoji>
              </>
            )}
          </g>
        )
      })}
    </g>
  )
}

/** Nhà kiểu Pháp: tường vàng, cửa chớp xanh, mái ngói (Quận 3) */
export function ColonialHouse({ x, w = 80, h = 96, fill = C.butter, base = BACK }: { x: number; w?: number; h?: number; fill?: string; base?: number }) {
  const top = base - h
  const cols = Math.max(2, Math.floor((w - 10) / 22))
  const cw = (w - 10) / cols
  return (
    <g>
      <path d={`M ${x - 6} ${top + 14} L ${x + 10} ${top - 6} L ${x + w - 10} ${top - 6} L ${x + w + 6} ${top + 14} Z`} fill={C.peach} {...ink} />
      <rect x={x} y={top + 14} width={w} height={h - 14} rx={4} fill={fill} {...ink} />
      {[0, 1].map((row) =>
        Array.from({ length: cols }, (_, c) => {
          const wx = x + 5 + c * cw + cw / 2
          const wy = top + 26 + row * 34
          return (
            <g key={`${row}-${c}`}>
              <path d={`M ${wx - 6} ${wy + 20} L ${wx - 6} ${wy + 4} Q ${wx} ${wy - 3} ${wx + 6} ${wy + 4} L ${wx + 6} ${wy + 20} Z`} fill={C.white} {...thin} />
              <rect x={wx - 11} y={wy + 2} width={4} height={18} rx={1.5} fill={C.mint} {...thin} />
              <rect x={wx + 7} y={wy + 2} width={4} height={18} rx={1.5} fill={C.mint} {...thin} />
            </g>
          )
        }),
      )}
    </g>
  )
}

/** Tòa nhà cổ điển có cột và mái tam giác (bảo tàng, thư viện) */
export function ClassicHall({ x, w = 110, h = 100, base = BACK, dome = false }: { x: number; w?: number; h?: number; base?: number; dome?: boolean }) {
  const top = base - h
  const cols = 5
  return (
    <g>
      {dome && <path d={`M ${x + w * 0.32} ${top - 10} C ${x + w * 0.32} ${top - 46} ${x + w * 0.68} ${top - 46} ${x + w * 0.68} ${top - 10} Z`} fill={C.mint} {...ink} />}
      <path d={`M ${x - 4} ${top + 18} L ${x + w / 2} ${top - 12} L ${x + w + 4} ${top + 18} Z`} fill={C.paper} {...ink} />
      <rect x={x} y={top + 18} width={w} height={h - 18} rx={3} fill={C.white} {...ink} />
      {Array.from({ length: cols }, (_, i) => (
        <rect key={i} x={x + 10 + i * ((w - 28) / (cols - 1))} y={top + 26} width={8} height={h - 36} rx={3} fill={C.paper} {...thin} />
      ))}
      <rect x={x - 4} y={base - 8} width={w + 8} height={8} rx={2} fill={C.petal} {...thin} />
    </g>
  )
}

/** Ngôi chùa nhiều tầng mái cong (Chợ Lớn) */
export function Pagoda({ x, w = 70, base = BACK }: { x: number; w?: number; base?: number }) {
  const tiers = [0, 1, 2]
  const tierH = 34
  return (
    <g>
      {tiers.map((i) => {
        const tw = w - i * 16
        const tx = x + (w - tw) / 2
        const ty = base - (i + 1) * tierH
        return (
          <g key={i}>
            <rect x={tx + 6} y={ty + 8} width={tw - 12} height={tierH - 8} rx={2} fill={C.peach} {...ink} />
            <rect x={tx + tw / 2 - 5} y={ty + 14} width={10} height={14} rx={5} fill={C.butter} {...thin} />
            <path d={`M ${tx - 8} ${ty + 4} Q ${tx + 2} ${ty + 12} ${tx + 10} ${ty + 8} L ${tx + tw - 10} ${ty + 8} Q ${tx + tw - 2} ${ty + 12} ${tx + tw + 8} ${ty + 4} L ${tx + tw - 6} ${ty - 4} L ${tx + 6} ${ty - 4} Z`} fill={C.peonyDeep} {...ink} />
          </g>
        )
      })}
      <line x1={x + w / 2} y1={base - 3 * tierH - 4} x2={x + w / 2} y2={base - 3 * tierH - 22} {...ink} />
      <circle cx={x + w / 2} cy={base - 3 * tierH - 22} r={3.5} fill={C.butter} {...thin} />
    </g>
  )
}

/** Cổng chào phố Tàu (cột đỏ, mái cong) */
export function ChinaGate({ x, w = 96, h = 92, base = BACK }: { x: number; w?: number; h?: number; base?: number }) {
  const top = base - h
  return (
    <g>
      <rect x={x + 8} y={top + 16} width={9} height={h - 16} rx={2} fill={C.peonyDeep} {...ink} />
      <rect x={x + w - 17} y={top + 16} width={9} height={h - 16} rx={2} fill={C.peonyDeep} {...ink} />
      <rect x={x + 4} y={top + 26} width={w - 8} height={12} rx={3} fill={C.butter} {...ink} />
      <path d={`M ${x - 8} ${top + 8} Q ${x + 4} ${top + 18} ${x + 14} ${top + 14} L ${x + w - 14} ${top + 14} Q ${x + w - 4} ${top + 18} ${x + w + 8} ${top + 8} L ${x + w - 10} ${top - 2} L ${x + 10} ${top - 2} Z`} fill={C.peonyDeep} {...ink} />
      <Label x={x + w / 2} y={top + 32} size={7.5}>
        CHỢ LỚN
      </Label>
    </g>
  )
}

/** Dãy nhà phố Tàu phía sau: tường hồng đào, mái ngói cong, đèn lồng */
export function ChineseRow({ x, w = 60, h = 80, fill = C.peach, base = BACK }: { x: number; w?: number; h?: number; fill?: string; base?: number }) {
  const top = base - h
  return (
    <g>
      <rect x={x} y={top + 8} width={w} height={h - 8} rx={3} fill={fill} {...ink} />
      <path d={`M ${x - 6} ${top + 10} Q ${x + 2} ${top + 14} ${x + 8} ${top + 8} L ${x + w - 8} ${top + 8} Q ${x + w - 2} ${top + 14} ${x + w + 6} ${top + 10} L ${x + w - 4} ${top} L ${x + 4} ${top} Z`} fill={C.peonyDeep} {...ink} />
      {[0, 1].map((r) => (
        <g key={r}>
          <rect x={x + 8} y={top + 18 + r * 26} width={w / 2 - 12} height={16} rx={3} fill={C.white} {...thin} />
          <rect x={x + w / 2 + 4} y={top + 18 + r * 26} width={w / 2 - 12} height={16} rx={3} fill={C.white} {...thin} />
        </g>
      ))}
    </g>
  )
}

/** Biệt thự nhà Misu (Phú Nhuận): mái hồng, cột trắng, ban công, cổng và vườn */
export function Villa({ x, w = 132, base = BACK }: { x: number; w?: number; base?: number }) {
  const h = 112
  const top = base - h
  const mid = x + w / 2
  return (
    <g>
      {/* hàng rào + cổng */}
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={x - 8 + i * ((w + 16) / 10.4)} y={base - 16} width={4} height={16} rx={2} fill={C.white} {...thin} />
      ))}
      {/* thân nhà hai tầng */}
      <rect x={x + 8} y={top + 30} width={w - 16} height={h - 30} rx={6} fill={C.white} {...ink} />
      {/* mái */}
      <path d={`M ${x - 4} ${top + 34} L ${mid} ${top} L ${x + w + 4} ${top + 34} Z`} fill={C.peony} {...ink} />
      <circle cx={mid} cy={top + 20} r={8} fill={C.white} {...thin} />
      <Emoji x={mid} y={top + 20.5} size={9}>
        💗
      </Emoji>
      {/* cửa sổ tầng trên + ban công */}
      {[x + 22, x + w - 44].map((wx) => (
        <g key={wx}>
          <path d={`M ${wx} ${top + 66} L ${wx} ${top + 48} Q ${wx + 11} ${top + 38} ${wx + 22} ${top + 48} L ${wx + 22} ${top + 66} Z`} fill={C.hydrangea} {...thin} />
          <line x1={wx + 11} y1={top + 43} x2={wx + 11} y2={top + 66} stroke={C.white} strokeWidth={1.5} />
        </g>
      ))}
      <rect x={x + 14} y={top + 66} width={w - 28} height={7} rx={3} fill={C.petal} {...thin} />
      {/* cột + cửa chính */}
      <rect x={mid - 26} y={top + 74} width={6} height={h - 74} rx={2} fill={C.paper} {...thin} />
      <rect x={mid + 20} y={top + 74} width={6} height={h - 74} rx={2} fill={C.paper} {...thin} />
      <path d={`M ${mid - 12} ${base} L ${mid - 12} ${top + 88} Q ${mid} ${top + 78} ${mid + 12} ${top + 88} L ${mid + 12} ${base} Z`} fill={C.peonyDeep} {...thin} />
      <circle cx={mid + 6} cy={base - 12} r={1.6} fill={C.butter} />
      <rect x={x + 18} y={top + 84} width={20} height={16} rx={3} fill={C.hydrangea} {...thin} />
      <rect x={x + w - 38} y={top + 84} width={20} height={16} rx={3} fill={C.hydrangea} {...thin} />
      {/* vườn hoa */}
      <Bush x={x - 6} base={base} w={28} />
      <Bush x={x + w - 22} base={base} w={28} />
      <Emoji x={x + 4} y={base - 14} size={9}>
        🌷
      </Emoji>
      <Emoji x={x + w - 6} y={base - 14} size={9}>
        🌸
      </Emoji>
    </g>
  )
}

type CampusProps = { x: number; w?: number; h?: number; base?: number }

/** RMIT Nam Sài Gòn: khối nhà trắng hiện đại, sảnh kính, bảng đỏ RMIT, cột cờ */
export function RmitCampus({ x, w = 156, h = 120, base = BACK }: CampusProps) {
  const top = base - h
  return (
    <g>
      <line x1={x + w - 6} y1={base} x2={x + w - 6} y2={top - 30} {...ink} />
      <path d={`M ${x + w - 6} ${top - 30} L ${x + w + 14} ${top - 24} L ${x + w - 6} ${top - 18} Z`} fill={C.peonyDeep} {...thin} />
      {/* khối chính */}
      <rect x={x} y={top + 14} width={w * 0.62} height={h - 14} rx={5} fill={C.white} {...ink} />
      <WindowGrid x={x} top={top + 34} w={w * 0.62} h={h - 50} fill={C.hydrangea} cell={13} row={15} />
      {/* khối cao bên phải */}
      <rect x={x + w * 0.58} y={top} width={w * 0.36} height={h} rx={5} fill={C.paper} {...ink} />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={x + w * 0.58 + 6} y={top + 10 + i * 16} width={w * 0.36 - 12} height={8} rx={4} fill={C.hydrangea} opacity={0.85} />
      ))}
      {/* bảng RMIT */}
      <rect x={x + 10} y={top + 18} width={56} height={14} rx={4} fill={C.peonyDeep} {...thin} />
      <Label x={x + 38} y={top + 25.5} size={10} fill={C.paper}>
        RMIT
      </Label>
      {/* sảnh kính */}
      <rect x={x + 26} y={base - 30} width={44} height={30} rx={4} fill={C.hydrangea} {...thin} />
      <line x1={x + 48} y1={base - 30} x2={x + 48} y2={base} stroke={C.white} strokeWidth={1.5} />
    </g>
  )
}

/** FPT University: khối gạch cam ấm, lam chắn nắng xanh, vườn trên mái, logo 3 ô màu */
export function FptCampus({ x, w = 160, h = 112, base = BACK }: CampusProps) {
  const top = base - h
  const blocks: [string, string][] = [
    [C.hydrangea, 'F'],
    [C.peach, 'P'],
    [C.mint, 'T'],
  ]
  return (
    <g>
      <Tree x={x + 18} base={top + 24} s={0.5} />
      <Tree x={x + w * 0.42} base={top + 24} s={0.55} />
      <rect x={x} y={top + 24} width={w * 0.7} height={h - 24} rx={6} fill={C.peach} {...ink} />
      {Array.from({ length: Math.floor((w * 0.7 - 12) / 12) }, (_, i) => (
        <rect key={i} x={x + 8 + i * 12} y={top + 34} width={5} height={h - 48} rx={2.5} fill={C.mint} {...thin} />
      ))}
      <rect x={x - 3} y={top + 21} width={w * 0.7 + 6} height={6} rx={3} fill={C.mint} {...thin} />
      {/* khối tròn bên phải */}
      <path d={`M ${x + w * 0.66} ${base} L ${x + w * 0.66} ${top + 20} Q ${x + w * 0.83} ${top - 6} ${x + w} ${top + 20} L ${x + w} ${base} Z`} fill={C.white} {...ink} />
      {blocks.map(([fill, letter], i) => (
        <g key={letter}>
          <rect x={x + w * 0.69 + i * 15} y={top + 30} width={13} height={13} rx={3} fill={fill} {...thin} />
          <Label x={x + w * 0.69 + i * 15 + 6.5} y={top + 37} size={9}>
            {letter}
          </Label>
        </g>
      ))}
      <rect x={x + w * 0.72} y={top + 52} width={w * 0.24} height={base - top - 52} rx={4} fill={C.hydrangea} {...thin} />
    </g>
  )
}

/** Sân khấu ngoài trời: vòm, đèn rọi, loa (Concert Park) */
export function Stage({ x, w = 120, h = 100, base = BACK }: CampusProps) {
  const top = base - h
  return (
    <g>
      <path d={`M ${x + 24} ${top + 22} L ${x + 4} ${base - 20} L ${x + 44} ${base - 20} Z`} fill={C.butter} opacity={0.55} />
      <path d={`M ${x + w - 24} ${top + 22} L ${x + w - 44} ${base - 20} L ${x + w - 4} ${base - 20} Z`} fill={C.butter} opacity={0.55} />
      <path d={`M ${x} ${base - 18} L ${x} ${top + 30} Q ${x + w / 2} ${top - 10} ${x + w} ${top + 30} L ${x + w} ${base - 18}`} fill="none" stroke={C.plum} strokeWidth={7} strokeLinecap="round" />
      <path d={`M ${x} ${base - 18} L ${x} ${top + 30} Q ${x + w / 2} ${top - 10} ${x + w} ${top + 30} L ${x + w} ${base - 18}`} fill="none" stroke={C.peony} strokeWidth={3.5} strokeLinecap="round" />
      <rect x={x - 6} y={base - 20} width={w + 12} height={20} rx={4} fill={C.lavender} {...ink} />
      <rect x={x + 6} y={base - 46} width={14} height={26} rx={3} fill={C.plumSoft} {...thin} />
      <rect x={x + w - 20} y={base - 46} width={14} height={26} rx={3} fill={C.plumSoft} {...thin} />
      <Emoji x={x + w / 2} y={top + 40} size={18}>
        🎤
      </Emoji>
      <Emoji x={x + 34} y={top + 28} size={11}>
        🎵
      </Emoji>
      <Emoji x={x + w - 34} y={top + 34} size={11}>
        🎶
      </Emoji>
    </g>
  )
}

/** Dây đèn bóng tròn giăng võng (quán bar, công viên) */
export function StringLights({ x1, x2, y, sag = 10, count = 8 }: { x1: number; x2: number; y: number; sag?: number; count?: number }) {
  return (
    <g>
      <path d={`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}`} fill="none" {...thin} />
      {Array.from({ length: count }, (_, i) => {
        const t = (i + 0.5) / count
        return <circle key={i} cx={x1 + (x2 - x1) * t} cy={y + sag * 4 * t * (1 - t) + 3} r={3} fill={i % 2 ? C.butter : C.peony} {...thin} />
      })}
    </g>
  )
}

// --- Quán phía trước ---

type ShopProps = {
  x: number
  w: number
  h?: number
  wall: string
  awning: string
  /** Emoji bày trong tủ kính */
  goods?: string
  base?: number
}

/** Mái hiên sọc có viền lượn sóng */
function Awning({ x, w, y, color }: { x: number; w: number; y: number; color: string }) {
  const stripes = Math.ceil(w / 14)
  return (
    <g>
      <rect x={x - 3} y={y} width={w + 6} height={13} rx={3} fill={color} {...thin} />
      {Array.from({ length: stripes }, (_, i) => {
        const sx = x + 4 + i * 14
        const sw = Math.min(7, x + w - sx)
        return sw > 0 ? <rect key={i} x={sx} y={y + 1.5} width={sw} height={10} fill={C.white} opacity={0.85} /> : null
      })}
      {Array.from({ length: Math.ceil((w + 6) / 10) }, (_, i) => (
        <circle key={i} cx={x + 2 + i * 10} cy={y + 13} r={4.5} fill={i % 2 ? C.white : color} {...thin} />
      ))}
    </g>
  )
}

/** Cửa hàng mặt phố: biển trên đầu (do Spot vẽ), mái hiên sọc, tủ kính bày đồ, cửa ra vào */
export function Shop({ x, w, h = 96, wall, awning, goods, base = FRONT }: ShopProps) {
  const top = base - h
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} rx={8} fill={wall} {...ink} />
      <Awning x={x} w={w} y={top + 26} color={awning} />
      <rect x={x + 8} y={top + 46} width={w - 40} height={h - 52} rx={5} fill={C.white} {...thin} />
      {goods && (
        <Emoji x={x + 8 + (w - 40) / 2} y={top + 46 + (h - 52) / 2} size={Math.min(24, (w - 40) * 0.6)}>
          {goods}
        </Emoji>
      )}
      <path d={`M ${x + w - 26} ${base} L ${x + w - 26} ${top + 52} Q ${x + w - 17} ${top + 46} ${x + w - 8} ${top + 52} L ${x + w - 8} ${base} Z`} fill={C.white} {...thin} />
      <circle cx={x + w - 12} cy={base - 18} r={1.6} fill={C.plum} />
    </g>
  )
}

/** Quán phố Tàu: tường đỏ, mái ngói cong vểnh, đèn lồng, cửa tròn */
export function ChineseShop({ x, w, h = 96, wall = C.peach, goods, base = FRONT }: Omit<ShopProps, 'awning' | 'wall'> & { wall?: string }) {
  const top = base - h
  return (
    <g>
      <rect x={x} y={top + 14} width={w} height={h - 14} rx={4} fill={wall} {...ink} />
      <path d={`M ${x - 8} ${top + 18} Q ${x + 2} ${top + 24} ${x + 10} ${top + 14} L ${x + w - 10} ${top + 14} Q ${x + w - 2} ${top + 24} ${x + w + 8} ${top + 18} L ${x + w - 6} ${top + 2} L ${x + 6} ${top + 2} Z`} fill={C.peonyDeep} {...ink} />
      {[x + 10, x + w - 10].map((lx) => (
        <g key={lx} className="svg-hang animate-sway">
          <line x1={lx} y1={top + 20} x2={lx} y2={top + 32} {...thin} />
          <ellipse cx={lx} cy={top + 38} rx={6} ry={7} fill={C.peonyDeep} {...thin} />
        </g>
      ))}
      <rect x={x + 22} y={top + 46} width={w - 44} height={h - 64} rx={5} fill={C.white} {...thin} />
      {goods && (
        <Emoji x={x + w / 2} y={top + 46 + (h - 64) / 2} size={20}>
          {goods}
        </Emoji>
      )}
      <rect x={x + 12} y={base - 14} width={w - 24} height={14} rx={3} fill={C.butter} {...thin} />
    </g>
  )
}

/** Rạp phim: bảng đèn chạy chữ CINEMA, poster, cửa kính */
export function Cinema({ x, w = 124, h = 98, base = FRONT }: { x: number; w?: number; h?: number; base?: number }) {
  const top = base - h
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} rx={8} fill={C.lavender} {...ink} />
      <rect x={x + 8} y={top + 26} width={w - 16} height={20} rx={5} fill={C.plum} {...thin} />
      {Array.from({ length: Math.floor((w - 20) / 8) }, (_, i) => (
        <circle key={i} cx={x + 14 + i * 8} cy={top + 26} r={1.8} fill={C.butter} />
      ))}
      <Label x={x + w / 2} y={top + 37} size={10} fill={C.butter}>
        CINEMA
      </Label>
      <rect x={x + 10} y={top + 54} width={22} height={30} rx={3} fill={C.peony} {...thin} />
      <Emoji x={x + 21} y={top + 69} size={12}>
        💕
      </Emoji>
      <rect x={x + w - 32} y={top + 54} width={22} height={30} rx={3} fill={C.hydrangea} {...thin} />
      <Emoji x={x + w - 21} y={top + 69} size={12}>
        🍿
      </Emoji>
      <rect x={x + w / 2 - 18} y={base - 40} width={36} height={40} rx={4} fill={C.white} {...thin} />
      <line x1={x + w / 2} y1={base - 40} x2={x + w / 2} y2={base} {...thin} />
    </g>
  )
}

/** Xe đẩy bán đồ ăn vặt + dù che (vỉa hè) */
export function Stall({ x, w = 64, goods, umbrella = C.peony, base = FRONT }: { x: number; w?: number; goods: string; umbrella?: string; base?: number }) {
  const mid = x + w / 2
  return (
    <g>
      <line x1={mid} y1={base - 34} x2={mid} y2={base - 82} {...ink} />
      <path d={`M ${x - 10} ${base - 76} Q ${mid} ${base - 108} ${x + w + 10} ${base - 76} Z`} fill={umbrella} {...ink} />
      <path d={`M ${mid} ${base - 92} L ${mid - 12} ${base - 76} M ${mid} ${base - 92} L ${mid + 12} ${base - 76}`} stroke={C.white} strokeWidth={2} />
      <rect x={x} y={base - 40} width={w} height={26} rx={5} fill={C.white} {...ink} />
      <rect x={x + 4} y={base - 36} width={w - 8} height={8} rx={3} fill={C.butter} />
      <Emoji x={mid} y={base - 50} size={18}>
        {goods}
      </Emoji>
      <circle cx={x + 10} cy={base - 8} r={7} fill={C.white} {...ink} />
      <circle cx={x + w - 10} cy={base - 8} r={7} fill={C.white} {...ink} />
    </g>
  )
}

// --- Chỗ chạm được: tòa nhà gắn với một địa điểm ---

/** Ước lượng bề rộng chữ (SVG không tự đo được trước khi vẽ) */
function textWidth(text: string, size: number): number {
  let width = 0
  let joined = false
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0
    // Emoji ghép (💆‍♀️): ký tự nối ZWJ, ký tự sau nó và FE0F không chiếm thêm chỗ
    if (code === 0x200d) joined = true
    else if (joined || code === 0xfe0f) joined = false
    else width += code > 0x2000 ? size * 1.25 : size * 0.58
  }
  return width
}

function Sign({ x, y, text, note }: { x: number; y: number; text: string; note?: string }) {
  const w = textWidth(text, 10) + 16
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className="scene-sign" x={-w / 2} y={-10} width={w} height={20} rx={10} fill={C.white} stroke={C.plum} strokeWidth={2} />
      <Label x={0} y={0.5}>
        {text}
      </Label>
      {note && (
        <g transform="translate(0 17)">
          <rect x={-(textWidth(note, 8.5) + 12) / 2} y={-7.5} width={textWidth(note, 8.5) + 12} height={15} rx={7.5} fill={C.butter} stroke={C.plum} strokeWidth={1.4} />
          <Label x={0} y={0.5} size={8.5}>
            {note}
          </Label>
        </g>
      )}
    </g>
  )
}

type SpotProps = {
  /** id địa điểm trong places.ts, hoặc HOME_SPOT */
  id: string
  /** Chữ ngắn trên biển hiệu (tên đầy đủ hiện trong sheet) */
  label: string
  /** Vị trí tâm biển hiệu */
  sign: [number, number]
  children: ReactNode
}

/** Tòa nhà chạm được: biển hiệu + nhãn khóa / đóng cửa, chạm thì mở địa điểm */
export function Spot({ id, label, sign, children }: SpotProps) {
  const { pick, status } = useScene()
  const home = id === HOME_SPOT
  const place = home ? undefined : PLACE_BY_ID[id]
  const s = place ? status(id) : { locked: false, closed: false, unlockLevel: 1 }
  const note = s.locked ? `🔒 Lv ${s.unlockLevel}` : s.closed ? '💤 Closed' : undefined
  const name = home ? label : (place?.name ?? label)
  const spoken = s.locked ? `${name}, opens at Level ${s.unlockLevel}` : s.closed ? `${name}, closed now` : name
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      pick(id)
    }
  }

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={spoken}
      className="scene-spot"
      onClick={() => pick(id)}
      onKeyDown={onKey}
    >
      <g opacity={s.locked ? 0.6 : 1}>{children}</g>
      <Sign x={sign[0]} y={sign[1]} text={`${home ? '🏡' : (place?.emoji ?? '')} ${label}`} note={note} />
    </g>
  )
}
