import { useRegisterSW } from 'virtual:pwa-register/react'
import { Sticker } from '../components/Sticker.tsx'

const ONE_HOUR = 60 * 60 * 1000

/**
 * Đăng ký service worker (giúp app chạy offline) và báo khi có bản cập nhật mới.
 * Mỗi lần bạn deploy lên Vercel, lần sau Misu mở app sẽ thấy thông báo này.
 */
export function UpdateToast() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return
      const checkForUpdate = () => {
        registration.update().catch(() => {}) // đang offline thì bỏ qua
      }
      // App trên iPhone thường chỉ "ngủ" chứ không tắt hẳn,
      // nên kiểm tra mỗi khi Misu mở lại app và mỗi giờ
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') checkForUpdate()
      })
      setInterval(checkForUpdate, ONE_HOUR)
    },
  })

  if (!needRefresh) return null

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-[calc(max(env(safe-area-inset-bottom),14px)_+_84px)] z-30 px-4"
    >
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-[26px] border border-white bg-butter p-2.5 pl-4 shadow-float">
        <Sticker emoji="🎁" className="text-[28px]" />
        <p className="flex-1 text-[15px] leading-tight font-extrabold">A new update is ready</p>
        <button
          type="button"
          onClick={() => updateServiceWorker(true)}
          className="press rounded-full bg-peony px-4 py-2.5 text-[14px] font-extrabold"
        >
          Update now
        </button>
      </div>
    </div>
  )
}
