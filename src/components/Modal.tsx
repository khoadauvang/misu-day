import type { ReactNode } from 'react'

type ModalProps = {
  /** id của tiêu đề trong hộp thoại (cho trình đọc màn hình) */
  labelledBy: string
  children: ReactNode
  /** Không truyền thì chỉ đóng được bằng nút bên trong hộp thoại */
  onClose?: () => void
}

/** Hộp thoại giữa màn hình */
export function Modal({ labelledBy, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-6">
      <div aria-hidden className="absolute inset-0 animate-fade-in bg-plum/30" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative max-h-[86dvh] w-full max-w-sm animate-pop-in overflow-y-auto rounded-[32px] bg-paper px-6 pt-7 pb-6 text-center shadow-float"
      >
        {children}
      </section>
    </div>
  )
}
