// Khung vẽ cảnh quận và bảng màu dùng chung cho src/screens/map/scenes/.
// Khung 360 × 420, chia 3 dải: dãy nhà phía sau (chân ở BACK), con đường, dãy quán phía trước (chân ở FRONT).

export const SCENE_W = 360
export const SCENE_H = 420
/** Chân dãy nhà phía sau = mép trên con đường */
export const BACK = 228
export const ROAD_BOTTOM = 272
/** Chân dãy quán phía trước (cao tối đa ~100 để không che đường) */
export const FRONT = 392

export const C = {
  paper: 'var(--color-paper)',
  petal: 'var(--color-petal)',
  peony: 'var(--color-peony)',
  peonyDeep: 'var(--color-peony-deep)',
  plum: 'var(--color-plum)',
  plumSoft: 'var(--color-plum-soft)',
  hydrangea: 'var(--color-hydrangea)',
  lavender: 'var(--color-lavender)',
  butter: 'var(--color-butter)',
  peach: 'var(--color-peach)',
  mint: 'var(--color-mint)',
  white: '#ffffff',
}

/** Nét viền chung: màu mận, bo tròn */
export const ink = { stroke: C.plum, strokeWidth: 2.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
/** Nét viền mảnh cho chi tiết nhỏ */
export const thin = { ...ink, strokeWidth: 1.6 }
