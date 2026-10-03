import { useEffect, type ReactNode } from 'react'

type SheetProps = {
  open: boolean
  onClose: () => void
  /** id của tiêu đề trong sheet (cho trình đọc màn hình) */
  labelledBy: string
  children: ReactNode
}

/** Tấm trượt lên từ đáy màn hình, chạm ra ngoài hoặc bấm × để đóng */
export function Sheet({ open, onClose, labelledBy, children }: SheetProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40">
      <div aria-hidden className="absolute inset-0 animate-fade-in bg-plum/25" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] max-w-md animate-sheet-up flex-col rounded-t-[32px] bg-paper shadow-float"
      >
        <div aria-hidden className="flex justify-center pt-3 pb-1">
          <span className="h-1.5 w-10 rounded-full bg-peony/50" />
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="press absolute top-3 right-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-[22px] leading-none font-bold text-plum-soft ring-1 ring-petal"
        >
          ×
        </button>
        <div className="overflow-y-auto overscroll-contain px-5 pt-1 pb-[max(env(safe-area-inset-bottom),24px)]">
          {children}
        </div>
      </section>
    </div>
  )
}
