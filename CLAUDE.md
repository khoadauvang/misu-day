# Misu's Day

Game PWA (quà sinh nhật) mô phỏng cuộc sống thường ngày của Misu ở Sài Gòn. Đọc `docs/SPEC.md` trước khi code.

## Quy tắc

- Mọi chữ hiển thị trong game là tiếng Anh. Comment trong code viết tiếng Việt, ngắn gọn: chủ dự án đang học qua từng module.
- Nội dung (quận, POI, hoạt động, giá, sự kiện, lời nhắn) nằm trong `src/data/`; logic game nằm trong `src/game/`. Thêm nội dung thì không sửa logic.
- Chỉ nhắm iPhone Safari ở chế độ standalone (Add to Home Screen). Ô nhập liệu có cỡ chữ ≥ 16px để iOS không tự zoom.
- Màu và font chỉ dùng token trong `src/index.css`: paper, petal, peony, peony-deep, plum, plum-soft, hydrangea, lavender, butter, peach; `font-display` (Baloo 2), `font-sans` (Nunito). Chữ không dùng đen/trắng thuần. Mọi thứ bo tròn. Emoji hiển thị qua `<Sticker>`.
- Lưu game bằng localStorage qua `save()`/`load()` (Module 2). Đổi cấu trúc state thì tăng `SAVE_VERSION` và viết `migrate()`; không bao giờ làm mất save cũ.
- Không đổi domain production sau khi Misu bắt đầu chơi, vì dữ liệu gắn với domain.
- `npm run build` và `npm run lint` phải sạch trước khi commit.

## Lệnh

`npm run dev` · `npm run dev:phone` · `npm run build` · `npm run preview` · `npm run lint`
