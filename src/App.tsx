import { useRef, useState, type ComponentType } from 'react'
import { TabBar } from './components/TabBar.tsx'
import type { TabId } from './components/tabs.ts'
import { shouldShowInstallGate } from './lib/device.ts'
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

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const scrollRef = useRef<HTMLElement>(null)

  // Mở trong tab Safari trên iPhone → hướng dẫn thêm vào màn hình chính
  if (shouldShowInstallGate()) return <InstallGate />

  const Screen = SCREENS[tab]

  const changeTab = (next: TabId) => {
    setTab(next)
    scrollRef.current?.scrollTo({ top: 0 })
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
    </div>
  )
}
