# Misu's Day 🐰

Game PWA làm quà sinh nhật cho Misu: https://misuxinhdep.vercel.app · Spec đầy đủ ở [docs/SPEC.md](docs/SPEC.md).

**Trạng thái:** xong Module 1–6, 8, 9 (khung app, lưu dữ liệu, đồng hồ, bản đồ, hoạt động + Collection, thưởng level, trạng thái Chằm Chằm, tin nhắn → email). Tiếp theo: nhận nuôi Golden, hình + giao diện, M7.

## Sửa nội dung thường gặp

| Muốn sửa | Mở file | Ghi chú |
|---|---|---|
| Giá một món | `src/data/places.ts` | Thay `cost: PRICE` bằng số, ví dụ `cost: 65_000` |
| Đổi giá tạm cho tất cả | `src/data/economy.ts` | `PRICE = 500_000` |
| Lời nhắn buổi sáng | `src/data/morningNotes.ts` | Thêm câu vào cuối danh sách, viết tiếng Anh |
| Tên gọi (Chằm Chằm, bè chẽ, tên game) | `src/config.ts` | |
| Tiền mỗi sáng, năng lượng, nhịp lên level | `src/data/economy.ts` | |
| Thêm món đồ sưu tầm | `src/data/items.ts` | Rồi gắn `item: 'id-món'` vào một hoạt động |
| Chuyến đi World | `src/data/destinations.ts` | |
| Lịch của Chằm Chằm, việc ở công ty | `src/data/husband.ts` | |
| Tin nhanh, câu trả lời của Chằm Chằm | `src/data/messages.ts` | Mỗi loại tin có câu riêng theo việc anh đang làm |
| Thưởng lên level, tiền xin thêm | `src/data/economy.ts` | `LEVEL_REWARD_STEP`, `EXTRA_MONEY` |

Sửa xong: Source Control → Commit → **Sync Changes**. Khoảng 1 phút sau, app trên iPhone hiện "A new update is ready".

> **Trước khi sửa code trên Mac, luôn bấm Sync Changes** để kéo phần Claude đã đẩy lên về máy trước, tránh hai bên sửa chồng lên nhau.

## Chế độ thử (không ảnh hưởng app thật)

Mở **https://misuxinhdep.vercel.app/?preview&dev** trong tab Safari (hoặc trên Mac). Dữ liệu ở đó tách riêng với app đã cài trên màn hình chính. Nút **🛠 Dev** ở góc phải trên có:

- **+1 hour / Next morning:** tua giờ để thử năng lượng hồi và tiền buổi sáng
- **+10,000,000₫ / +500 XP / Refill energy:** để thử đồ đắt và nơi bị khóa
- **Reset time / Reset game**

Tin nhắn gửi ở chế độ này vẫn thành email thật, tiêu đề có **🧪 [Test]**.

## 1. Cài môi trường dev trên Mac (làm 1 lần)

| Công cụ | Cách cài | Kiểm tra (gõ trong Terminal) |
|---|---|---|
| Node.js | Tải bản **LTS** ở [nodejs.org](https://nodejs.org) | `node -v` ra v22.12 trở lên |
| Git | Gõ `git --version`. Nếu Mac hỏi cài "command line developer tools", bấm **Install** | `git --version` |
| VS Code | Tải ở [code.visualstudio.com](https://code.visualstudio.com) | |

```bash
git config --global user.name "Tên của bạn"
git config --global user.email "email-dùng-cho-github@example.com"
```

## 2. Chạy game trên Mac

```bash
npm install
npm run dev
```

Mở http://localhost:5173. Mỗi lần lưu file, trang tự cập nhật. Xem thử trên iPhone (cùng Wi-Fi): `npm run dev:phone` rồi mở địa chỉ ở dòng `Network:` bằng Safari.

## 3. Deploy

Mỗi lần push lên nhánh `main` (Sync Changes), Vercel tự build lại trong khoảng 1 phút. Nếu build lỗi, Vercel giữ nguyên bản đang chạy.

Tin nhắn → email cần 2 biến trong Vercel → Settings → Environment Variables (Production): `RESEND_API_KEY` (key của Resend) và `MESSAGE_TO` (email của bạn, trùng email đăng ký Resend). Email đầu tiên có thể vào Spam: đánh dấu "Not spam".

> Vercel gói Hobby chặn deploy nếu email tác giả commit không gắn với tài khoản GitHub của bạn. Trên Mac, đặt `git config user.email` đúng email GitHub của bạn.

## Lệnh

| Lệnh | Làm gì |
|---|---|
| `npm run dev` | Chạy thử trên Mac |
| `npm run dev:phone` | Chạy thử, mở được từ iPhone cùng Wi-Fi |
| `npm run build` | Build bản production vào `dist/` (Vercel tự chạy lệnh này) |
| `npm run preview` | Chạy bản đã build để kiểm tra |
| `npm run lint` | Soát lỗi code |

## Cấu trúc thư mục

```
misu-day/
├─ index.html            trang gốc + thẻ meta cho iPhone
├─ vite.config.ts        cấu hình build + PWA (tên app, icon, chạy offline)
├─ public/               icon app, sticker thỏ
├─ docs/SPEC.md          spec game
├─ api/message.js        hàm Vercel: tin nhắn trong game → email (Resend)
└─ src/
   ├─ config.ts          tên game, Misu, Chằm Chằm, bè chẽ
   ├─ data/              NỘI DUNG: quận, địa điểm, hoạt động, đồ, World, lời nhắn, các con số
   ├─ game/              LUẬT CHƠI: đồng hồ, năng lượng, level, kiểm tra hoạt động, lưu dữ liệu
   │  ├─ engine.ts       các phép tính chính (qua ngày, nhận tiền, làm hoạt động)
   │  ├─ rules.ts        khi nào làm được/không được một hoạt động
   │  └─ store.ts        nơi giữ dữ liệu + tự lưu vào điện thoại
   ├─ components/        nút, sheet, hộp thoại, sticker, thanh tab
   ├─ overlays/          hộp tiền buổi sáng, popup kết quả, công cụ dev
   ├─ screens/           Home, Map (+ map/), Messages, Collection
   ├─ pwa/               màn hướng dẫn cài, thông báo cập nhật
   └─ lib/               nhận biết iPhone + chế độ dev, gọi /api, đo bàn phím
```

## Lộ trình module

| Module | Nội dung | Trạng thái |
|---|---|---|
| M1 | Khung app + PWA | ✅ |
| M2–M3 | Lưu dữ liệu, đồng hồ thế giới (tiền 6:00 sáng, năng lượng hồi) | ✅ |
| M4–M5 | Bản đồ 7 quận, địa điểm, hoạt động, nhật ký, Collection, World | ✅ |
| M6, M8 | Thưởng khi lên level, trạng thái Chằm Chằm | ✅ |
| M7 | Sự kiện ngẫu nhiên | 6/10 nếu kịp |
| M9 | Tin nhắn thành email | ✅ |
| M10 | Love Coupons (nếu chốt), nhận nuôi Golden | 6–7/10 |
| | Hình + giao diện · Nội dung · Test + khóa code | 6–8/10 |
