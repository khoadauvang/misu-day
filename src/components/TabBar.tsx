import { Sticker } from './Sticker.tsx'
import { TABS, type TabId } from './tabs.ts'

type TabBarProps = {
  current: TabId
  onChange: (tab: TabId) => void
}

/** Thanh tab nổi ở đáy màn hình, chừa chỗ cho thanh Home của iPhone */
export function TabBar({ current, onChange }: TabBarProps) {
  return (
    <nav
      aria-label="Main"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-4 pb-[max(env(safe-area-inset-bottom),14px)]"
    >
      <div className="pointer-events-auto mx-auto flex max-w-md gap-1 rounded-[30px] border border-white bg-white/80 p-1.5 shadow-float backdrop-blur-xl">
        {TABS.map((tab) => {
          const active = tab.id === current
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={active ? 'page' : undefined}
              className={`press flex flex-1 flex-col items-center gap-1 rounded-[24px] pt-2 pb-1.5 transition-colors ${
                active ? 'bg-petal text-plum' : 'text-plum-soft'
              }`}
            >
              <Sticker emoji={tab.emoji} className={`text-[26px] ${active ? '' : 'opacity-60'}`} />
              <span className="text-[11px] leading-none font-extrabold">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
