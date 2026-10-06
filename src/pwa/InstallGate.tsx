import type { ReactNode } from 'react'
import { GAME_NAME } from '../config.ts'
import { ART } from '../data/art.ts'

/** Biểu tượng Share của iOS (hình hộp có mũi tên lên) */
function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-label="Share"
      role="img"
      className="inline-block h-[1.15em] w-[1.15em] -translate-y-[2px] align-middle"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12" />
      <path d="m8 7 4-4 4 4" />
      <path d="M8 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2" />
    </svg>
  )
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-[24px] bg-white/85 p-4 ring-1 ring-petal">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-peony pt-0.5 font-display text-[20px] leading-none font-bold">
        {n}
      </span>
      <div className="pt-1 text-[16px] leading-snug">{children}</div>
    </li>
  )
}

/**
 * Hiện khi mở game trong tab Safari trên iPhone.
 * Hướng dẫn thêm vào màn hình chính để dữ liệu luôn nằm trong app.
 */
export function InstallGate() {
  return (
    <main className="paper-dots h-full overflow-y-auto px-6 pt-[max(env(safe-area-inset-top),56px)] pb-12">
      <div className="mx-auto flex max-w-sm flex-col items-center text-center">
        {/* Misu và Chằm Chằm đứng cạnh nhau (anh liếc sang Misu) */}
        <div aria-hidden className="flex items-end justify-center">
          <img src={ART.misu.full} alt="" draggable={false} className="sticker-art relative z-10 h-48 w-auto -rotate-3" />
          <img src={ART.husband.full} alt="" draggable={false} className="sticker-art -ml-5 h-48 w-auto rotate-2" />
        </div>
        <h1 className="mt-5 font-display text-[32px] leading-[1.05] font-bold text-balance">
          {GAME_NAME} lives on your Home Screen
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-pretty text-plum-soft">
          Add it once. It opens full screen and keeps your progress safe on this iPhone.
        </p>
      </div>

      <ol className="mx-auto mt-8 max-w-sm space-y-3">
        <Step n={1}>
          Tap <b>•••</b> next to the address bar, then tap <b>Share</b>.
          <span className="mt-1 block text-[14px] text-plum-soft">
            On older iOS, tap <ShareIcon /> at the bottom of the screen.
          </span>
        </Step>
        <Step n={2}>
          Tap <b>Add to Home Screen</b> and keep <b>Open as Web App</b> on.
        </Step>
        <Step n={3}>
          Tap <b>Add</b>, then open {GAME_NAME} from your Home Screen.
        </Step>
      </ol>
    </main>
  )
}
