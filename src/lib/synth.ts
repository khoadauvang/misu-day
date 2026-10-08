import type { ChordShape, Song } from '../data/music.ts'

// Bộ tổng hợp âm thanh: tự tính từng mẫu âm thanh bằng JavaScript (sóng sin, bộ lọc, tiếng vang),
// không dùng file nhạc. Thu sẵn thành mảng số lúc mở game, lúc chơi chỉ việc phát lại.

/** Kết quả thu: 2 kênh trái/phải + tần số lấy mẫu */
export type Rendered = { rate: number; channels: [Float32Array, Float32Array] }

/** 'A5' → số nốt MIDI (C4 = 60). Có thăng/giáng: 'C#5', 'Bb4' */
export function midi(name: string): number {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name.trim())
  if (!m) throw new Error(`Bad note: ${name}`)
  const step = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1] as 'C']
  const accidental = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0
  return 12 * (Number(m[3]) + 1) + step + accidental
}

/** Số nốt MIDI → tần số (Hz) */
export const hz = (note: number) => 440 * 2 ** ((note - 69) / 12)

/** Số ngẫu nhiên có "hạt giống": lần nào thu cũng ra y hệt nhau */
export function seeded(seed: number) {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// --- Sóng cơ bản ---

const TAU = Math.PI * 2
const TABLE = 4096
const SINE = new Float32Array(TABLE + 1)
for (let i = 0; i <= TABLE; i++) SINE[i] = Math.sin((i / TABLE) * TAU)

/** sin(2π·phase), phase tính bằng vòng (tra bảng cho nhanh) */
function sin1(phase: number): number {
  const x = (phase - Math.floor(phase)) * TABLE
  const i = x | 0
  return SINE[i] + (SINE[i + 1] - SINE[i]) * (x - i)
}

/** Sóng tam giác (-1…1), phase tính bằng vòng */
function tri(phase: number): number {
  return 1 - 4 * Math.abs(phase - Math.floor(phase) - 0.5)
}

/** Bộ lọc biquad (công thức RBJ) */
class Biquad {
  b0 = 1
  b1 = 0
  b2 = 0
  a1 = 0
  a2 = 0
  x1 = 0
  x2 = 0
  y1 = 0
  y2 = 0
  set(type: 'lowpass' | 'bandpass', frequency: number, q: number, rate: number) {
    const w = (TAU * Math.min(frequency, rate * 0.45)) / rate
    const cos = Math.cos(w)
    const alpha = Math.sin(w) / (2 * q)
    const a0 = 1 + alpha
    if (type === 'lowpass') {
      this.b0 = (1 - cos) / 2 / a0
      this.b1 = (1 - cos) / a0
      this.b2 = (1 - cos) / 2 / a0
    } else {
      this.b0 = alpha / a0
      this.b1 = 0
      this.b2 = -alpha / a0
    }
    this.a1 = (-2 * cos) / a0
    this.a2 = (1 - alpha) / a0
    return this
  }
  run(x: number) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2
    this.x2 = this.x1
    this.x1 = x
    this.y2 = this.y1
    this.y1 = y
    return y
  }
}

function lowpass(data: Float32Array, frequency: number, rate: number, q = Math.SQRT1_2) {
  const f = new Biquad().set('lowpass', frequency, q, rate)
  for (let i = 0; i < data.length; i++) data[i] = f.run(data[i])
}

function bandpass(data: Float32Array, frequency: number, rate: number, q: number) {
  const f = new Biquad().set('bandpass', frequency, q, rate)
  for (let i = 0; i < data.length; i++) data[i] = f.run(data[i])
}

// --- Phòng vang (kiểu Freeverb: 8 bộ dội + 4 bộ tán âm mỗi bên tai) ---

const COMBS = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617]
const ALLPASSES = [556, 441, 341, 225]

/** Tiếng vang (mono vào, stereo ra), tắt hẳn sau ~2 giây. Giữ trạng thái nên xử lý được từng đoạn */
class Reverb {
  private combs: Float32Array[][]
  private combAt: Int32Array[]
  private combLow: Float64Array[]
  private passes: Float32Array[][]
  private passAt: Int32Array[]
  constructor(rate: number) {
    const scale = rate / 44100
    const lines = (lengths: number[], ch: number) => lengths.map((d) => new Float32Array(Math.round((d + ch * 23) * scale)))
    this.combs = [0, 1].map((ch) => lines(COMBS, ch))
    this.combAt = [0, 1].map(() => new Int32Array(COMBS.length))
    this.combLow = [0, 1].map(() => new Float64Array(COMBS.length))
    this.passes = [0, 1].map((ch) => lines(ALLPASSES, ch))
    this.passAt = [0, 1].map(() => new Int32Array(ALLPASSES.length))
  }
  /** Xử lý input[from…to), cộng tiếng vang vào out */
  run(input: Float32Array, out: [Float32Array, Float32Array], from: number, to: number) {
    const feedback = 0.86
    const damp = 0.3
    for (let ch = 0; ch < 2; ch++) {
      const combs = this.combs[ch]
      const combAt = this.combAt[ch]
      const combLow = this.combLow[ch]
      const passes = this.passes[ch]
      const passAt = this.passAt[ch]
      const dst = out[ch]
      for (let n = from; n < to; n++) {
        const x = input[n] * 0.015
        let sum = 0
        for (let c = 0; c < combs.length; c++) {
          const buf = combs[c]
          const i = combAt[c]
          const y = buf[i]
          combLow[c] = y * (1 - damp) + combLow[c] * damp
          buf[i] = x + combLow[c] * feedback
          combAt[c] = i + 1 === buf.length ? 0 : i + 1
          sum += y
        }
        for (let p = 0; p < passes.length; p++) {
          const buf = passes[p]
          const i = passAt[p]
          const b = buf[i]
          buf[i] = sum + b * 0.5
          passAt[p] = i + 1 === buf.length ? 0 : i + 1
          sum = b - sum
        }
        dst[n] += sum
      }
    }
  }
}

// --- Bàn mixer ---

/** Mỗi nhạc cụ một kênh riêng (mono), trộn lại ở mixdown() */
export type Studio = {
  rate: number
  length: number
  box: Float32Array
  piano: Float32Array
  bass: Float32Array
  shaker: Float32Array
  drum: Float32Array
  fx: Float32Array
  noise: Float32Array
  rand: () => number
}

type Wet = { box: number; piano: number; bass: number; perc: number; fx: number }
const DEFAULT_WET: Wet = { box: 0.32, piano: 0.22, bass: 0.04, perc: 0.1, fx: 0.18 }

const noiseCache = new Map<number, Float32Array>()
function noiseFor(rate: number): Float32Array {
  let data = noiseCache.get(rate)
  if (!data) {
    const rand = seeded(7)
    data = new Float32Array(rate)
    for (let i = 0; i < rate; i++) data[i] = rand() * 2 - 1
    noiseCache.set(rate, data)
  }
  return data
}

function studio(rate: number, seconds: number): Studio {
  const length = Math.ceil(seconds * rate)
  const bus = () => new Float32Array(length)
  return {
    rate,
    length,
    box: bus(),
    piano: bus(),
    bass: bus(),
    shaker: bus(),
    drum: bus(),
    fx: bus(),
    noise: noiseFor(rate),
    rand: seeded(2026_10_09),
  }
}

/** Trái/phải kiểu "công suất đều": -1 trái … 0 giữa … 1 phải */
function panGains(pan: number): [number, number] {
  const x = ((pan + 1) / 2) * (Math.PI / 2)
  return [Math.cos(x), Math.sin(x)]
}

/**
 * Trộn các kênh: lọc, đặt trái/phải, gửi một phần sang phòng vang.
 * offset: giây bắt đầu của khúc trong cả bài (để tiếng lắc trái phải của piano liền mạch giữa các khúc).
 */
function mixdown(s: Studio, wet: Wet, offset = 0): { dry: [Float32Array, Float32Array]; send: Float32Array } {
  const { rate, length } = s
  lowpass(s.piano, 2600, rate, 0.6)
  lowpass(s.bass, 900, rate)
  bandpass(s.shaker, 7000, rate, 0.9)
  lowpass(s.drum, 400, rate)

  const left = new Float32Array(length)
  const right = new Float32Array(length)
  const send = new Float32Array(length)
  const add = (data: Float32Array, level: number, pan: number, reverbAmount: number) => {
    const [gl, gr] = panGains(pan)
    for (let i = 0; i < length; i++) {
      const v = data[i] * level
      if (v === 0) continue
      left[i] += v * gl
      right[i] += v * gr
      send[i] += v * reverbAmount
    }
  }
  add(s.box, 0.55, 0.14, wet.box)
  add(s.bass, 0.3, 0, wet.bass)
  add(s.shaker, 0.15, 0.3, wet.perc)
  add(s.drum, 0.5, 0, 0)
  add(s.fx, 1, 0, wet.fx)
  // Piano điện lắc nhẹ trái phải (tremolo kiểu lo-fi), 3,2 lần mỗi giây (tính lại mỗi 32 mẫu cho nhanh)
  let gl = 0
  let gr = 0
  for (let i = 0; i < length; i++) {
    if (i % 32 === 0) [gl, gr] = panGains(0.28 * Math.sin(TAU * 3.2 * (offset + i / rate)))
    const v = s.piano[i] * 0.3
    if (v === 0) continue
    left[i] += v * gl
    right[i] += v * gr
    send[i] += v * wet.piano
  }
  return { dry: [left, right], send }
}

// --- Nhạc cụ (mỗi hàm cộng tiếng vào một kênh) ---

const startAt = (s: Studio, t: number) => Math.max(0, Math.round(t * s.rate))

/** Một sóng sin bật lên rồi tắt dần (tau = thời gian tắt, giây) */
function partial(s: Studio, out: Float32Array, t: number, f: number, amp: number, attack: number, tau: number) {
  if (f > s.rate / 2.2 || amp <= 0) return
  const start = startAt(s, t)
  const n = Math.min(s.length - start, Math.ceil((attack + tau * 6) * s.rate))
  const w = (TAU * f) / s.rate
  const c = 2 * Math.cos(w)
  let y1 = -Math.sin(w)
  let y2 = -Math.sin(2 * w)
  const rise = Math.max(1, Math.round(attack * s.rate))
  const k = Math.exp(-1 / (tau * s.rate))
  let env = amp
  for (let i = 0; i < n; i++) {
    const y = c * y1 - y2
    y2 = y1
    y1 = y
    let e: number
    if (i < rise) e = (amp * i) / rise
    else {
      e = env
      env *= k
    }
    out[start + i] += y * e
  }
}

/** Hộp nhạc: tiếng "ting" trong veo, tắt dần, có tiếng gõ nhỏ lúc đầu */
export function box(s: Studio, t: number, note: number, vel = 0.8, out: Float32Array = s.box) {
  const f = hz(note) * (1 + (s.rand() - 0.5) * 0.003)
  const tau = Math.max(0.22, 0.62 - (note - 72) * 0.02) // nốt cao tắt nhanh hơn
  partial(s, out, t, f, vel, 0.002, tau)
  partial(s, out, t, f * 2, vel * 0.14, 0.002, tau * 0.35)
  partial(s, out, t, f * 6.27, vel * 0.045, 0.001, 0.03)
}

/** Piano điện (Rhodes): tiếng ấm, lúc gõ hơi "keng" rồi dịu dần */
export function piano(s: Studio, t: number, note: number, vel: number, length: number, out: Float32Array = s.piano) {
  const { rate } = s
  const inc = hz(note) / rate
  const start = startAt(s, t)
  const release = Math.round(length * rate)
  const n = Math.min(s.length - start, release + Math.round(0.6 * rate))
  const rise = Math.max(1, Math.round(0.006 * rate))
  const kDepth = Math.exp(-1 / (0.2 * rate))
  const kDecay = Math.exp(-1 / (0.7 * rate))
  const kRelease = Math.exp(-1 / (0.14 * rate))
  const sustain = vel * 0.3
  let depth = 1.5 * vel // độ "keng" lúc gõ, dịu dần về 0,12
  let carrier = 0
  let mod = 0
  let amp = 0
  for (let i = 0; i < n; i++) {
    const m = sin1(mod)
    mod += inc
    carrier += inc * (1 + depth * m)
    depth = 0.12 + (depth - 0.12) * kDepth
    if (i < rise) amp = (vel * i) / rise
    else if (i < release) amp = sustain + (amp - sustain) * kDecay
    else amp *= kRelease
    out[start + i] += sin1(carrier) * amp
  }
}

/** Bass tròn, mềm (sóng tam giác + sin) */
export function bass(s: Studio, t: number, note: number, vel: number, length: number) {
  const { rate } = s
  const inc = hz(note) / rate
  const start = startAt(s, t)
  const release = Math.round(length * rate)
  const n = Math.min(s.length - start, release + Math.round(0.4 * rate))
  const rise = Math.max(1, Math.round(0.012 * rate))
  const kDecay = Math.exp(-1 / (0.6 * rate))
  const kRelease = Math.exp(-1 / (0.07 * rate))
  const sustain = vel * 0.45
  let phase = 0
  let amp = 0
  for (let i = 0; i < n; i++) {
    if (i < rise) amp = (vel * i) / rise
    else if (i < release) amp = sustain + (amp - sustain) * kDecay
    else amp *= kRelease
    s.bass[start + i] += (0.55 * tri(phase) + 0.75 * sin1(phase)) * amp
    phase += inc
  }
}

/** Tiếng lắc shaker (ồn trắng, lọc ở mixdown) */
export function shake(s: Studio, t: number, vel: number) {
  const start = startAt(s, t)
  const n = Math.min(s.length - start, Math.round(0.3 * s.rate))
  const from = Math.floor(s.rand() * s.noise.length)
  const rise = Math.max(1, Math.round(0.004 * s.rate))
  const k = Math.exp(-1 / (0.032 * s.rate))
  let env = vel
  for (let i = 0; i < n; i++) {
    let e: number
    if (i < rise) e = (vel * i) / rise
    else {
      e = env
      env *= k
    }
    s.shaker[start + i] += s.noise[(from + i) % s.noise.length] * e
  }
}

/** Trống bass rất nhẹ, chỉ nghe rõ khi đeo tai nghe */
export function kick(s: Studio, t: number, vel: number) {
  const { rate } = s
  const start = startAt(s, t)
  const n = Math.min(s.length - start, Math.round(0.8 * rate))
  const rise = Math.max(1, Math.round(0.004 * rate))
  const k = Math.exp(-1 / (0.11 * rate))
  let env = vel
  let phase = 0
  for (let i = 0; i < n; i++) {
    const time = i / rate
    phase += (time < 0.12 ? 115 * (46 / 115) ** (time / 0.12) : 46) / rate
    let e: number
    if (i < rise) e = (vel * i) / rise
    else {
      e = env
      env *= k
    }
    s.drum[start + i] += sin1(phase) * e
  }
}

type GlideOptions = {
  type?: 'sine' | 'triangle'
  /** Tần số theo thời gian: [giây kể từ t, Hz], nối mượt với nhau */
  path: [number, number][]
  vel: number
  attack?: number
  /** Thời gian tắt (giây) */
  tau: number
  /** Rung (vibrato): tốc độ Hz, độ sâu Hz */
  vibrato?: [number, number]
}

/** Một tiếng trượt cao độ: bong bóng, lò xo, đồ chơi bóp kêu… */
export function glide(s: Studio, t: number, o: GlideOptions) {
  const { rate } = s
  const attack = o.attack ?? 0.003
  const start = startAt(s, t)
  const n = Math.min(s.length - start, Math.ceil((attack + o.tau * 6) * rate))
  const rise = Math.max(1, Math.round(attack * rate))
  const k = Math.exp(-1 / (o.tau * rate))
  const path = o.path
  let env = o.vel
  let phase = 0
  let seg = 0
  for (let i = 0; i < n; i++) {
    const time = i / rate
    while (seg < path.length - 1 && time > path[seg + 1][0]) seg++
    let f: number
    if (seg >= path.length - 1) f = path[path.length - 1][1]
    else {
      const [t0, f0] = path[seg]
      const [t1, f1] = path[seg + 1]
      f = f0 * (f1 / f0) ** Math.max(0, (time - t0) / (t1 - t0))
    }
    if (o.vibrato) f += o.vibrato[1] * Math.sin(TAU * o.vibrato[0] * time)
    phase += f / rate
    let e: number
    if (i < rise) e = (o.vel * i) / rise
    else {
      e = env
      env *= k
    }
    s.fx[start + i] += (o.type === 'triangle' ? tri(phase) : sin1(phase)) * e
  }
}

/** Tiếng "sột" (ồn trắng quét qua bộ lọc): lật trang, tiếng xu chạm nhau */
export function swish(s: Studio, t: number, from: number, to: number, length: number, vel: number, q = 1.2) {
  const { rate } = s
  const start = startAt(s, t)
  const n = Math.min(s.length - start, Math.round(length * rate))
  const offset = Math.floor(s.rand() * s.noise.length)
  const band = new Biquad()
  const rise = length * 0.3
  for (let i = 0; i < n; i++) {
    const time = i / rate
    if (i % 16 === 0) band.set('bandpass', from * (to / from) ** Math.min(1, time / length), q, rate)
    const e = time < rise ? (vel * time) / rise : vel * (1 - (time - rise) / (length - rise))
    s.fx[start + i] += band.run(s.noise[(offset + i) % s.noise.length]) * e
  }
}

/** Chuỗi nốt hộp nhạc gõ liền nhau (lấp lánh) */
export function twinkle(s: Studio, t: number, notes: string[], step: number, vel: number, fade = 0.6) {
  notes.forEach((name, i) => {
    const v = vel * (1 - (fade * i) / Math.max(1, notes.length))
    box(s, t + i * step, midi(name), v, s.fx)
  })
}

// --- Chơi một bài nhạc ---

/** 'A5:1.5 G5:.5' → các nốt với vị trí phách trong ô nhịp */
function parseLine(line: string): { at: number; note: string }[] {
  const out: { at: number; note: string }[] = []
  let beat = 0
  for (const token of line.split(/\s+/).filter(Boolean)) {
    const [note, length] = token.split(':')
    if (note !== '-') out.push({ at: beat, note })
    beat += Number(length)
  }
  return out
}

/** 'Dm7 G7' hoặc 'C:2 G7:1' → các hợp âm với vị trí và độ dài (phách) */
function parseChords(line: string, beatsPerBar: number): { at: number; shape: string; length: number }[] {
  const parts = line.split(/\s+/).filter(Boolean)
  const explicit = parts.some((p) => p.includes(':'))
  let beat = 0
  return parts.map((part) => {
    const [shape, length] = part.split(':')
    const beats = explicit ? Number(length) : beatsPerBar / parts.length
    const chord = { at: beat, shape, length: beats }
    beat += beats
    return chord
  })
}

/** Độ dài một vòng bài (giây), không tính phần bỏ ở đầu */
export function songSeconds(song: Song): number {
  return ((song.melody.length * song.beatsPerBar - (song.skip ?? 0)) * 60) / song.bpm
}

/** Một nốt (hoặc một hợp âm) của bài: lúc nào (giây) và cách chơi */
type SongEvent = { t: number; play: (s: Studio, t: number) => void }

/** Toàn bộ nốt của bài theo thời gian */
function songEvents(song: Song, start = 0.02): SongEvent[] {
  const rand = seeded(9)
  const beat = 60 / song.bpm
  const last = song.melody.length - 1
  const jitter = () => (rand() - 0.5) * 0.012
  /** Phách → giây (nốt nửa phách nghịch phách được "nhún" theo swing) */
  const time = (bar: number, b: number) => {
    const offbeat = Math.abs((b % 1) - 0.5) < 1e-6
    return start + (bar * song.beatsPerBar + b + (offbeat ? song.swing : 0) - (song.skip ?? 0)) * beat
  }
  const events: SongEvent[] = []
  const add = (t: number, play: SongEvent['play']) => events.push({ t: Math.max(0, t), play })

  song.chords.forEach((line, bar) => {
    for (const chord of parseChords(line, song.beatsPerBar)) {
      const shape: ChordShape | undefined = song.shapes[chord.shape]
      if (!shape) continue
      const notes = shape.notes.map(midi)
      const root = midi(shape.bass)
      const strike = (b: number, vel: number, length: number) => {
        const v = notes.map(() => vel * (0.9 + rand() * 0.2))
        add(time(bar, b) + jitter(), (s, t) => notes.forEach((n, i) => piano(s, t + i * 0.006, n, v[i], length * beat)))
      }
      const low = (b: number, note: number, vel: number, length: number) =>
        add(time(bar, b), (s, t) => bass(s, t, note, vel, length * beat))

      if (song.style === 'chill') {
        low(chord.at, root, 0.85, Math.min(chord.length, 3) * 0.92)
        if (chord.length >= 4) {
          low(chord.at + 3, root + 7, 0.5, 0.85)
          strike(chord.at, 0.7, 1.4)
          strike(chord.at + 1.5, 0.5, 2.3)
        } else {
          strike(chord.at, 0.62, chord.length - 0.1)
        }
      } else if (bar === last) {
        // Hợp âm kết: ngân dài
        low(chord.at, root, 0.8, song.beatsPerBar)
        strike(chord.at, 0.55, song.beatsPerBar + 1)
      } else {
        // Waltz: bùm (bass ở phách 1) – chát – chát (piano ở các phách sau)
        for (let b = chord.at; b < chord.at + chord.length - 1e-6; b += 1) {
          if (b === 0) low(b, root, 0.75, 0.95)
          else strike(b, 0.42, 0.8)
        }
      }
    }
  })

  song.melody.forEach((line, bar) => {
    for (const note of parseLine(line)) {
      const onBeat = Math.abs(note.at - Math.round(note.at)) < 1e-6
      const vel = (onBeat ? 0.9 : 0.72) * (0.94 + rand() * 0.12)
      const n = midi(note.note)
      add(time(bar, note.at) + jitter() * 0.5, (s, t) => box(s, t, n, vel))
    }
  })

  if (song.style === 'chill') {
    // Trống nhẹ: shaker mỗi nửa phách (nhấn nghịch phách), bass drum phách 1 và 3
    for (let bar = 0; bar <= last; bar++) {
      for (let b = 0; b < song.beatsPerBar; b += 0.5) {
        const vel = (b % 1 !== 0 ? 0.8 : 0.45) * (0.85 + rand() * 0.3)
        add(time(bar, b) + jitter() * 0.5, (s, t) => shake(s, t, vel))
      }
      add(time(bar, 0), (s, t) => kick(s, t, 0.75))
      add(time(bar, 2), (s, t) => kick(s, t, 0.5))
    }
  } else {
    // Kết bài: lấp lánh một chút
    add(time(last, 1.5), (s, t) => twinkle(s, t, ['G6', 'C7', 'E7', 'G7'], 0.06, 0.32))
  }
  return events
}

// --- Thu âm ---

type Level = {
  /** Âm lượng trung bình mong muốn (0–1, RMS); bỏ trống thì chỉnh theo đỉnh */
  rms?: number
  /** Đỉnh tối đa (0–1) */
  peak: number
}

/** Nhường máy cho giao diện một chút (để hiệu ứng không bị giật trong lúc thu) */
const breathe = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

/** Chỉnh to/nhỏ cho đúng mức mong muốn */
function normalize(channels: [Float32Array, Float32Array], level: Level) {
  let peak = 0
  let sum = 0
  for (const data of channels) {
    for (let i = 0; i < data.length; i++) {
      const v = data[i]
      if (Math.abs(v) > peak) peak = Math.abs(v)
      sum += v * v
    }
  }
  if (peak === 0) return
  const rms = Math.sqrt(sum / (channels[0].length * 2))
  const gain = Math.min(level.rms ? level.rms / rms : Infinity, level.peak / peak)
  for (const data of channels) for (let i = 0; i < data.length; i++) data[i] *= gain
}

/** Thu một tiếng ngắn (tiếng hiệu ứng) */
export function record(
  rate: number,
  seconds: number,
  build: (s: Studio) => void,
  level: Level,
  options: { wet?: Partial<Wet> } = {},
): Rendered {
  const s = studio(rate, seconds)
  build(s)
  const { dry, send } = mixdown(s, { ...DEFAULT_WET, ...options.wet })
  new Reverb(rate).run(send, dry, 0, send.length)
  normalize(dry, level)
  return { rate, channels: dry }
}

/**
 * Thu một bài nhạc theo từng khúc 2 ô nhịp (đỡ tốn bộ nhớ, giữa các khúc nhường máy cho giao diện),
 * rồi thêm tiếng vang cho cả bài. Nhạc nền: phần đuôi (nốt còn ngân, tiếng vang) được cộng vòng về đầu bài
 * để lặp lại liền mạch, không nghe chỗ nối.
 */
export async function recordSong(song: Song, rate: number, level: Level): Promise<Rendered> {
  const loop = song.style === 'chill'
  const seconds = songSeconds(song)
  const events = songEvents(song)
  const chunk = (2 * song.beatsPerBar * 60) / song.bpm
  const tail = 4
  const length = Math.round((loop ? seconds : seconds + tail) * rate)
  const work = Math.round((seconds + tail) * rate) // kể cả đuôi, trước khi cộng vòng
  const dry: [Float32Array, Float32Array] = [new Float32Array(work), new Float32Array(work)]
  const send = new Float32Array(work)
  const count = Math.max(1, Math.ceil(seconds / chunk))

  for (let k = 0; k < count; k++) {
    const from = k * chunk
    const to = k === count - 1 ? Infinity : from + chunk
    const mine = events.filter((e) => e.t >= from && e.t < to)
    if (mine.length === 0) continue
    const s = studio(rate, chunk + tail)
    for (const e of mine) e.play(s, e.t - from)
    const part = mixdown(s, DEFAULT_WET, from)
    const offset = Math.round(from * rate)
    for (let i = 0; i < s.length && offset + i < work; i++) {
      dry[0][offset + i] += part.dry[0][i]
      dry[1][offset + i] += part.dry[1][i]
      send[offset + i] += part.send[i]
    }
    await breathe()
  }

  // Tiếng vang cho cả bài, xử lý từng giây một
  const room = new Reverb(rate)
  for (let from = 0; from < work; from += rate) {
    room.run(send, dry, from, Math.min(work, from + rate))
    await breathe()
  }
  const out: [Float32Array, Float32Array] = [new Float32Array(length), new Float32Array(length)]
  for (let ch = 0; ch < 2; ch++) {
    const dst = out[ch]
    const d = dry[ch]
    for (let i = 0; i < work; i++) {
      if (i < length) dst[i] += d[i]
      else if (loop) dst[i % length] += d[i]
    }
  }
  normalize(out, level)
  return { rate, channels: out }
}
