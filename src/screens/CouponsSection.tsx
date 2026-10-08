import { useState } from 'react'
import { Modal } from '../components/Modal.tsx'
import { Sticker } from '../components/Sticker.tsx'
import { HUSBAND_NAME } from '../config.ts'
import { COUPONS, COUPON_BY_ID } from '../data/coupons.ts'
import { couponDelivery, deliverCoupon, redeemLoveCoupon } from '../game/actions.ts'
import { useGame } from '../game/store.ts'
import type { CouponState } from '../game/types.ts'
import { useUi } from '../game/ui.ts'
import { playSfx } from '../lib/sound.ts'

// Module 10: Love Coupons trong tab Collection.
// Phiếu đi qua 3 bước: Ready (bấm Use) → Waiting (email đã báo Chằm Chằm) → Done (Misu bấm "It happened").

const shortDate = (t: number) => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

function CouponCard({ id, coupon, onUse }: { id: string; coupon: CouponState; onUse: () => void }) {
  const now = useUi((s) => s.now)
  const markDone = useGame((s) => s.markCouponDone)
  const info = COUPON_BY_ID[id]
  if (!info) return null
  const done = Boolean(coupon.doneAt)
  const used = Boolean(coupon.usedAt)
  const delivery = couponDelivery(coupon.delivery, coupon.deliveryAt, now)

  return (
    <li
      className={`relative rounded-[24px] border-2 border-dashed px-4 py-3.5 ${
        done ? 'border-mint bg-mint/40' : used ? 'border-lavender bg-white' : 'border-peony bg-butter/70'
      }`}
    >
      <div className="flex items-start gap-3">
        <Sticker emoji={info.emoji} className={`text-[34px] ${done ? 'opacity-70' : ''}`} />
        <div className="min-w-0 flex-1">
          <p className={`font-display text-[17px] leading-tight font-bold ${done ? 'pr-14 text-plum-soft' : ''}`}>
            {info.title}
          </p>
          <p className="mt-1 text-[12px] font-bold text-plum-soft">
            {done
              ? `Done ${shortDate(coupon.doneAt!)} 💗`
              : used
                ? `Used ${shortDate(coupon.usedAt!)} · waiting for ${HUSBAND_NAME}`
                : `From Level ${coupon.level}`}
          </p>
        </div>
      </div>

      {!used && (
        <button
          type="button"
          onClick={onUse}
          className="press mt-3 w-full rounded-full bg-peony py-2.5 text-[15px] font-extrabold"
        >
          Use this coupon
        </button>
      )}
      {used && !done && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => {
              markDone(id)
              playSfx('chime')
            }}
            className="press w-full rounded-full bg-mint py-2.5 text-[15px] font-extrabold ring-1 ring-mint"
          >
            It happened 💗
          </button>
          {delivery === 'failed' ? (
            <button
              type="button"
              onClick={() => void deliverCoupon(id)}
              className="press mt-1.5 block w-full text-center text-[12px] font-extrabold text-peony-deep"
            >
              {HUSBAND_NAME} wasn’t told yet · Tap to retry
            </button>
          ) : (
            <p className="mt-1.5 text-center text-[12px] font-bold text-plum-soft">
              {delivery === 'sending' ? `Telling ${HUSBAND_NAME}…` : `${HUSBAND_NAME} got the message 💌`}
            </p>
          )}
        </div>
      )}
      {done && (
        <span
          aria-hidden
          className="absolute top-3 right-3 rotate-12 rounded-full border-2 border-peony-deep px-2 py-0.5 text-[11px] font-extrabold text-peony-deep"
        >
          DONE
        </span>
      )}
    </li>
  )
}

export function CouponsSection() {
  const coupons = useGame((s) => s.save.coupons)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  // Thứ tự: chưa dùng → đang chờ → đã xong; trong mỗi nhóm, phiếu mới nhận ở trên
  const rank = (c: CouponState) => (c.doneAt ? 2 : c.usedAt ? 1 : 0)
  const owned = Object.entries(coupons)
    .filter(([id]) => COUPON_BY_ID[id])
    .sort(([, a], [, b]) => rank(a) - rank(b) || b.gotAt - a.gotAt)
  const locked = COUPONS.length - owned.length
  const confirm = confirmId ? COUPON_BY_ID[confirmId] : undefined

  return (
    <section className="mt-6" aria-labelledby="coupons-title">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="coupons-title" className="font-display text-[22px] leading-tight font-bold">
          Love Coupons 🎟️
        </h2>
        <span className="text-[13px] font-bold text-plum-soft">
          {owned.length} of {COUPONS.length}
        </span>
      </div>
      <p className="mt-1 text-[14px] leading-snug text-plum-soft">
        Real-life treats from {HUSBAND_NAME}. A new one with every level up.
      </p>

      <ul className="mt-3 space-y-2.5">
        {owned.map(([id, coupon]) => (
          <CouponCard key={id} id={id} coupon={coupon} onUse={() => setConfirmId(id)} />
        ))}
        {locked > 0 && (
          <li className="flex items-center gap-3 rounded-[24px] border-2 border-dashed border-peony/40 px-4 py-3.5 text-plum-soft">
            <Sticker emoji="🔒" className="text-[26px] opacity-60" />
            <p className="text-[14px] font-bold">
              {locked} more {locked === 1 ? 'coupon' : 'coupons'} to unlock. Level up to get the next one!
            </p>
          </li>
        )}
      </ul>

      {confirm && confirmId && (
        <Modal labelledBy="coupon-confirm-title" onClose={() => setConfirmId(null)}>
          <Sticker emoji={confirm.emoji} className="text-[60px]" />
          <h2 id="coupon-confirm-title" className="mt-3 font-display text-[24px] leading-tight font-bold text-balance">
            Use this coupon?
          </h2>
          <p className="mt-2 text-[16px] leading-relaxed font-bold text-pretty">{confirm.title}</p>
          <p className="mt-2 text-[14px] leading-relaxed text-plum-soft">
            {HUSBAND_NAME} will get a message right away. Each coupon works once.
          </p>
          <button
            type="button"
            onClick={() => {
              redeemLoveCoupon(confirmId)
              setConfirmId(null)
            }}
            className="press mt-5 w-full rounded-full bg-peony py-3.5 text-[17px] font-extrabold"
          >
            Use it 💗
          </button>
          <button
            type="button"
            onClick={() => setConfirmId(null)}
            className="press mt-2 w-full rounded-full py-3 text-[15px] font-extrabold text-plum-soft"
          >
            Not yet
          </button>
        </Modal>
      )}
    </section>
  )
}
