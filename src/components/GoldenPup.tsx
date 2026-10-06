import type { PetMood } from '../game/pet.ts'

// Cún Golden Retriever chibi vẽ bằng SVG, đổi nét mặt theo tâm trạng.
// Màu lông là màu riêng của hình vẽ (giống public/stickers/bunny.svg); viền và chi tiết dùng màu mận của game.

const FUR = '#F1BE73'
const FUR_DARK = '#E6A858'
const CREAM = '#FFF0D4'
const PAW = '#FFE6C0'
const LINE = 'var(--color-plum)'
const BLUSH = '#F7A8BE'

/** Các mảng tạo dáng con cún (dùng 2 lần: lớp viền trắng phía sau và lớp tô màu) */
const HEAD = 'M120 38 C158 38 184 62 186 96 C188 130 160 152 120 152 C80 152 52 130 54 96 C56 62 82 38 120 38 Z'
const EAR_L = 'M74 60 C52 64 36 92 41 124 C44 141 59 146 69 135 C80 122 86 96 88 72 Z'
const EAR_R = 'M166 60 C188 64 204 92 199 124 C196 141 181 146 171 135 C160 122 154 96 152 72 Z'
const BODY = 'M120 126 C88 126 68 150 66 180 C64 206 82 222 120 222 C158 222 176 206 174 180 C172 150 152 126 120 126 Z'
const TAIL = 'M158 204 C188 202 207 184 212 156 C214 145 204 141 198 150 C189 167 177 180 156 186 Z'
const HAUNCH_L = 'M60 206 C60 190 72 182 86 186 C98 190 102 204 96 214 C88 224 62 222 60 206 Z'
const HAUNCH_R = 'M180 206 C180 190 168 182 154 186 C142 190 138 204 144 214 C152 224 178 222 180 206 Z'
const LEG_L = 'M91 188 C91 180 113 180 113 188 L113 212 C113 220 91 220 91 212 Z'
const LEG_R = 'M127 188 C127 180 149 180 149 188 L149 212 C149 220 127 220 127 212 Z'

type GoldenPupProps = {
  mood?: PetMood
  className?: string
  /** Vẫy đuôi (mặc định: vẫy khi vui hoặc bình thường) */
  wag?: boolean
}

function Eyes({ mood }: { mood: PetMood }) {
  const stroke = { stroke: LINE, strokeWidth: 4.5, strokeLinecap: 'round' as const, fill: 'none' }
  if (mood === 'happy') {
    return (
      <>
        <path d="M85 98 Q94 86 103 98" {...stroke} />
        <path d="M137 98 Q146 86 155 98" {...stroke} />
      </>
    )
  }
  if (mood === 'sleeping') {
    return (
      <>
        <path d="M85 94 Q94 104 103 94" {...stroke} />
        <path d="M137 94 Q146 104 155 94" {...stroke} />
      </>
    )
  }
  const big = mood === 'hungry'
  return (
    <>
      {big && (
        <>
          {/* Lông mày nhướn lên: đói, mắt long lanh */}
          <path d="M84 80 Q92 74 101 76" {...stroke} strokeWidth={3.5} />
          <path d="M139 76 Q148 74 156 80" {...stroke} strokeWidth={3.5} />
        </>
      )}
      <ellipse cx="94" cy="96" rx={big ? 9 : 7.5} ry={big ? 11 : 9.5} fill={LINE} />
      <ellipse cx="146" cy="96" rx={big ? 9 : 7.5} ry={big ? 11 : 9.5} fill={LINE} />
      <circle cx={big ? 97.5 : 97} cy="91" r={big ? 4 : 3.2} fill="#fff" />
      <circle cx={big ? 149.5 : 149} cy="91" r={big ? 4 : 3.2} fill="#fff" />
      <circle cx="91" cy="101" r="1.6" fill="#fff" />
      <circle cx="143" cy="101" r="1.6" fill="#fff" />
      {big && <path d="M104 108 Q101 115 104 118 Q108 115 104 108 Z" fill="var(--color-hydrangea)" />}
    </>
  )
}

function Mouth({ mood }: { mood: PetMood }) {
  const stroke = { stroke: LINE, strokeWidth: 3.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' }
  if (mood === 'happy') {
    return (
      <>
        <path d="M107 121 Q120 146 133 121 Q127 125 120 121 Q113 125 107 121 Z" fill="#7A4A5C" stroke={LINE} strokeWidth={3} strokeLinejoin="round" />
        <path d="M113 131 Q120 144 127 131 Q120 127 113 131 Z" fill="#F48FAA" />
      </>
    )
  }
  if (mood === 'hungry' || mood === 'bored') {
    return <path d="M110 127 Q120 120 130 127" {...stroke} />
  }
  return <path d="M120 114 L120 120 M107 119 Q113.5 127 120 120 Q126.5 127 133 119" {...stroke} />
}

/** Cún Golden chibi. mood: happy · okay · hungry · bored · sleeping */
export function GoldenPup({ mood = 'okay', className = '', wag }: GoldenPupProps) {
  const wagging = wag ?? (mood === 'happy' || mood === 'okay')
  const tailClass = wagging ? 'animate-wag' : ''
  const tailStyle = { transformOrigin: '160px 196px', transformBox: 'view-box' as const }
  const outline = { stroke: LINE, strokeWidth: 4.5, strokeLinejoin: 'round' as const }

  return (
    <svg viewBox="0 0 240 240" aria-hidden className={`sticker-art ${className}`}>
      {/* Lớp viền trắng kiểu sticker cắt bế */}
      <g fill="#fff" stroke="#fff" strokeWidth="18" strokeLinejoin="round">
        <path d={TAIL} className={tailClass} style={tailStyle} />
        <path d={BODY} />
        <path d={HAUNCH_L} />
        <path d={HAUNCH_R} />
        <path d={HEAD} />
        <path d={EAR_L} />
        <path d={EAR_R} />
      </g>

      {/* Đuôi + thân */}
      <path d={TAIL} fill={FUR_DARK} {...outline} className={tailClass} style={tailStyle} />
      <path d={HAUNCH_L} fill={FUR} {...outline} />
      <path d={HAUNCH_R} fill={FUR} {...outline} />
      <path d={BODY} fill={FUR} {...outline} />
      <path d="M120 146 C99 146 92 166 96 184 C99 197 109 204 120 204 C131 204 141 197 144 184 C148 166 141 146 120 146 Z" fill={CREAM} />
      <path d={LEG_L} fill={FUR} {...outline} />
      <path d={LEG_R} fill={FUR} {...outline} />
      <ellipse cx="102" cy="214" rx="15" ry="9.5" fill={PAW} {...outline} />
      <ellipse cx="138" cy="214" rx="15" ry="9.5" fill={PAW} {...outline} />
      <path d="M97 211 L97 217 M107 211 L107 217 M133 211 L133 217 M143 211 L143 217" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" />

      {/* Vòng cổ hồng */}
      <path d="M84 142 Q120 170 156 142 L158 152 Q120 182 82 152 Z" fill="var(--color-peony)" {...outline} />

      {/* Đầu + tai */}
      <path d={HEAD} fill={FUR} {...outline} />
      <path d="M110 44 C110 30 124 28 124 40 C128 30 142 34 136 47" fill={FUR} {...outline} strokeLinecap="round" />
      <path d={EAR_L} fill={FUR_DARK} {...outline} />
      <path d={EAR_R} fill={FUR_DARK} {...outline} />

      {/* Mặt */}
      <ellipse cx="120" cy="119" rx="31" ry="22" fill={CREAM} />
      <ellipse cx="77" cy="116" rx="10" ry="6" fill={BLUSH} opacity="0.8" />
      <ellipse cx="163" cy="116" rx="10" ry="6" fill={BLUSH} opacity="0.8" />
      <Eyes mood={mood} />
      <path d="M109 103 Q120 97 131 103 Q129 112 120 114 Q111 112 109 103 Z" fill={LINE} />
      <ellipse cx="116" cy="103" rx="3.2" ry="1.8" fill="#fff" opacity="0.85" />
      <Mouth mood={mood} />

      {/* Thẻ tên hình trái tim */}
      <path
        d="M120 184 C113 179 108 175 108 170 C108 166 111 163 114.5 163.5 C117 164 119 165.5 120 168 C121 165.5 123 164 125.5 163.5 C129 163 132 166 132 170 C132 175 127 179 120 184 Z"
        fill="var(--color-butter)"
        {...outline}
        strokeWidth={3}
      />

      {mood === 'sleeping' && (
        <g fill="var(--color-plum-soft)" fontFamily="var(--font-display)" fontWeight="700">
          <text x="182" y="46" fontSize="26">
            Z
          </text>
          <text x="204" y="26" fontSize="18">
            z
          </text>
        </g>
      )}
    </svg>
  )
}
