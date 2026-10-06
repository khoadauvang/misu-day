import { useEffect, useRef } from 'react'

// Pháo hoa + pháo giấy vẽ bằng canvas cho màn mừng sinh nhật. Màu lấy từ bảng màu của game.
// intensity: 'high' = bắn liên tục (lúc mở đầu), 'low' = thỉnh thoảng một quả (lúc đọc thư).
// Máy bật "Giảm chuyển động" (Reduce Motion) thì không bắn.

export type FireworksIntensity = 'high' | 'low'

const TOKENS = ['--color-peony', '--color-butter', '--color-lavender', '--color-hydrangea', '--color-mint', '--color-peach']
const MAX_PARTICLES = 900

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  /** 1 → 0, hết thì biến mất */
  life: number
  decay: number
  size: number
  color: string
  shape: 'dot' | 'heart' | 'paper'
  gravity: number
  /** Lực cản mỗi khung hình (0.9 = chậm nhanh, 0.99 = bay xa) */
  drag: number
  angle: number
  spin: number
}

type Rocket = { x: number; y: number; vy: number; targetY: number; color: string }

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath()
  ctx.moveTo(x, y + s * 0.9)
  ctx.bezierCurveTo(x - s * 1.4, y, x - s * 0.7, y - s, x, y - s * 0.3)
  ctx.bezierCurveTo(x + s * 0.7, y - s, x + s * 1.4, y, x, y + s * 0.9)
  ctx.fill()
}

type FireworksProps = {
  intensity?: FireworksIntensity
  /** Đổi số này (lớn hơn 0) để bắn thêm một đợt pháo giấy, ví dụ lúc mở quà */
  pop?: number
}

export function Fireworks({ intensity = 'high', pop = 0 }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intensityRef = useRef(intensity)
  const popRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    intensityRef.current = intensity
  }, [intensity])

  useEffect(() => {
    if (pop > 0) popRef.current?.()
  }, [pop])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const root = getComputedStyle(document.documentElement)
    const colors = [...TOKENS.map((token) => root.getPropertyValue(token).trim()).filter(Boolean), '#ffffff']
    const pick = () => colors[Math.floor(Math.random() * colors.length)]

    let w = 0
    let h = 0
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const parts: Particle[] = []
    const rockets: Rocket[] = []

    /** Một quả pháo nổ thành vòng tròn đốm sáng (thỉnh thoảng có trái tim) */
    const explode = (x: number, y: number, color: string) => {
      const n = intensityRef.current === 'high' ? 44 : 30
      for (let i = 0; i < n && parts.length < MAX_PARTICLES; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.25
        const speed = 110 + Math.random() * 120
        parts.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          life: 1,
          decay: 0.5 + Math.random() * 0.35,
          size: 2 + Math.random() * 2,
          color: Math.random() < 0.7 ? color : pick(),
          shape: Math.random() < 0.16 ? 'heart' : 'dot',
          gravity: 60,
          drag: 0.955,
          angle: 0,
          spin: 0,
        })
      }
    }

    /** Pháo giấy bắn chéo lên từ góc dưới (dir = 1: sang phải, -1: sang trái) */
    const confetti = (x: number, y: number, dir: 1 | -1) => {
      for (let i = 0; i < 70 && parts.length < MAX_PARTICLES; i++) {
        const a = -Math.PI / 2 + dir * (0.15 + Math.random() * 0.75)
        const speed = 380 + Math.random() * 420
        parts.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          life: 1,
          decay: 0.28 + Math.random() * 0.2,
          size: 4 + Math.random() * 4,
          color: pick(),
          shape: Math.random() < 0.2 ? 'heart' : 'paper',
          gravity: 420,
          drag: 0.965,
          angle: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 14,
        })
      }
    }

    popRef.current = () => {
      confetti(w * 0.1, h * 0.92, 1)
      confetti(w * 0.9, h * 0.92, -1)
    }
    if (intensityRef.current === 'high') popRef.current()

    let wait = 250
    let last = performance.now()
    let raf = 0
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      wait -= dt * 1000
      if (wait <= 0) {
        rockets.push({
          x: w * (0.15 + Math.random() * 0.7),
          y: h + 8,
          vy: -(560 + Math.random() * 260),
          targetY: h * (0.1 + Math.random() * 0.3),
          color: pick(),
        })
        wait = intensityRef.current === 'high' ? 420 + Math.random() * 520 : 2400 + Math.random() * 2200
      }

      ctx.clearRect(0, 0, w, h)

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.y += r.vy * dt
        if (r.y <= r.targetY) {
          explode(r.x, r.y, r.color)
          rockets.splice(i, 1)
          continue
        }
        ctx.globalAlpha = 0.9
        ctx.fillStyle = r.color
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 0.35
        ctx.fillRect(r.x - 1, r.y + 4, 2, 16) // vệt đuôi
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        const k = Math.pow(p.drag, dt * 60)
        p.vx *= k
        p.vy = p.vy * k + p.gravity * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.angle += p.spin * dt
        p.life -= p.decay * dt
        if (p.life <= 0 || p.y > h + 40) {
          parts.splice(i, 1)
          continue
        }
        ctx.globalAlpha = Math.min(1, p.life * 1.4)
        ctx.fillStyle = p.color
        if (p.shape === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size * 1.3)
        } else if (p.shape === 'paper') {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(p.angle)
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2) // mảnh giấy lật lật
          ctx.restore()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      popRef.current = null
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}
