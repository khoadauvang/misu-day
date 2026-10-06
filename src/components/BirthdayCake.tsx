// Bánh kem sinh nhật 2 tầng với nến số "19", vẽ bằng SVG, có viền trắng kiểu sticker.
// Màu bánh là màu riêng của hình vẽ; viền và chi tiết dùng màu của game.

const LINE = 'var(--color-plum)'
const PINK = '#F7B6C8'
const VANILLA = '#FFF3E3'
const outline = { stroke: LINE, strokeWidth: 4, strokeLinejoin: 'round' as const }

/** Ngọn lửa nến (lung linh nhờ animate-flicker) */
function Flame({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} L${x} ${y + 9}`} stroke={LINE} strokeWidth="3" strokeLinecap="round" />
      <path
        d={`M${x} ${y - 20} C${x + 9} ${y - 10} ${x + 8} ${y} ${x} ${y + 1} C${x - 8} ${y} ${x - 9} ${y - 10} ${x} ${y - 20} Z`}
        fill="var(--color-butter)"
        stroke="#F6A564"
        strokeWidth="2.5"
        className="animate-flicker"
        style={{ transformOrigin: `${x}px ${y}px`, transformBox: 'view-box' }}
      />
      <ellipse cx={x} cy={y - 6} rx="2.6" ry="4.5" fill="#FFFDF5" />
    </g>
  )
}

export function BirthdayCake({ className = '' }: { className?: string }) {
  const digits = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 58 }
  return (
    <svg viewBox="0 -10 200 224" aria-hidden className={`sticker-art ${className}`}>
      {/* Lớp viền trắng phía sau */}
      <g fill="#fff" stroke="#fff" strokeWidth="18" strokeLinejoin="round">
        <ellipse cx="100" cy="194" rx="88" ry="15" />
        <rect x="22" y="118" width="156" height="72" rx="18" />
        <rect x="46" y="70" width="108" height="56" rx="16" />
        <text x="62" y="78" {...digits}>
          1
        </text>
        <text x="100" y="78" {...digits}>
          9
        </text>
        <circle cx="76" cy="15" r="11" />
        <circle cx="122" cy="15" r="11" />
      </g>

      {/* Đĩa */}
      <ellipse cx="100" cy="194" rx="88" ry="15" fill="#fff" {...outline} />

      {/* Tầng dưới: hồng, kem trắng chảy xuống */}
      <rect x="22" y="118" width="156" height="72" rx="18" fill={PINK} {...outline} />
      <path
        d="M24 136 C24 124 32 118 42 118 L158 118 C168 118 176 124 176 136 C170 142 166 132 160 140 C154 150 148 136 142 142 C134 152 128 134 120 142 C112 152 106 136 98 144 C90 152 84 134 76 142 C68 150 62 136 56 142 C48 150 42 132 34 140 C30 144 26 140 24 136 Z"
        fill="#fff"
        {...outline}
        strokeWidth={3}
      />
      {[40, 70, 100, 130, 160].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 === 0 ? 170 : 162} r="4.5" fill="#fff" opacity="0.9" />
      ))}

      {/* Tầng trên: vani, kem hồng chảy xuống */}
      <rect x="46" y="70" width="108" height="56" rx="16" fill={VANILLA} {...outline} />
      <path
        d="M48 86 C48 76 54 70 62 70 L138 70 C146 70 152 76 152 86 C146 92 142 82 136 90 C130 98 124 84 118 92 C112 100 106 84 100 92 C94 100 88 84 82 92 C76 100 70 84 64 90 C58 96 52 84 48 86 Z"
        fill="var(--color-peony)"
        {...outline}
        strokeWidth={3}
      />
      <circle cx="58" cy="112" r="3.5" fill="var(--color-lavender)" />
      <circle cx="142" cy="108" r="3.5" fill="var(--color-mint)" />
      <circle cx="100" cy="114" r="3.5" fill="var(--color-butter)" />

      {/* Nến số 19 */}
      <text x="62" y="78" {...digits} fill="var(--color-lavender)" stroke={LINE} strokeWidth="4" paintOrder="stroke" strokeLinejoin="round">
        1
      </text>
      <text x="100" y="78" {...digits} fill="var(--color-hydrangea)" stroke={LINE} strokeWidth="4" paintOrder="stroke" strokeLinejoin="round">
        9
      </text>
      <Flame x={76} y={30} />
      <Flame x={122} y={30} />
    </svg>
  )
}
