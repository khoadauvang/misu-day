import { bass, box, glide, midi, piano, record, swish, twinkle, type Rendered, type Studio } from './synth.ts'

// Tiếng hiệu ứng: mỗi tiếng là một "công thức" nhỏ, thu sẵn lúc mở game (mỗi tiếng vài mili giây).
// Muốn đổi tiếng nào: sửa nốt (C6, E6…), khoảng cách giữa các nốt (giây) hoặc level (to/nhỏ).

export type SfxName =
  | 'tap'
  | 'pay'
  | 'buy'
  | 'chime'
  | 'levelUp'
  | 'collect'
  | 'send'
  | 'receive'
  | 'squeak'
  | 'boing'
  | 'sparkle'
  | 'page'

type Recipe = {
  /** Dài bao nhiêu giây (tính cả tiếng vang) */
  seconds: number
  /** To/nhỏ so với các tiếng khác (0–1) */
  level: number
  /** Độ vang (0–1) */
  wet?: number
  build: (s: Studio) => void
}

/** Tiếng xu: một tiếng "kách" nhỏ + hai nốt hộp nhạc nhảy lên */
function coin(s: Studio, t: number, low: string, high: string, vel = 1) {
  swish(s, t, 5200, 7200, 0.03, 0.22 * vel, 2)
  box(s, t, midi(low), 0.7 * vel, s.fx)
  box(s, t + 0.075, midi(high), vel, s.fx)
}

export const SFX: Record<SfxName, Recipe> = {
  // Chạm nút bất kỳ: "póc" nhỏ
  tap: {
    seconds: 0.2,
    level: 0.32,
    wet: 0.04,
    build: (s) =>
      glide(s, 0.002, {
        path: [
          [0, 620],
          [0.02, 980],
        ],
        vel: 1,
        tau: 0.025,
      }),
  },
  // Trả tiền (ăn uống, làm đẹp…): "ting-ting" như đồng xu
  pay: { seconds: 1.2, level: 0.8, build: (s) => coin(s, 0.005, 'B5', 'E6') },
  // Mua được đồ có sticker: đồng xu + lấp lánh
  buy: {
    seconds: 1.6,
    level: 0.9,
    build: (s) => {
      coin(s, 0.005, 'B5', 'E6')
      twinkle(s, 0.17, ['E6', 'G6', 'A6', 'C7', 'E7'], 0.045, 0.5)
    },
  },
  // Làm xong hoạt động miễn phí, xem phim: chuông hộp nhạc
  chime: {
    seconds: 1.5,
    level: 0.75,
    build: (s) => {
      twinkle(s, 0.005, ['C6', 'E6', 'G6'], 0.075, 0.75, 0.2)
      box(s, 0.23, midi('C7'), 0.6, s.fx)
    },
  },
  // Lên level, nhận nuôi cún: kèn nhỏ vui vẻ
  levelUp: {
    seconds: 2.6,
    level: 1,
    build: (s) => {
      ;['C5', 'E5', 'G5', 'C6'].forEach((n, i) => box(s, 0.005 + i * 0.09, midi(n), 0.85, s.fx))
      for (const n of ['C6', 'E6', 'G6']) box(s, 0.38, midi(n), 0.6, s.fx)
      for (const n of ['E4', 'G4', 'B4', 'D5']) piano(s, 0.38, midi(n), 0.45, 1.3)
      bass(s, 0.38, midi('C3'), 0.7, 1.3)
      twinkle(s, 0.56, ['G6', 'C7', 'E7', 'G7'], 0.05, 0.35)
    },
  },
  // Nhận tiền buổi sáng, Chằm Chằm gửi thêm: ba đồng xu rơi
  collect: {
    seconds: 1.8,
    level: 0.9,
    build: (s) => {
      coin(s, 0.005, 'E5', 'A5', 0.8)
      coin(s, 0.1, 'G5', 'C6', 0.9)
      coin(s, 0.2, 'B5', 'E6', 1)
      twinkle(s, 0.36, ['E6', 'G6', 'C7'], 0.05, 0.45)
    },
  },
  // Gửi tin: bong bóng "blúp"
  send: {
    seconds: 0.5,
    level: 0.55,
    wet: 0.08,
    build: (s) => {
      glide(s, 0.002, {
        path: [
          [0, 340],
          [0.07, 820],
        ],
        vel: 1,
        tau: 0.045,
      })
      glide(s, 0.06, {
        path: [
          [0, 520],
          [0.06, 1150],
        ],
        vel: 0.45,
        tau: 0.035,
      })
    },
  },
  // Chằm Chằm trả lời: "ting-tong"
  receive: {
    seconds: 1.4,
    level: 0.65,
    build: (s) => {
      box(s, 0.005, midi('G6'), 0.7, s.fx)
      box(s, 0.12, midi('C7'), 0.9, s.fx)
    },
  },
  // Cún: đồ chơi bóp kêu "chít"
  squeak: {
    seconds: 0.6,
    level: 0.5,
    wet: 0.06,
    build: (s) =>
      glide(s, 0.002, {
        type: 'triangle',
        path: [
          [0, 900],
          [0.06, 1500],
          [0.16, 1150],
        ],
        vel: 0.9,
        tau: 0.06,
        attack: 0.01,
        vibrato: [28, 35],
      }),
  },
  // Chạm chibi Misu (nhún nhảy): lò xo "boing"
  boing: {
    seconds: 0.8,
    level: 0.5,
    wet: 0.06,
    build: (s) =>
      glide(s, 0.002, {
        path: [
          [0, 160],
          [0.16, 520],
        ],
        vel: 1,
        tau: 0.12,
        attack: 0.006,
        vibrato: [16, 22],
      }),
  },
  // Mở thư sinh nhật, dùng Love Coupon: lấp lánh
  sparkle: {
    seconds: 2,
    level: 0.7,
    wet: 0.32,
    build: (s) => twinkle(s, 0.005, ['G6', 'A6', 'C7', 'D7', 'E7', 'G7', 'A7'], 0.04, 0.7),
  },
  // Lật trang thư: "sột"
  page: { seconds: 0.4, level: 0.3, wet: 0.05, build: (s) => swish(s, 0.002, 900, 3200, 0.18, 1, 0.9) },
}

export const SFX_NAMES = Object.keys(SFX) as SfxName[]

/** Thu sẵn một tiếng hiệu ứng */
export function recordSfx(name: SfxName, sampleRate: number): Rendered {
  const recipe = SFX[name]
  return record(sampleRate, recipe.seconds, recipe.build, { peak: 0.7 * recipe.level }, { wet: { fx: recipe.wet ?? 0.18 } })
}
