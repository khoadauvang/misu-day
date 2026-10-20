import type { ReactNode } from 'react'

// Hoa vẽ bằng SVG cho quà 20/10 và Collection.
// - <FlowerIcon id>: một bông (hoặc một nhành) để làm sticker
// - <Bouquet id>: cả bó hoa của loài đó, mỗi loài một kiểu gói riêng
// Mỗi bông vẽ quanh điểm (0, 0), rộng khoảng 44 đơn vị. Màu cánh hoa, giấy gói là màu riêng của hình vẽ;
// viền dùng màu plum của game. id trùng với id hoa trong src/data/items.ts.

const LINE = 'var(--color-plum)'
const STEM = '#6FA56F'
const LEAF = '#86BF7F'
const LEAF_DARK = '#5E9A62'
const outline = { stroke: LINE, strokeWidth: 1.6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

/* ---------- Từng loài hoa ---------- */

/** Hồng đỏ: cánh sau sẫm, bầu cánh ôm, nụ xoáy ốc ở giữa */
function Rose() {
  const base = '#D7344C'
  const dark = '#A81E37'
  return (
    <g {...outline}>
      <path d="M-19 -2 C-22 -16 -10 -23 0 -21 C10 -23 22 -16 19 -2 Z" fill={dark} />
      <path d="M-20 -4 C-22 12 -11 21 0 21 C11 21 22 12 20 -4 C14 2 7 4 0 4 C-7 4 -14 2 -20 -4 Z" fill={base} />
      <ellipse cx="0" cy="-5" rx="12.5" ry="9.5" fill={base} />
      <path d="M-1 -7 C-5 -7 -5 -2 0 -2 C6 -2 7 -10 0 -12 C-8 -13 -12 -6 -9 0" fill="none" stroke={dark} />
      <path d="M-20 -4 C-16 10 -6 13 2 10" fill="none" stroke={dark} />
      <path d="M20 -4 C17 8 10 12 4 13" fill="none" stroke={dark} />
      <path d="M-14 7 C-12 12 -8 15 -4 16" fill="none" stroke="#EE7386" strokeWidth={2} />
    </g>
  )
}

/** Tulip hồng: chiếc cốc khép, hai cánh bên nhọn + cánh trước, cánh sau ló lên */
function Tulip() {
  const side = '#F27BA3'
  const front = '#F795B6'
  const dark = '#D24E7E'
  return (
    <g {...outline}>
      <path d="M-7 -6 C-6 -16 -2 -22 0 -24 C2 -22 6 -16 7 -6 Z" fill={dark} />
      <path d="M-15 -17 C-17 2 -11 18 0 18 C11 18 17 2 15 -17 C9 -12 4 -6 0 -4 C-4 -6 -9 -12 -15 -17 Z" fill={side} />
      <path d="M-9 -4 C-9 -12 -3 -17 0 -19 C3 -17 9 -12 9 -4 C9 8 5 15 0 18 C-5 15 -9 8 -9 -4 Z" fill={front} />
      <path d="M-4 -8 C-5 0 -4 7 -2 11" fill="none" stroke="#FFD0DE" strokeWidth={2} />
    </g>
  )
}

/** Một nhành oải hương: các vòng nụ tím xếp dọc thân, nhỏ dần lên ngọn */
function Lavender() {
  const colors = ['#8A6CC9', '#9E83DA', '#B39BE6']
  return (
    <g>
      <path d="M0 30 L0 -30" stroke="#8FA88A" strokeWidth={1.6} strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => {
        const y = 24 - i * 6.6
        const r = 4.6 - i * 0.3
        const fill = colors[i % 3]
        return (
          <g key={i} {...outline} strokeWidth={1.1} fill={fill}>
            <ellipse cx={-r * 0.95} cy={y} rx={r} ry={r * 0.72} transform={`rotate(-28 ${-r * 0.95} ${y})`} />
            <ellipse cx={r * 0.95} cy={y} rx={r} ry={r * 0.72} transform={`rotate(28 ${r * 0.95} ${y})`} />
            <ellipse cx="0" cy={y - 1.5} rx={r * 0.8} ry={r * 0.85} />
          </g>
        )
      })}
    </g>
  )
}

/** Vị trí các bông nhỏ trong một quả cẩm tú cầu */
const HYDRANGEA_FLORETS: [number, number][] = [
  [-5, -15], [5, -15], [-13, -8], [-4, -7], [5, -8], [14, -7], [-17, 1], [-8, 0], [1, 0],
  [10, 1], [17, 2], [-12, 9], [-3, 9], [6, 9], [14, 10], [-6, 16], [4, 17],
]

const HYDRANGEA_TINTS = {
  blue: { ball: '#9DB1F0', petals: ['#B6C5F6', '#A3B6F2', '#C3CEF8'], eye: '#6E80D2' },
  purple: { ball: '#B7A2E6', petals: ['#C9B6F0', '#B9A3E8', '#D6C7F4'], eye: '#8467C4' },
}

/** Cẩm tú cầu: một quả tròn to ghép từ nhiều bông nhỏ 4 cánh */
function Hydrangea({ tint = 'blue' }: { tint?: keyof typeof HYDRANGEA_TINTS }) {
  const c = HYDRANGEA_TINTS[tint]
  return (
    <g>
      <circle r="21" fill={c.ball} {...outline} />
      {HYDRANGEA_FLORETS.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${i * 23})`}>
          {[0, 90, 180, 270].map((a) => (
            <ellipse
              key={a}
              cx="0"
              cy="-3.2"
              rx="2.9"
              ry="3.4"
              transform={`rotate(${a})`}
              fill={c.petals[i % 3]}
              stroke={c.eye}
              strokeWidth={0.7}
            />
          ))}
          <circle r="1.1" fill={c.eye} />
        </g>
      ))}
    </g>
  )
}

/** Vị trí các bông li ti của một nhánh baby's breath (r nhỏ là nụ) */
const BABY_DOTS: [number, number, number][] = [
  [0, -14, 3.2], [-8, -10, 2.6], [8, -11, 3.2], [-14, -3, 3.2], [-4, -4, 2.4], [5, -3, 3.2],
  [14, -4, 2.6], [-10, 4, 3.2], [0, 4, 3.2], [10, 5, 2.4], [-5, 11, 2.6], [6, 12, 3.2], [-16, 9, 2.4], [17, 7, 3],
]

/** Baby's breath: nhánh mảnh chia nhiều ngả, đầu mỗi ngả một bông trắng li ti */
function BabysBreath() {
  return (
    <g>
      <g stroke={STEM} strokeWidth={0.9} strokeLinecap="round" fill="none">
        <path d="M0 24 L0 8" />
        {BABY_DOTS.map(([x, y], i) => (
          <path key={i} d={`M0 ${i % 2 ? 8 : 14} L${x} ${y}`} />
        ))}
      </g>
      {BABY_DOTS.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#FFFFFF" stroke="#CDB6C1" strokeWidth={0.9} />
          {r > 2.5 && <circle cx={x} cy={y} r="0.9" fill="#EBD9A8" />}
        </g>
      ))}
    </g>
  )
}

/** Mẫu đơn hồng: một vòng cánh to gợn sóng, lớp cánh xù ôm vào giữa, nhụy vàng ló ra */
function Peony() {
  const dark = '#E07197'
  const base = '#F49AB8'
  const light = '#FBCADA'
  return (
    <g {...outline}>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2
        return <circle key={i} cx={Math.cos(a) * 12} cy={Math.sin(a) * 12} r="10" fill={dark} />
      })}
      <circle r="15.5" fill={base} />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + 0.3
        return <circle key={i} cx={Math.cos(a) * 7.5} cy={Math.sin(a) * 7.5 - 1} r="7" fill={base} />
      })}
      <circle cy="-1" r="6.5" fill={light} />
      <circle cx="-2" cy="-2" r="1.5" fill="#F4C64E" strokeWidth={0.8} />
      <circle cx="2" cy="-1" r="1.5" fill="#F4C64E" strokeWidth={0.8} />
      <circle cx="0" cy="1.5" r="1.5" fill="#F4C64E" strokeWidth={0.8} />
      <path d="M-15 5 C-10 15 10 15 15 5 C10 10 -10 10 -15 5 Z" fill={base} />
      <path d="M-9 -9 C-6 -12 -2 -13 1 -12" fill="none" stroke={light} strokeWidth={2} />
    </g>
  )
}

/** Nụ mẫu đơn tròn với đài xanh */
function PeonyBud() {
  return (
    <g {...outline}>
      <circle cy="-2" r="9" fill="#E07197" />
      <path d="M-9 0 C-6 9 6 9 9 0 C5 4 -5 4 -9 0 Z" fill={LEAF} />
      <path d="M-3 -8 C-1 -10 2 -10 4 -8" fill="none" stroke="#FBCADA" strokeWidth={1.8} />
    </g>
  )
}

const HEADS: Record<string, () => ReactNode> = {
  roses: Rose,
  tulips: Tulip,
  lavender: Lavender,
  hydrangeas: () => <Hydrangea />,
  'babys-breath': BabysBreath,
  peonies: Peony,
}

/* ---------- Lá ---------- */

/** Lá bầu (hướng lên trên, gốc ở 0,0) */
function Leaf({ x, y, r, s = 1 }: { x: number; y: number; r: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} {...outline}>
      <path d="M0 0 C-9 -8 -10 -22 0 -32 C10 -22 9 -8 0 0 Z" fill={LEAF} />
      <path d="M0 -3 L0 -27" fill="none" stroke={LEAF_DARK} strokeWidth={1.2} />
    </g>
  )
}

/** Lá dài như lưỡi kiếm (tulip) */
function Blade({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`} {...outline}>
      <path d="M0 0 C-9 -22 -9 -58 1 -86 C9 -58 9 -22 0 0 Z" fill={LEAF} />
      <path d="M0 -4 C1 -30 1 -55 1 -78" fill="none" stroke={LEAF_DARK} strokeWidth={1.2} />
    </g>
  )
}

/* ---------- Giấy gói, nơ ---------- */

/** Nơ ruy băng có hai đuôi */
function Bow({ x, y, color, dark, tails = 22 }: { x: number; y: number; color: string; dark: string; tails?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} {...outline}>
      <path d={`M-3 3 L-12 ${tails} L-6 ${tails - 3} L-2 ${tails + 3} L2 4 Z`} fill={color} />
      <path d={`M3 3 L12 ${tails} L6 ${tails - 3} L2 ${tails + 3} L-2 4 Z`} fill={color} />
      <path d="M0 0 C-8 -12 -24 -12 -22 0 C-24 12 -8 10 0 0 Z" fill={color} />
      <path d="M0 0 C8 -12 24 -12 22 0 C24 12 8 10 0 0 Z" fill={color} />
      <path d="M-6 -1 C-11 -5 -15 -5 -17 -2 M6 -1 C11 -5 15 -5 17 -2" fill="none" stroke={dark} />
      <circle r="4.5" fill={dark} />
    </g>
  )
}

/** Dây gai buộc nơ đơn giản */
function TwineBow({ x, y }: { x: number; y: number }) {
  const twine = '#9B7656'
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={twine} strokeWidth={2.4} strokeLinecap="round">
      <path d="M-26 -3 L26 -3 M-25 3 L25 3" />
      <path d="M0 0 C-6 -10 -16 -10 -14 -1 C-13 5 -5 3 0 0 C5 3 13 5 14 -1 C16 -10 6 -10 0 0" />
      <path d="M0 0 L-7 16 M0 0 L6 17" />
    </g>
  )
}

type Edge = 'plain' | 'scallop' | 'pleat'

/** Mép trên của lớp giấy trước, từ (48,168) tới (192,168) */
function frontEdge(edge: Edge) {
  if (edge === 'scallop') return 'M48 168 ' + 'a8 8 0 0 0 16 0 '.repeat(9)
  if (edge === 'pleat') return 'M48 168 ' + Array.from({ length: 8 }, (_, i) => `L${57 + i * 18} 178 L${66 + i * 18} 168`).join(' ')
  return 'M48 168 C82 190 158 190 192 168'
}

/** Giấy gói hình phễu: lớp sau xòe ra phía sau hoa */
function PaperBack({ color, edge = 'plain' }: { color: string; edge?: Edge }) {
  const top =
    edge === 'pleat'
      ? Array.from({ length: 8 }, (_, i) => `L${38 + i * 23} ${i % 2 ? 92 : 80}`).join(' ')
      : 'C46 92 82 78 120 78 C158 78 194 92 214 120'
  return <path d={`M120 282 L26 120 ${top} L214 120 Z`} fill={color} {...outline} strokeWidth={2} />
}

/** Lớp giấy trước (che cuống), lớp lót ló ra ở mép */
function PaperFront({ front, inner, edge = 'plain' }: { front: string; inner: string; edge?: Edge }) {
  return (
    <g {...outline} strokeWidth={2}>
      <path d="M120 290 L34 158 C70 182 170 182 206 158 Z" fill={inner} />
      <path d={`${frontEdge(edge)} L120 290 Z`} fill={front} />
      <path d="M120 290 L104 182" fill="none" strokeWidth={1.2} opacity={0.35} />
    </g>
  )
}

/** Dải ruy băng quấn ngang phễu giấy */
function Band({ color }: { color: string }) {
  return <path d="M86 230 L154 230 L150 243 L90 243 Z" fill={color} {...outline} strokeWidth={1.8} />
}

/* ---------- Bó hoa ---------- */

/** [x, y, độ to, góc xoay] của từng bông */
type Spot = [number, number, number, number]

/** Xếp bông theo y tăng dần để bông phía trước vẽ sau */
function Heads({ spots, render }: { spots: Spot[]; render: (i: number) => ReactNode }) {
  return (
    <>
      {spots.map(([x, y, s, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          {render(i)}
        </g>
      ))}
    </>
  )
}

/** Cuống từ từng bông chụm về điểm buộc */
function Stems({ spots, to = [120, 236] }: { spots: Spot[]; to?: [number, number] }) {
  return (
    <g fill="none" stroke={STEM} strokeWidth={3} strokeLinecap="round">
      {spots.map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} Q${(x + to[0]) / 2} ${y + 60} ${to[0] + (x - 120) * 0.06} ${to[1]}`} />
      ))}
    </g>
  )
}

const ROSES: Spot[] = [
  [120, 86, 1.05, 0], [86, 100, 1, -12], [154, 100, 1, 12], [62, 128, 0.95, -20],
  [178, 128, 0.95, 20], [102, 128, 1.05, -5], [138, 128, 1.05, 5],
]
const TULIPS: Spot[] = [
  [120, 50, 1.1, 0], [88, 68, 1.05, -12], [152, 68, 1.05, 12], [62, 98, 1, -20],
  [178, 98, 1, 20], [104, 100, 1.05, -4], [138, 100, 1.05, 4],
]
const PEONIES: Spot[] = [[120, 92, 1.45, 0], [78, 122, 1.35, -10], [162, 122, 1.35, 10]]
const PEONY_BUDS: Spot[] = [[50, 98, 0.9, -20], [190, 96, 0.9, 20]]
const HYDRANGEAS: Spot[] = [[120, 86, 1.5, 0], [78, 124, 1.45, -10], [162, 124, 1.45, 10]]
const BABYS: Spot[] = [
  [120, 72, 1.15, 0], [90, 84, 1.1, -15], [150, 84, 1.1, 15], [66, 108, 1.05, -25], [106, 102, 1.1, 8],
  [134, 102, 1.1, -8], [174, 108, 1.05, 25], [84, 130, 1.1, -10], [120, 128, 1.1, 0], [156, 130, 1.1, 10],
  [56, 140, 0.95, -30], [184, 140, 0.95, 30],
]
/** Oải hương: 11 nhành xòe hình quạt quanh điểm buộc (120, 214) */
const LAVENDERS: Spot[] = Array.from({ length: 11 }, (_, i) => {
  const deg = -32 + i * 6.4
  const len = i % 2 ? 118 : 104
  const a = (deg * Math.PI) / 180
  return [120 + Math.sin(a) * len, 214 - Math.cos(a) * len, 1.25, deg] as Spot
}).sort((a, b) => a[1] - b[1])

const BOUQUETS: Record<string, () => ReactNode> = {
  // Hồng đỏ: giấy kraft nâu, buộc dây gai
  roses: () => (
    <>
      <PaperBack color="#E4C29F" />
      <Stems spots={ROSES} />
      <Leaf x={58} y={162} r={-62} s={1.1} />
      <Leaf x={182} y={162} r={62} s={1.1} />
      <Leaf x={92} y={150} r={-28} />
      <Leaf x={148} y={150} r={28} />
      <Heads spots={ROSES} render={() => <Rose />} />
      <PaperFront front="#D8B08A" inner="#F3E2CF" />
      <TwineBow x={120} y={236} />
    </>
  ),
  // Tulip hồng: giấy kem + một lớp voan hồng trong suốt, nơ satin
  tulips: () => (
    <>
      <PaperBack color="#FFF3E3" />
      <Stems spots={TULIPS} />
      <Blade x={96} y={196} r={-30} />
      <Blade x={144} y={196} r={30} />
      <Heads spots={TULIPS} render={() => <Tulip />} />
      <PaperFront front="#FFF3E3" inner="#FFD9E4" />
      <path d="M120 292 L22 150 C70 186 170 186 218 150 Z" fill="#FFC2D4" opacity={0.45} {...outline} strokeWidth={1.4} />
      <Band color="var(--color-peony-deep)" />
      <Bow x={120} y={236} color="var(--color-peony-deep)" dark="#B8557A" />
    </>
  ),
  // Mẫu đơn: giấy đào + lót trắng, ruy băng lụa đuôi dài
  peonies: () => (
    <>
      <PaperBack color="#FFE6DA" />
      <Stems spots={[...PEONIES, ...PEONY_BUDS]} />
      <Leaf x={60} y={154} r={-58} s={1.2} />
      <Leaf x={180} y={154} r={58} s={1.2} />
      <Leaf x={40} y={128} r={-80} />
      <Leaf x={200} y={128} r={80} />
      <Heads spots={PEONY_BUDS} render={() => <PeonyBud />} />
      <Heads spots={PEONIES} render={() => <Peony />} />
      <PaperFront front="var(--color-peach)" inner="#FFFFFF" />
      <Band color="var(--color-petal)" />
      <Bow x={120} y={236} color="var(--color-petal)" dark="var(--color-peony)" tails={46} />
    </>
  ),
  // Cẩm tú cầu: gói kiểu Hàn, giấy tím nhạt + trắng mép xếp nếp, nơ xanh
  hydrangeas: () => (
    <>
      <PaperBack color="#FFFFFF" edge="pleat" />
      <Stems spots={HYDRANGEAS} />
      <Leaf x={44} y={160} r={-66} s={1.45} />
      <Leaf x={196} y={160} r={66} s={1.45} />
      <Heads spots={HYDRANGEAS} render={(i) => <Hydrangea tint={i === 1 ? 'purple' : 'blue'} />} />
      <PaperFront front="var(--color-lavender)" inner="#FFFFFF" edge="pleat" />
      <Band color="var(--color-hydrangea)" />
      <Bow x={120} y={236} color="var(--color-hydrangea)" dark="#8FA6E6" />
    </>
  ),
  // Oải hương: bó kiểu đồng quê, cuống lộ ra, quấn vải lanh + dây gai
  lavender: () => (
    <>
      <g fill="none" stroke="#8FA88A" strokeWidth={2} strokeLinecap="round">
        {LAVENDERS.map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} L${116 + (i % 5) * 2} 214 L${104 + i * 3.2} 290`} />
        ))}
      </g>
      <Heads spots={LAVENDERS} render={() => <Lavender />} />
      <g {...outline} strokeWidth={2}>
        <path d="M90 196 L150 196 L142 264 L98 264 Z" fill="#EADBC0" />
        <path d="M96 210 L144 210 M98 226 L142 226 M99 242 L141 242" fill="none" stroke="#D2BD98" strokeWidth={1.4} />
      </g>
      <TwineBow x={120} y={220} />
    </>
  ),
  // Baby's breath: một đám mây trắng trong phễu giấy hồng mép vỏ sò
  'babys-breath': () => (
    <>
      <PaperBack color="var(--color-petal)" />
      <Stems spots={BABYS} />
      <Heads spots={BABYS} render={() => <BabysBreath />} />
      <PaperFront front="var(--color-peony)" inner="#FFFFFF" edge="scallop" />
      <Band color="#FFFFFF" />
      <Bow x={120} y={236} color="#FFFFFF" dark="var(--color-peony-deep)" />
    </>
  ),
}

/** Một bông làm sticker (Collection, màn mở quà) */
export function FlowerIcon({ id, className = '' }: { id: string; className?: string }) {
  const Head = HEADS[id]
  if (!Head) return null
  const tall = id === 'lavender'
  return (
    <svg viewBox="-30 -32 60 64" aria-hidden className={`sticker ${className}`}>
      {!tall && <Leaf x={-4} y={26} r={-58} s={0.55} />}
      {!tall && <Leaf x={4} y={26} r={58} s={0.55} />}
      <g transform={tall ? 'rotate(-12) scale(0.95)' : 'translate(0 -2) scale(1.12)'}>
        <Head />
      </g>
    </svg>
  )
}

/** Cả bó hoa của một loài, gói riêng từng kiểu */
export function Bouquet({ id, className = '' }: { id: string; className?: string }) {
  const draw = BOUQUETS[id]
  if (!draw) return null
  return (
    <svg viewBox="0 30 240 270" aria-hidden className={`sticker-art ${className}`}>
      {draw()}
    </svg>
  )
}
