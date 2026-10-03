import { Sticker } from '../components/Sticker.tsx'
import { HUSBAND_NAME, MISU_NICKNAME } from '../config.ts'

// Module 1: khung chat mẫu. Module 9 nối vào email thật qua /api/message.

function Bubble({ children }: { children: string }) {
  return (
    <p className="w-fit max-w-[82%] rounded-[22px] rounded-bl-md bg-white px-4 py-2.5 text-[16px] leading-snug ring-1 ring-petal">
      {children}
    </p>
  )
}

export function MessagesScreen() {
  return (
    <div className="mx-auto max-w-md">
      <header className="flex items-center gap-3">
        <Sticker emoji="🤵🏻" className="text-[42px]" />
        <div>
          <h1 className="font-display text-[30px] leading-none font-bold">{HUSBAND_NAME}</h1>
          <p className="mt-1 text-[14px] font-semibold text-plum-soft">Usually replies right away</p>
        </div>
      </header>

      <div className="mt-6 space-y-2">
        <Bubble>{`Hi ${MISU_NICKNAME} 💗 Our chat opens in Module 9.`}</Bubble>
        <Bubble>Every message you send here will reach me for real.</Bubble>
      </div>

      <div
        aria-hidden
        className="mt-8 flex items-center gap-2 rounded-full bg-white/85 p-1.5 pl-4 opacity-70 ring-1 ring-petal"
      >
        <span className="flex-1 text-[16px] text-plum-soft">Message {HUSBAND_NAME}</span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-peony font-extrabold">↑</span>
      </div>
    </div>
  )
}
