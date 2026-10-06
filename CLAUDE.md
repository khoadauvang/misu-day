# Misu's Day

Game PWA (quà sinh nhật) mô phỏng cuộc sống thường ngày của Misu ở Sài Gòn. Đọc `docs/SPEC.md` trước khi code. Production: https://misuxinhdep.vercel.app (push `main` → Vercel tự deploy).

## Quy tắc

- Mọi chữ hiển thị trong game là tiếng Anh (tên riêng tiếng Việt giữ nguyên). Ngoại lệ duy nhất: thư sinh nhật (`src/data/birthday.ts`) giữ nguyên lời chủ dự án viết; không dịch, chỉ sửa chữ khi chủ dự án yêu cầu. Comment trong code viết tiếng Việt, ngắn gọn: chủ dự án đang học qua từng module.
- Nội dung (quận, địa điểm, hoạt động, giá, đồ, lời nhắn) nằm trong `src/data/`; luật chơi nằm trong `src/game/`. Thêm nội dung thì không sửa logic.
- Luật chơi viết thành hàm thuần trong `src/game/engine.ts` / `rules.ts` (nhận save + thời điểm, trả save mới); `store.ts` chỉ gọi các hàm đó và tự lưu.
- Thời gian luôn lấy qua `gameNow()` (`src/game/clock.ts`) để chế độ `?dev` tua giờ được. Ngày mới bắt đầu lúc 6:00 sáng (`gameDayKey`).
- Chỉ nhắm iPhone Safari ở chế độ standalone (Add to Home Screen). Ô nhập liệu có cỡ chữ ≥ 16px để iOS không tự zoom.
- Màu và font chỉ dùng token trong `src/index.css`: paper, petal, peony, peony-deep, plum, plum-soft, hydrangea, lavender, butter, peach, mint; `font-display` (Baloo 2), `font-sans` (Nunito), `font-hand` (Mali, chỉ cho thư sinh nhật). Chữ không dùng đen/trắng thuần. Mọi thứ bo tròn. Emoji hiển thị qua `<Sticker>`. Hình vẽ SVG (cún, bánh kem) được dùng màu riêng cho lông/bánh, còn viền và chi tiết dùng token.
- Đổi cấu trúc `SaveData` thì tăng `SAVE_VERSION` và viết `migrateSave()` trong `src/game/store.ts`; không bao giờ làm mất save cũ. Thêm trường mới có giá trị mặc định trong `newSave()` là đủ.
- Không đổi domain production sau khi Misu bắt đầu chơi, vì dữ liệu gắn với domain.
- `npm run build` và `npm run lint` phải sạch trước khi commit.

## Lệnh

`npm run dev` · `npm run dev:phone` · `npm run build` · `npm run preview` · `npm run lint`

Thử nhanh không đụng app thật: mở `/?preview&dev` (nút 🛠 Dev: tua giờ, thêm tiền/XP, reset).
