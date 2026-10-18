# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Misu's Day

Game PWA (quà sinh nhật) mô phỏng cuộc sống thường ngày của Misu ở Sài Gòn. Đọc `docs/SPEC.md` trước khi code. Production: https://misuxinhdep.vercel.app (push `main` → Vercel tự deploy). Stack: React 19 + Zustand + Tailwind v4 + Vite + vite-plugin-pwa, lint bằng oxlint.

## Quy tắc

- Mọi chữ hiển thị trong game là tiếng Anh (tên riêng tiếng Việt giữ nguyên). Ngoại lệ duy nhất: thư sinh nhật (`src/data/birthday.ts`) giữ nguyên lời chủ dự án viết; không dịch, chỉ sửa chữ khi chủ dự án yêu cầu. Comment trong code viết tiếng Việt, ngắn gọn: chủ dự án đang học qua từng module.
- Nội dung (quận, địa điểm, hoạt động, giá, đồ, lời nhắn) nằm trong `src/data/`; luật chơi nằm trong `src/game/`. Thêm nội dung thì không sửa logic.
- Luật chơi viết thành hàm thuần trong `src/game/engine.ts` / `rules.ts` (nhận save + thời điểm, trả save mới); `store.ts` chỉ gọi các hàm đó và tự lưu.
- Thời gian luôn lấy qua `gameNow()` (`src/game/clock.ts`) để chế độ `?dev` tua giờ được. Ngày mới bắt đầu lúc 6:00 sáng (`gameDayKey`).
- Chỉ nhắm iPhone Safari ở chế độ standalone (Add to Home Screen). Ô nhập liệu có cỡ chữ ≥ 16px để iOS không tự zoom.
- Màu và font chỉ dùng token trong `src/index.css`: paper, petal, peony, peony-deep, plum, plum-soft, hydrangea, lavender, butter, peach, mint; `font-display` (Baloo 2), `font-sans` (Nunito), `font-hand` (Mali, chỉ cho thư sinh nhật). Chữ không dùng đen/trắng thuần. Mọi thứ bo tròn. Emoji hiển thị qua `<Sticker>`. Hình vẽ SVG (cún, bánh kem) được dùng màu riêng cho lông/bánh, còn viền và chi tiết dùng token.
- Đổi cấu trúc `SaveData` thì tăng `SAVE_VERSION` và viết `migrateSave()` trong `src/game/store.ts`; không bao giờ làm mất save cũ. Thêm trường mới có giá trị mặc định trong `newSave()` là đủ (`withDefaults()` tự trộn vào save cũ).
- `id` trong dữ liệu (phiếu coupon, phim, đồ, địa điểm/hoạt động qua `activityKey`) được lưu trong save: không đổi hay xóa `id` cũ, chỉ thêm mới.
- Không đổi domain production sau khi Misu bắt đầu chơi, vì dữ liệu gắn với domain. Domain cũng nằm trong `ALLOWED_HOSTS` của `api/message.js`.
- `npm run build` và `npm run lint` phải sạch trước khi commit. Repo không có test tự động.
- `README.md` (tiếng Việt) là hướng dẫn cho chủ dự án: bảng "Sửa nội dung thường gặp", trạng thái và lộ trình module. Thêm tính năng hay file nội dung mới thì cập nhật các bảng đó.

## Lệnh

`npm run dev` · `npm run dev:phone` · `npm run build` (`tsc -b` + `vite build`) · `npm run preview` · `npm run lint`

Thử nhanh không đụng app thật: mở `/?preview&dev` (nút 🛠 Dev: tua giờ, thêm tiền/XP, reset, thử cún, âm thanh, GIF phim). `?preview` bỏ qua màn bắt cài (`InstallGate`), `?dev` bật `DevPanel` và tua giờ.

## Kiến trúc

Luồng một hành động của người chơi, qua các lớp:

1. **Màn hình** (`src/screens/`, `src/overlays/`) gọi hàm trong `src/game/actions.ts`.
2. **`actions.ts`**: chỗ duy nhất có tác dụng phụ (popup kết quả qua `useUi`, phát tiếng `lib/sound.ts`, gọi mạng `lib/api.ts`, GIF `lib/giphy.ts`). Gọi action của store rồi xử lý kết quả.
3. **`store.ts`** (`useGame`, Zustand `persist` vào localStorage key `misu-day:save`): mỗi action chỉ là `applyX(save, ..., gameNow())`.
4. **`engine.ts` / `rules.ts`** + các file luật nhỏ (`energy`, `level`, `pet`, `husband`, `messages`, `movies`, `unlocks`): hàm thuần, đọc dữ liệu từ `src/data/`. Kiểu dữ liệu chung ở `types.ts`.

`ui.ts` (`useUi`) giữ trạng thái tạm không lưu: tab đang mở, popup kết quả, `now` (cập nhật mỗi 30 giây bởi `useGameClock`, hook này cũng gọi `tick()` để hồi năng lượng / qua ngày).

Tên nhân vật và tên game ở `src/config.ts`; `vite.config.ts` điền chúng vào `index.html` (`{{GAME_NAME}}`…) và manifest PWA. Service worker dạng `registerType: 'prompt'`, đăng ký trong `src/pwa/UpdateToast.tsx`.

**Tin nhắn / Love Coupon → email:** `lib/api.ts` POST tới `/api/message` → hàm Vercel `api/message.js` (JavaScript thuần + JSDoc, kiểm kiểu qua `tsconfig.api.json`) → Resend. Chạy local thì `vite.config.ts` giả lập đường này: in tin ra Terminal, không gửi email. Tin chưa gửi được sẽ được `retryUndelivered()` gửi lại khi mở app hoặc có mạng lại. Gửi từ chế độ preview vẫn ra email thật, tiêu đề có 🧪 [Test].

**Biến môi trường:** `RESEND_API_KEY`, `MESSAGE_TO` (chỉ trên Vercel, cho `api/message.js`); `VITE_GIPHY_KEY` (đóng vào bản build, local đặt trong `.env.local`; không có thì hiện emoji thay GIF).

Âm thanh (nhạc nền + hiệu ứng) tự tạo bằng Web Audio trong `src/lib/synth.ts` / `sfx.ts` / `sound.ts`, bài nhạc viết dạng nốt trong `src/data/music.ts`.
