import type { KeyboardEvent } from 'react'
import { colorVar, DISTRICT_BY_ID, DISTRICTS, ROADS } from '../../data/districts.ts'
import type { DistrictId } from '../../game/types.ts'

// Bản đồ Sài Gòn vẽ bằng SVG: sông Sài Gòn, đường nối và 7 quận dạng sticker.
// Vị trí từng quận chỉnh trong src/data/districts.ts (khung 360 × 460).

/** Hình "cục bông" quanh một tâm: tròn nhưng hơi méo cho giống vẽ tay */
function blobPath(cx: number, cy: number, r: number, seed: number, points = 8): string {
  const pts = Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2
    const wobble = 1 + 0.08 * Math.sin(seed * 12.9898 + i * 78.233)
    return [cx + Math.cos(angle) * r * wobble, cy + Math.sin(angle) * r * wobble]
  })
  const f = (n: number) => n.toFixed(1)
  let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`
  for (let i = 0; i < points; i++) {
    // Nối các điểm bằng đường cong mềm (Catmull-Rom → Bézier)
    const p0 = pts[(i - 1 + points) % points]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % points]
    const p3 = pts[(i + 2) % points]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`
  }
  return `${d} Z`
}

const RIVER = 'M 238 -20 C 226 50 230 120 238 160 C 246 214 226 252 236 304 C 246 356 292 412 384 474'

type SaigonMapProps = { onPick: (district: DistrictId) => void }

export function SaigonMap({ onPick }: SaigonMapProps) {
  const onKey = (event: KeyboardEvent, id: DistrictId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onPick(id)
    }
  }

  return (
    <div className="paper-dots mt-5 overflow-hidden rounded-[32px] ring-1 ring-petal">
      <svg viewBox="0 0 360 460" className="block h-auto w-full" role="group" aria-label="Map of Saigon">
        <defs>
          <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#5A3A4A" floodOpacity="0.18" />
          </filter>
          {/* Viền trắng quanh emoji cho giống sticker */}
          <filter id="map-sticker" x="-30%" y="-30%" width="160%" height="160%">
            <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="grown" />
            <feFlood floodColor="#ffffff" />
            <feComposite in2="grown" operator="in" result="outline" />
            <feMerge>
              <feMergeNode in="outline" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sông Sài Gòn */}
        <path id="saigon-river" d={RIVER} fill="none" stroke={colorVar('hydrangea')} strokeOpacity="0.6" strokeWidth="26" strokeLinecap="round" />
        <path d={RIVER} fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="2.5" strokeDasharray="3 12" strokeLinecap="round" />
        <text fontSize="10" fontWeight="800" letterSpacing="1.5" fill="#6F86C2">
          <textPath href="#saigon-river" startOffset="74%">
            Saigon River
          </textPath>
        </text>

        {/* Đường nối các quận */}
        {ROADS.map(([a, b]) => {
          const from = DISTRICT_BY_ID[a].map
          const to = DISTRICT_BY_ID[b].map
          return (
            <line
              key={`${a}-${b}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={colorVar('peony')}
              strokeWidth="3"
              strokeDasharray="0.5 9"
              strokeLinecap="round"
            />
          )
        })}

        {/* Các quận */}
        {DISTRICTS.map((district, index) => {
          const { x, y, r } = district.map
          return (
            <g
              key={district.id}
              role="button"
              tabIndex={0}
              aria-label={`${district.name}: ${district.theme}`}
              className="map-district"
              onClick={() => onPick(district.id)}
              onKeyDown={(event) => onKey(event, district.id)}
            >
              <path
                d={blobPath(x, y, r, index + 1)}
                fill={colorVar(district.color)}
                stroke="#ffffff"
                strokeWidth="5"
                filter="url(#map-shadow)"
              />
              <text
                x={x}
                y={y - 6}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="30"
                filter="url(#map-sticker)"
              >
                {district.emoji}
              </text>
              <text
                x={x}
                y={y + r * 0.58}
                textAnchor="middle"
                className="font-display"
                fontSize="13"
                fontWeight="700"
                fill="var(--color-plum)"
              >
                {district.name}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
