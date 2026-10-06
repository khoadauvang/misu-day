import { useEffect, useRef, type ComponentType } from 'react'
import { TabBar } from './components/TabBar.tsx'
import type { TabId } from './components/tabs.ts'
import { retryUndelivered } from './game/actions.ts'
import { useGame } from './game/store.ts'
import { useUi } from './game/ui.ts'
import { useGameClock } from './game/useGameClock.ts'
import { isDevMode, shouldShowInstallGate } from './lib/device.ts'
import { AdoptModal } from './overlays/AdoptModal.tsx'
import { AllowanceModal } from './overlays/AllowanceModal.tsx'
import { BirthdayIntro } from './overlays/BirthdayIntro.tsx'
import { DevPanel } from './overlays/DevPanel.tsx'
import { ResultModal } from './overlays/ResultModal.tsx'
import { InstallGate } from './pwa/InstallGate.tsx'
import { UpdateToast } from './pwa/UpdateToast.tsx'
import { CollectionScreen } from './screens/CollectionScreen.tsx'
import { HomeScreen } from './screens/HomeScreen.tsx'
import { MapScreen } from './screens/MapScreen.tsx'
import { MessagesScreen } from './screens/MessagesScreen.tsx'

const SCREENS: Record<TabId, ComponentType> = {
  home: HomeScreen,
  map: MapScreen,
  messages: MessagesScreen,
  collection: CollectionScreen,
}

/** Game chính: 4 tab + các hộp thoại */
function Game() {
  const tab = useUi((s) => s.tab)
  const setTab = useUi((s) => s.setTab)
  const letterOpen = useUi((s) => s.letterOpen)
  // Lần mở game đầu tiên: thư sinh nhật hiện trước, hộp tiền buổi sáng chờ đọc xong thư
  const birthdayPending = useGame((s) => s.save.birthdayAt === null)
  const scrollRef = useRef<HTMLElement>(null)
  useGameClock()

  // Module 9: tin nào chưa tới hộp thư của Chằm Chằm thì gửi lại khi mở app và khi có mạng lại
  useEffect(() => {
    const retry = () => void retryUndelivered()
    retry()
    window.addEventListener('online', retry)
    return () => window.removeEventListener('online', retry)
  }, [])

  // Đổi tab (bấm thanh tab, hoặc nút "Go to the Pet Shop") thì cuộn lên đầu
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [tab])

  const Screen = SCREENS[tab]
  const changeTab = (next: TabId) => {
    setTab(next)
    scrollRef.current?.scrollTo({ top: 0 }) // bấm lại tab đang mở cũng cuộn lên đầu
  }

  return (
    <div className="paper-dots relative h-full">
      <main
        ref={scrollRef}
        className="h-full overflow-y-auto overscroll-contain px-5 pt-[max(env(safe-area-inset-top),24px)] pb-36"
      >
        <Screen />
      </main>
      <UpdateToast />
      <TabBar current={tab} onChange={changeTab} />
      {isDevMode() && <DevPanel />}
      <ResultModal />
      <AdoptModal />
      {!birthdayPending && <AllowanceModal />}
      {(birthdayPending || letterOpen) && (
        <BirthdayIntro key={birthdayPending ? 'first' : 'reread'} mode={birthdayPending ? 'first' : 'reread'} />
      )}
    </div>
  )
}

export default function App() {
  // Mở trong tab Safari trên iPhone → hướng dẫn thêm vào màn hình chính
  if (shouldShowInstallGate()) return <InstallGate />
  return <Game />
}
