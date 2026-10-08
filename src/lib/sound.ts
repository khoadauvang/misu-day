import { BGM, BIRTHDAY_SONG, MUSIC_VOLUME, SFX_VOLUME } from '../data/music.ts'
import { recordSfx, SFX_NAMES, type SfxName } from './sfx.ts'
import { recordSong, type Rendered } from './synth.ts'

// Âm thanh của game: nhạc nền + tiếng hiệu ứng.
// - iPhone chỉ cho phát tiếng sau lần chạm đầu tiên, nên nhạc bắt đầu khi Misu chạm vào màn hình.
// - Tiếng game theo nút gạt im lặng của iPhone (gạt sang im lặng là game im) và phát chung với nhạc app khác.
// - Thoát ra màn hình chính thì tạm dừng, mở lại thì phát tiếp.
// - Mọi nút bấm đều có tiếng "póc"; hành động đặc biệt (mua đồ, lên level…) gọi playSfx() để có tiếng riêng.

export type { SfxName }

let ctx: AudioContext | null = null
let musicBus: GainNode | null = null
let sfxBus: GainNode | null = null
let musicOn = false
let soundsOn = false

let music: Promise<AudioBuffer> | null = null
let playing: { source: AudioBufferSourceNode; fade: GainNode } | null = null
let musicLoading = false
const effects = new Map<SfxName, AudioBuffer>()
let effectsLoading = false
let birthday: Promise<AudioBuffer> | null = null

/** Lần chạm gần nhất (iPhone chỉ cho mở tiếng ngay sau một lần chạm) */
let gestureAt = -Infinity
/** Đếm số tiếng riêng đã phát, để tiếng "póc" của nút không chồng lên tiếng riêng */
let specials = 0

/** Âm lượng trung bình của nhạc nền sau khi thu (RMS ~ −18 dB), đỉnh tối đa ~ −1 dB */
const MUSIC_LEVEL = { rms: 0.126, peak: 0.89 }
/** Nhạc thu ở 32 kHz cho nhẹ (đủ trong cho tiếng hộp nhạc, loa điện thoại); tiếng hiệu ứng thu theo máy */
const MUSIC_RATE = 32_000

/** Mảng số đã thu → AudioBuffer để phát */
function toBuffer(rendered: Rendered): AudioBuffer {
  const buffer = ctx!.createBuffer(2, rendered.channels[0].length, rendered.rate)
  rendered.channels.forEach((data, ch) => buffer.getChannelData(ch).set(data))
  return buffer
}

const breathe = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

function canPlay(): boolean {
  if (!ctx) return false
  return ctx.state === 'running' || performance.now() - gestureAt < 1500
}

/** Gọi một lần khi mở game: tạo bộ âm thanh, chờ lần chạm đầu tiên */
export function initSound() {
  if (ctx || typeof window === 'undefined') return
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return
  try {
    // Theo nút gạt im lặng + phát chung với nhạc của app khác
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession
    if (session) session.type = 'ambient'
  } catch {
    // trình duyệt chưa hỗ trợ: bỏ qua
  }
  try {
    ctx = new Ctor({ latencyHint: 'interactive' })
  } catch {
    ctx = new Ctor()
  }

  // Chặn tiếng bị rè khi nhiều tiếng chồng nhau
  const limiter = ctx.createDynamicsCompressor()
  limiter.threshold.value = -4
  limiter.knee.value = 2
  limiter.ratio.value = 12
  limiter.attack.value = 0.002
  limiter.release.value = 0.12
  limiter.connect(ctx.destination)
  musicBus = ctx.createGain()
  musicBus.gain.value = MUSIC_VOLUME
  musicBus.connect(limiter)
  sfxBus = ctx.createGain()
  sfxBus.gain.value = SFX_VOLUME
  sfxBus.connect(limiter)

  for (const type of ['pointerdown', 'touchend', 'click', 'keydown']) document.addEventListener(type, unlock, true)
  document.addEventListener('click', tapSound, true)
  document.addEventListener('visibilitychange', onVisibility)

  if (soundsOn) loadEffects()
  if (musicOn) void startMusic()
}

/** Mỗi lần chạm: mở khóa tiếng (iPhone), bắt đầu nhạc nếu chưa phát */
function unlock() {
  if (!ctx) return
  gestureAt = performance.now()
  if (ctx.state !== 'running' && (musicOn || soundsOn)) {
    ctx.resume().catch(() => {})
    // iPhone đời cũ: phát một mẩu im lặng ngay trong lúc chạm để "mở" loa
    const silent = ctx.createBufferSource()
    silent.buffer = ctx.createBuffer(1, 1, ctx.sampleRate)
    silent.connect(ctx.destination)
    silent.start(0)
  }
  if (musicOn && !playing) void startMusic()
}

/** Tiếng "póc" cho mọi nút. Thêm data-sound="off" vào nút (hoặc khung chứa) để tắt */
function tapSound(event: Event) {
  const target = event.target instanceof Element ? event.target : null
  const button = target?.closest('button, a[href], [role="button"]')
  if (!button || button.closest('[data-sound="off"]')) return
  const before = specials
  // Chờ nút chạy xong: nếu nút đã phát tiếng riêng thì thôi
  window.setTimeout(() => {
    if (specials === before) play('tap')
  }, 0)
}

function onVisibility() {
  if (!ctx) return
  if (document.hidden) ctx.suspend().catch(() => {})
  else if (musicOn || soundsOn) ctx.resume().catch(() => {}) // iPhone có thể chờ lần chạm tiếp theo
}

function play(name: SfxName) {
  if (!ctx || !sfxBus || !soundsOn || !canPlay()) return
  const buffer = effects.get(name)
  if (!buffer) return
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(sfxBus)
  source.start()
}

/** Phát một tiếng hiệu ứng (mua đồ, lên level, gửi tin…) */
export function playSfx(name: SfxName) {
  specials++
  play(name)
}

/** Thu sẵn các tiếng hiệu ứng, lần lượt từng tiếng cho máy đỡ nặng */
function loadEffects() {
  if (!ctx || effectsLoading) return
  effectsLoading = true
  const rate = ctx.sampleRate
  void (async () => {
    for (const name of SFX_NAMES) {
      try {
        effects.set(name, toBuffer(recordSfx(name, rate)))
      } catch {
        // tiếng này lỗi thì bỏ qua, game vẫn chạy
      }
      await breathe()
    }
  })()
}

async function startMusic() {
  if (!ctx || !musicBus || playing || musicLoading || !musicOn) return
  musicLoading = true
  let buffer: AudioBuffer
  try {
    music ??= recordSong(BGM, MUSIC_RATE, MUSIC_LEVEL).then(toBuffer)
    buffer = await music
  } catch {
    music = null
    return
  } finally {
    musicLoading = false
  }
  // Chưa chạm lần nào: chờ unlock() gọi lại
  if (!ctx || !musicBus || playing || !musicOn || !canPlay()) return
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true
  const fade = ctx.createGain()
  const now = ctx.currentTime
  fade.gain.setValueAtTime(0, now)
  fade.gain.linearRampToValueAtTime(1, now + 2.5) // nhạc nhỏ dần lên cho êm
  source.connect(fade).connect(musicBus)
  source.start(now)
  playing = { source, fade }
}

function stopMusic() {
  if (!ctx || !playing) return
  const { source, fade } = playing
  playing = null
  const now = ctx.currentTime
  fade.gain.cancelScheduledValues(now)
  fade.gain.setValueAtTime(fade.gain.value, now)
  fade.gain.linearRampToValueAtTime(0, now + 0.6)
  source.stop(now + 0.65)
}

/** Bật/tắt nhạc nền. Gọi ngay trong lúc chạm nút để iPhone cho phát */
export function setMusicOn(on: boolean) {
  musicOn = on
  if (on) void startMusic()
  else stopMusic()
}

/** Bật/tắt tiếng hiệu ứng */
export function setSoundsOn(on: boolean) {
  soundsOn = on
  if (on) loadEffects()
}

/** Thu sẵn bài Happy Birthday (gọi khi thư sinh nhật hiện ra, để lúc mở quà là có ngay) */
export function prepareBirthdaySong() {
  initSound()
  if (ctx) birthday ??= recordSong(BIRTHDAY_SONG, MUSIC_RATE, { peak: 0.63 }).then(toBuffer)
}

/** Mở quà sinh nhật: hộp nhạc Happy Birthday, nhạc nền nhỏ lại trong lúc phát */
export function playBirthdaySong() {
  specials++
  if (!soundsOn || !canPlay()) return
  prepareBirthdaySong()
  void birthday?.then((buffer) => {
    if (!ctx || !sfxBus || !musicBus) return
    const now = ctx.currentTime
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(sfxBus)
    source.start(now)
    const gain = musicBus.gain
    gain.cancelScheduledValues(now)
    gain.setValueAtTime(gain.value, now)
    gain.linearRampToValueAtTime(MUSIC_VOLUME * 0.15, now + 0.5)
    gain.setValueAtTime(MUSIC_VOLUME * 0.15, now + Math.max(0.5, buffer.duration - 2))
    gain.linearRampToValueAtTime(MUSIC_VOLUME, now + buffer.duration + 1)
  })
}

/** Cho trang Dev: âm thanh đang ra sao */
export function soundStatus() {
  return {
    state: ctx?.state ?? 'unsupported',
    music: playing ? 'playing' : musicLoading ? 'loading' : 'off',
    effects: `${effects.size}/${SFX_NAMES.length}`,
  }
}
