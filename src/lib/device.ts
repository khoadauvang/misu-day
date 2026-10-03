// Nhận biết đang chạy ở đâu: app trên màn hình chính hay tab Safari

/** Đang mở từ icon trên màn hình chính (chạy toàn màn hình)? */
export function isStandalone(): boolean {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true
  return iosStandalone || window.matchMedia('(display-mode: standalone)').matches
}

/** iPhone / iPad (iPad đời mới tự nhận là Mac nên phải kiểm thêm màn hình cảm ứng) */
export function isIOS(): boolean {
  return (
    /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

/** Thêm ?preview vào cuối link để xem thử trong tab Safari, không cần cài */
export function isPreview(): boolean {
  return new URLSearchParams(window.location.search).has('preview')
}

/** Thêm ?dev vào link để hiện bảng công cụ thử nghiệm (tua giờ, thêm tiền…) */
export function isDevMode(): boolean {
  return new URLSearchParams(window.location.search).has('dev')
}

/**
 * Dữ liệu của app trên màn hình chính tách riêng với tab Safari.
 * Vì vậy trên iPhone, game chỉ cho chơi khi đã "Add to Home Screen",
 * để tiến trình luôn nằm một chỗ.
 */
export function shouldShowInstallGate(): boolean {
  if (import.meta.env.DEV) return false
  return isIOS() && !isStandalone() && !isPreview()
}
