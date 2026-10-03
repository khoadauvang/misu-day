# Misu's Day 🐰

Game PWA làm quà sinh nhật cho Misu. Spec đầy đủ ở [docs/SPEC.md](docs/SPEC.md).

**Trạng thái:** đã xong Module 1 (khung app + PWA). Tiếp theo là Module 2–3.

## 1. Cài môi trường dev trên Mac (làm 1 lần, khoảng 20 phút)

| Công cụ | Cách cài | Kiểm tra (gõ trong Terminal) |
|---|---|---|
| Node.js | Tải bản **LTS** ở [nodejs.org](https://nodejs.org), cài như app bình thường | `node -v` ra v22.12 trở lên |
| Git | Gõ `git --version`. Nếu Mac hỏi cài "command line developer tools", bấm **Install** | `git --version` |
| VS Code | Tải ở [code.visualstudio.com](https://code.visualstudio.com) | |

Khai báo tên cho Git (chỉ 1 lần):

```bash
git config --global user.name "Tên của bạn"
git config --global user.email "email-dùng-cho-github@example.com"
```

Cần thêm hai tài khoản: **GitHub** ([github.com](https://github.com)) và **Vercel** ([vercel.com](https://vercel.com): Sign Up → Continue with GitHub → chọn gói Hobby, miễn phí).

## 2. Chạy game trên Mac

1. Giải nén `misu-day.zip`, để thư mục `misu-day` ở chỗ dễ tìm, ví dụ `~/Projects/misu-day`.
2. Mở VS Code → **File → Open Folder…** → chọn thư mục `misu-day`. Nếu VS Code gợi ý cài extension (Tailwind CSS, Oxc), bấm **Install**.
3. Vào **Terminal → New Terminal**, chạy:

   ```bash
   npm install
   npm run dev
   ```

4. Mở http://localhost:5173 trên Mac. Mỗi lần sửa code và lưu file, trang tự cập nhật.

**Xem thử trên iPhone** (iPhone và Mac cùng Wi-Fi): chạy `npm run dev:phone`, rồi mở địa chỉ ở dòng `Network: http://192.168.x.x:5173` bằng Safari trên iPhone. Cách này chỉ để xem nhanh; muốn cài thật thì dùng link Vercel ở bước 4.

## 3. Đưa code lên GitHub

1. Trong VS Code, bấm biểu tượng **Source Control** (hình nhánh cây ở thanh bên trái).
2. Bấm **Publish to GitHub** → chọn **private repository**.
3. Lần đầu, VS Code mở trình duyệt để bạn đăng nhập GitHub và bấm cho phép.

## 4. Deploy lên Vercel

1. Vào [vercel.com](https://vercel.com) → **Add New… → Project** → **Import** repo `misu-day`.
2. Đặt **Project Name**. Tên này cũng là địa chỉ web: `<tên>.vercel.app`.

   > ⚠️ Dữ liệu game của Misu gắn với địa chỉ này. Chốt tên trước 9/10 và không đổi sau ngày đó.

3. Framework Preset tự nhận là **Vite**. Bấm **Deploy**, khoảng 1 phút là có link.

## 5. Cài lên iPhone

1. Mở link Vercel bằng **Safari**.
2. Bấm **•••** cạnh thanh địa chỉ → **Share**. Trên iOS cũ, nút Share nằm ở thanh dưới.
3. Bấm **Add to Home Screen**, giữ **Open as Web App** bật, rồi bấm **Add**.
4. Mở icon con thỏ trên màn hình chính, game sẽ chạy toàn màn hình.

Muốn xem nhanh trong Safari mà không cài, thêm `?preview` vào cuối link.

## 6. Mỗi lần sửa code

1. Sửa xong, vào **Source Control** → gõ mô tả ngắn → **Commit** → **Sync Changes**.
2. Vercel tự build lại, mất khoảng 1 phút.
3. Lần tới mở app trên iPhone sẽ hiện **A new update is ready → Update now**.

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
├─ index.html          trang gốc + thẻ meta cho iPhone
├─ vite.config.ts      cấu hình build + PWA (tên app, icon, chạy offline)
├─ public/             icon app, sticker thỏ
├─ docs/SPEC.md        spec game
└─ src/
   ├─ config.ts        tên game, tên Misu, tên chồng (sửa ở đây)
   ├─ index.css        bảng màu, font, kiểu sticker
   ├─ App.tsx          khung app: 4 tab + màn hướng dẫn cài
   ├─ components/      thanh tab, sticker
   ├─ pwa/             màn hướng dẫn cài, thông báo cập nhật
   ├─ lib/device.ts    nhận biết iPhone, đã cài app hay chưa
   ├─ screens/         Home, Map, Messages, Collection
   └─ data/            nội dung game (quận, nhóm đồ…)
```

## Lộ trình module

| Module | Nội dung | Ngày |
|---|---|---|
| M1 | Khung app + PWA ✅ | 1/10 |
| M2–M3 | Lưu dữ liệu, đồng hồ thế giới | 2/10 |
| M4–M5 | Bản đồ, hoạt động, kinh tế, nhật ký, Collection | 3/10 |
| M6–M8 | Level, sự kiện ngẫu nhiên, Hubby | 4/10 |
| M9–M10 | Tin nhắn thành email, Love Coupons, nhận nuôi Golden | 5/10 |
| | Hình + giao diện · Nội dung · Test + khóa code | 6–8/10 |
