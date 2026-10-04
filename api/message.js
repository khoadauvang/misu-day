// @ts-check
// Module 9: Misu gửi tin trong game → hàm này (chạy trên Vercel) → Resend → email về hộp thư của Chằm Chằm.
//
// Cần 2 biến môi trường trên Vercel (Settings → Environment Variables):
// - RESEND_API_KEY: API key của Resend
// - MESSAGE_TO: email nhận tin (phải trùng email đăng ký Resend, vì gửi từ onboarding@resend.dev)
//
// Viết bằng JavaScript (kiểm tra kiểu qua JSDoc + tsconfig.api.json) để Vercel chạy thẳng, không cần biên dịch.

const RESEND_URL = 'https://api.resend.com/emails'
const FROM_ADDRESS = 'onboarding@resend.dev'
const TIME_ZONE = 'Asia/Ho_Chi_Minh'
/** Chỉ nhận yêu cầu gửi từ trang game (và máy dev) */
const ALLOWED_HOSTS = ['misuxinhdep.vercel.app', 'localhost', '127.0.0.1']
const MAX_BODY_BYTES = 20_000

/**
 * Dữ liệu game gửi lên (xem src/lib/api.ts)
 * @typedef {{ time: string, text: string }} DiaryLine
 * @typedef {{
 *   test: boolean, game: string, player: string, husband: string,
 *   kind: string, text: string, item: { emoji: string, name: string } | null,
 *   money: number, reply: string, sentAt: number,
 *   snapshot: { level: number, money: number, energy: number, stickers: number, status: string, diary: DiaryLine[] }
 * }} MessagePayload
 */

/** @param {unknown} value @param {number} max */
function str(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

/** @param {unknown} value */
function num(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

/** Tên hiển thị: bỏ ký tự có thể làm hỏng dòng "From" của email @param {unknown} value @param {string} fallback */
function name(value, fallback) {
  return str(value, 40).replace(/[<>"\r\n]/g, '') || fallback
}

/**
 * Đọc và làm sạch dữ liệu gửi lên. Sai định dạng thì trả về null.
 * @param {any} body
 * @returns {MessagePayload | null}
 */
export function parsePayload(body) {
  if (!body || typeof body !== 'object') return null
  const text = str(body.text, 500)
  if (!text) return null
  const snapshot = body.snapshot && typeof body.snapshot === 'object' ? body.snapshot : {}
  /** @type {any[]} */
  const diary = Array.isArray(snapshot.diary) ? snapshot.diary.slice(0, 8) : []
  const item = body.item && typeof body.item === 'object' ? body.item : null
  return {
    test: body.test === true,
    game: name(body.game, "Misu's Day"),
    player: name(body.player, 'Misu'),
    husband: name(body.husband, 'Chằm Chằm'),
    kind: str(body.kind, 20),
    text,
    item: item && str(item.name, 60) ? { emoji: str(item.emoji, 8), name: str(item.name, 60) } : null,
    money: Math.max(0, num(body.money)),
    reply: str(body.reply, 300),
    sentAt: num(body.sentAt) || Date.now(),
    snapshot: {
      level: num(snapshot.level),
      money: num(snapshot.money),
      energy: num(snapshot.energy),
      stickers: num(snapshot.stickers),
      status: str(snapshot.status, 80),
      diary: diary
        .map((line) => ({ time: str(line?.time, 12), text: str(line?.text, 160) }))
        .filter((line) => line.text),
    },
  }
}

/** Chặn chữ trong tin nhắn bị hiểu thành HTML @param {string} text */
function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

/** 4000000 → "4,000,000₫" @param {number} n */
function money(n) {
  return `${Math.round(n).toLocaleString('en-US')}₫`
}

/** @param {string} text @param {number} max */
function shorten(text, max) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

/**
 * Soạn email: tiêu đề, bản HTML và bản chữ thường
 * @param {MessagePayload} p
 */
export function buildEmail(p) {
  const when = new Date(p.sentAt).toLocaleString('en-US', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
  const s = p.snapshot
  const subject = `${p.test ? '🧪 [Test] ' : ''}💌 ${p.player}: ${shorten(p.text, 60)}`
  const e = escapeHtml

  const extras = []
  if (p.item) extras.push(`📎 ${e(p.player)} showed you a sticker: ${e(p.item.emoji)} <b>${e(p.item.name)}</b>`)
  if (p.money > 0) extras.push(`💸 In the game, ${e(p.husband)} sent her <b>${money(p.money)}</b> extra.`)

  const diaryHtml = s.diary.length
    ? `<ul style="margin:6px 0 0;padding-left:18px;">${s.diary
        .map((d) => `<li style="margin:3px 0;">${d.time ? `<span style="color:#8A6877;">${e(d.time)}</span> · ` : ''}${e(d.text)}</li>`)
        .join('')}</ul>`
    : `<p style="margin:6px 0 0;color:#8A6877;">Nothing yet today.</p>`

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px 12px;background:#FFF7F9;color:#5A3A4A;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
<tr><td style="padding:0 4px 10px;font-size:14px;font-weight:700;color:#8A6877;">${p.test ? '🧪 Test message · ' : ''}💌 ${e(p.player)} sent you a message in ${e(p.game)}</td></tr>
<tr><td style="background:#F4A6BD;border-radius:22px 22px 6px 22px;padding:14px 18px;font-size:18px;line-height:1.45;">${e(p.text)}</td></tr>
${extras.map((x) => `<tr><td style="padding:10px 4px 0;font-size:15px;line-height:1.45;">${x}</td></tr>`).join('\n')}
${
  p.reply
    ? `<tr><td style="padding:14px 0 0;"><div style="background:#ffffff;border:1px solid #FFE4EC;border-radius:22px 22px 22px 6px;padding:12px 16px;font-size:15px;line-height:1.45;"><div style="font-size:12px;font-weight:700;color:#8A6877;">${e(p.husband)} in the game replied</div>${e(p.reply)}</div></td></tr>`
    : ''
}
<tr><td style="padding:20px 0 0;"><div style="background:#ffffff;border:1px solid #FFE4EC;border-radius:22px;padding:16px 18px;font-size:15px;line-height:1.5;">
<div style="font-size:13px;font-weight:800;color:#8A6877;">${e(p.player)} right now</div>
<div style="margin-top:6px;">⭐ Level ${s.level} · 💰 ${money(s.money)} · ⚡ ${Math.floor(s.energy)}/100 · 🎀 ${s.stickers} stickers</div>
${s.status ? `<div>${e(p.husband)} in the game: ${e(s.status)}</div>` : ''}
<div style="margin-top:12px;font-size:13px;font-weight:800;color:#8A6877;">Today so far</div>
${diaryHtml}
</div></td></tr>
<tr><td style="padding:16px 4px 0;font-size:12px;line-height:1.5;color:#8A6877;">Sent ${e(when)} (Vietnam time). Replies to this email don’t reach the game, so text her back for real 😉</td></tr>
</table></td></tr></table>
</body></html>`

  const textLines = [
    `${p.player} sent you a message in ${p.game}${p.test ? ' (test)' : ''}:`,
    '',
    `"${p.text}"`,
    ...(p.item ? [`Sticker: ${p.item.emoji} ${p.item.name}`] : []),
    ...(p.money > 0 ? [`In the game, ${p.husband} sent her ${money(p.money)} extra.`] : []),
    ...(p.reply ? ['', `${p.husband} in the game replied: "${p.reply}"`] : []),
    '',
    `${p.player} right now: Level ${s.level} · ${money(s.money)} · Energy ${Math.floor(s.energy)}/100 · ${s.stickers} stickers`,
    ...(s.status ? [`${p.husband} in the game: ${s.status}`] : []),
    '',
    'Today so far:',
    ...(s.diary.length ? s.diary.map((d) => `- ${d.time ? `${d.time} · ` : ''}${d.text}`) : ['- Nothing yet today.']),
    '',
    `Sent ${when} (Vietnam time).`,
  ]

  return { subject, html, text: textLines.join('\n') }
}

/** @param {string | null} origin */
function allowedOrigin(origin) {
  if (!origin) return true // một số trình duyệt không gửi Origin khi gọi cùng trang
  try {
    const host = new URL(origin).hostname
    return ALLOWED_HOSTS.includes(host) || /^misuxinhdep-[a-z0-9-]+\.vercel\.app$/.test(host)
  } catch {
    return false
  }
}

/** @param {number} status @param {Record<string, unknown>} body */
function reply(status, body) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })
}

/**
 * POST /api/message
 * @param {Request} request
 */
export async function POST(request) {
  if (!allowedOrigin(request.headers.get('origin'))) return reply(403, { ok: false, error: 'forbidden' })

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.MESSAGE_TO
  if (!apiKey || !to) {
    console.error('Thiếu RESEND_API_KEY hoặc MESSAGE_TO trong Environment Variables của Vercel')
    return reply(500, { ok: false, error: 'not-configured' })
  }

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) return reply(413, { ok: false, error: 'too-large' })
  let payload
  try {
    payload = parsePayload(JSON.parse(raw))
  } catch {
    payload = null
  }
  if (!payload) return reply(400, { ok: false, error: 'bad-request' })

  const email = buildEmail(payload)
  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `"${payload.game}" <${FROM_ADDRESS}>`,
      to: [to],
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  })
  if (!res.ok) {
    console.error('Resend từ chối gửi email:', res.status, await res.text())
    return reply(502, { ok: false, error: 'send-failed' })
  }
  return reply(200, { ok: true })
}
