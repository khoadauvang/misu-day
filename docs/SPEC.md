# Misu's Day — Spec v1.2

*Cập nhật 07/10/2026 · "Misu's Day" là tên tạm, đổi được · Cập nhật file này mỗi khi có quyết định mới.*

- **Link game:** https://misuxinhdep.vercel.app (đã chốt, không đổi sau 9/10)
- **Code:** GitHub `khoadauvang/misu-day`, nhánh `main` → Vercel tự deploy

## 0. Tóm tắt

Game PWA trên iPhone mô phỏng cuộc sống thường ngày của Misu ở Sài Gòn. Mỗi sáng **Chằm Chằm** (chồng NPC) chuyển 4 triệu kèm một lời nhắn. Misu chọn đi đâu, làm gì, sưu tầm đồ, lên level để mở khóa nơi mới và các chuyến du lịch. Quà sinh nhật 09/10/2026.

## 1. Nguyên tắc (không đổi)

1. **100% tiếng Anh** trong game: giao diện, nội dung, tin nhắn. Tên riêng tiếng Việt giữ nguyên (Chằm Chằm, bè chẽ, Phú Nhuận, Bánh Tráng Trộn A Lâm).
2. **Chỉ iPhone.** Misu chơi từ icon trên màn hình chính, mỗi lần vài phút. Không cần hỗ trợ Mac.
3. **Thế giới chạy theo giờ thật 24/7.** Khi mở app, game tính bù mọi thứ đã xảy ra lúc tắt.
4. **Nội dung là dữ liệu.** Địa điểm, hoạt động, giá, sự kiện, lời nhắn nằm trong `src/data/`. Thêm nội dung không phải sửa logic.
5. **Dễ thương, không phạt.** Sự kiện phần lớn vui; chi phí phát sinh nhỏ.
6. **Mỗi bản cập nhật là một món quà nhỏ.** App báo "A new update is ready".
7. Giao diện hồng nhạt (không hồng đậm), chibi, bo tròn.

## 2. Phong cách hình ảnh: "sổ sticker của Misu"

App giống một cuốn sổ planner pastel. Mọi thứ Misu làm hoặc mua đều thành sticker: viền trắng cắt bế, bóng mờ màu mận.

| Token | Hex | Dùng cho |
|---|---|---|
| paper | `#FFF7F9` | nền |
| petal | `#FFE4EC` | mảng nền phụ, tab đang chọn, District 1 |
| peony | `#F4A6BD` | màu chính: nút, District 9 |
| plum | `#5A3A4A` | chữ (thay cho màu đen) |
| hydrangea | `#B4C6F2` | năng lượng, sông Sài Gòn, District 7 |
| lavender | `#D6C4F2` | XP, District 2 |
| butter | `#FFE7A6` | tiền, District 3 |
| peach | `#FFD9C9` | District 5 |
| mint | `#CDEFE0` | Phú Nhuận, nhãn "Free" |

- **Font:** Baloo 2 cho tiêu đề và con số, Nunito cho chữ thường. Cả hai có dấu tiếng Việt.
- **Hình:** emoji iOS dạng sticker. Chỉ cần vẽ riêng: chibi Misu, chibi Chằm Chằm, chó Golden. Bản đồ Sài Gòn vẽ bằng SVG trong code.

## 3. Màn hình và cách chơi

Thanh tab nổi ở đáy: **Home · Map · Messages · Collection**.

### Mỗi sáng
- 6:00 sáng là ngày mới. Lần mở app đầu tiên trong ngày hiện hộp **Today's allowance**: lời nhắn của Chằm Chằm + 4,000,000₫, Misu bấm **Collect** để nhận.
- Vắng nhiều ngày: hộp **While you were away** cộng dồn tiền các buổi sáng đã lỡ.

### Home ✅
- Lời chào theo giờ + ngày; avatar; Level + thanh XP; ví tiền 💰; năng lượng ⚡ (kèm "Full in 2h 30m").
- Lời nhắn hôm nay của Chằm Chằm, dạng tờ giấy dán băng keo.
- **At home:** hoạt động miễn phí ở nhà — xem sitcom, rom-com, tập ở nhà, đọc sách (cần mua sách trước), chợp mắt (1 lần/ngày, hồi 30 năng lượng).
- **Today's diary:** nhật ký trong ngày, mới nhất ở trên.
- Thẻ trạng thái của Chằm Chằm theo giờ (M8 ✅): đang làm gì + "until 5:45 PM"; nền mint khi đang ở bên Misu.
- Dưới thanh XP: "🔓 New places at Level X" (level kế tiếp có mở khóa).
- *Sẽ thêm:* thú cưng (sau khi nhận nuôi).

### Map ✅

```
[Saigon | World]
 ├─ Saigon → bản đồ 7 quận → chạm quận → sheet danh sách địa điểm
 │                              → chạm địa điểm → các hoạt động
 │                                  → "Do it" → popup kết quả
 │                                     (tiền, năng lượng, XP, sticker, nhật ký)
 └─ World: Vietnam · Asia · Europe · Americas (khóa)
        → chạm → yêu cầu (Level + vé máy bay) + "This trip opens in a future update"
```

- Địa điểm chưa mở hiện ổ khóa "Lv X"; vào xem vẫn được, nút "Do it" mờ kèm lý do.
- Lý do không làm được: Reach Level X · Open 5 PM – 2 AM · Done for today · Buy a book first · Not enough money · Need more energy · Coming soon.
- Giờ mở cửa: Riverside Bar 17:00–02:00; Concert Park tối thứ Sáu và thứ Bảy 19:00–23:00.

### Messages ✅
- Chat kiểu iMessage với Chằm Chằm (M9). Lần đầu hiện lời chào "Hi bè chẽ 💗 Text me anytime…".
- Tin nhanh (hàng chip trên ô nhập): "I miss you 🥺", "I'm hungry 🍜", "Can I have a little extra? 💸", "Come home early tonight 🏠", "Look what I bought 🛍️". Misu cũng tự gõ được (tối đa 500 ký tự).
- "Look what I bought" tự gửi kèm sticker món đồ mua gần nhất.
- "Can I have a little extra?" 1 lần/ngày: Chằm Chằm gửi thêm 1,000,000₫ (`EXTRA_MONEY`), hiện thẻ "+1,000,000₫ added to your wallet" và ghi nhật ký. Dùng rồi thì chip đổi thành "Extra again tomorrow 💸".
- Chằm Chằm "đang gõ…" (3 chấm) rồi trả lời bằng câu viết sẵn, tùy loại tin và việc anh đang làm (sáng sớm, ở công ty, ăn trưa, lái xe, ở nhà/cuối tuần, tập band, ngủ). Câu trả lời sửa trong `src/data/messages.ts`.
- Dưới tin của Misu: "Sending…" → "Delivered" khi email đã đi; lỗi thì "Not delivered · Tap to retry". Mở app lại hoặc có mạng lại thì tự gửi lại các tin chưa tới (trong 3 ngày).
- Tối đa 30 tin/ngày (`DAILY_MESSAGE_LIMIT`), quá thì hiện "That's a lot of love for one day 💌 More tomorrow!".
- Mỗi tin Misu gửi đi thành một email thật về hộp thư của bạn (mục 9).

### Collection ✅
- Sổ sticker theo nhóm: Bags · Shoes · Beauty · Jewelry & watches · Tech · Plushies · Flowers · Books · Home decor · Souvenirs.
- Món đã có hiện màu (mua lại thì ×2, ×3…), món chưa có là ô trống viền đứt. Hiện tại có 33 món.
- Love Coupons cũng sẽ nằm ở đây, nếu chốt làm MFe4.

## 4. Bản đồ Sài Gòn: quy luật chia quận

Mỗi quận một chủ đề, dựa theo tính chất quận ngoài đời nhưng không bắt buộc đúng 100%.

| Quận | Chủ đề | Địa điểm (Level mở khóa) |
|---|---|---|
| D1 | 👜 Luxury & fashion | Sneaker & Lifestyle Store (1) · Beauty Counter (1) · Tech Store (3) · Luxury Boulevard (5) · Watch & Jewelry House (7) |
| D3 | ☕ Cafés, books & beauty | Garden Café (1) · Bookstore (1) · Beauty Salon: nail, nhuộm tóc, gội đầu dưỡng sinh (1) · Flower Market (1) · Spa & Massage (2) · City Library & History Museum (4) |
| Phú Nhuận | 🧋 Street snacks | ⭐ GMI Tea: trà sữa bạc hà (1) · ⭐ Bánh Tráng Trộn A Lâm (1) |
| D7 | 🍣 Japan & Korea town | Japanese Corner (1) · Korea Town (1) · Dairy Queen (1) · RMIT Campus: miễn phí, +XP (1) |
| D5 | 🥟 Chinatown eats | Dim Sum House (1) · Hot Pot (3) · Roast Duck & Noodles (4) |
| D2 | 🍸 Thảo Điền chill | Fitness Club (1) · Riverside Bar (3) · Home Decor Studio (4) · Pet Shop (5) |
| D9 | 🎤 Concerts & cinema | Cute Shop: gấu bông, Fuggler, Miniso, Moji, Muji (1) · Cinema (2) · Concert Park (5) |

Tổng cộng 27 địa điểm, khoảng 70 hoạt động. Chi tiết từng hoạt động nằm trong `src/data/places.ts`.

## 5. World: các map khác

| Vùng | Điểm đến | Mở khóa | Vé máy bay |
|---|---|---|---|
| Vietnam | Đà Lạt 🇻🇳 (đồi cẩm tú cầu, vườn lavender) | Lv 7 | 3,000,000₫ |
| Asia | Seoul 🇰🇷 | Lv 8 | 12,000,000₫ |
| Asia | Tokyo 🇯🇵 | Lv 10 | 15,000,000₫ |
| Europe | Paris 🇫🇷 | Lv 14 | 35,000,000₫ |
| Europe | London 🇬🇧 | Lv 14 | 35,000,000₫ |
| Europe | Milan 🇮🇹 | Lv 16 | 38,000,000₫ |
| Americas | New York 🇺🇸 | Lv 20 | 45,000,000₫ |

Ở v1.0, chạm vào điểm đến sẽ thấy yêu cầu (đánh dấu đã đạt/chưa) + "This trip opens in a future update". Khi làm xong nội dung một nơi, đổi `open: true` trong `src/data/destinations.ts`.

## 6. Kinh tế và tiến trình

- **Giá tạm:** mọi sản phẩm/dịch vụ đều **500,000₫** (`PRICE` trong `src/data/economy.ts`). Bạn sẽ sửa giá từng món sau trong `src/data/places.ts`. Hoạt động miễn phí giữ nguyên 0₫: học ở RMIT, đọc ở thư viện, đọc sách ở góc nhà sách, ngắm đồ ở Luxury Boulevard, chơi với cún ở Pet Shop, hoạt động ở nhà.
- **Allowance:** 4,000,000₫ lúc 6:00 sáng, Misu bấm Collect. Vắng N ngày thì nhận đủ N lần.
- **Energy:** tối đa 100, hồi +10 mỗi giờ kể cả khi tắt app. Ăn uống 5–10, mua sắm 10–15, gym 25, concert 30. Massage, gội đầu dưỡng sinh và chợp mắt thì **hồi** năng lượng.
- **XP / Level:** từ level n lên n+1 cần 100 × n XP. Chơi đều thì khoảng 1 tuần tới Lv5, 3–4 tuần tới Lv10.
- **Lên level (M6 ✅):** Chằm Chằm thưởng Level × 500,000₫ (`LEVEL_REWARD_STEP`), tự vào ví + ghi nhật ký. Popup kết quả hiện "Level up!", số tiền thưởng và danh sách "Now open" (địa điểm, hoạt động, chuyến đi vừa mở). Lên nhiều level một lúc thì nhận thưởng từng level. Danh sách mở khóa đọc thẳng từ `unlockLevel` trong dữ liệu (`src/game/unlocks.ts`).
- **"Can I have a little extra? 💸" (M9 ✅):** 1 lần/ngày, Chằm Chằm gửi thêm 1,000,000₫ (`EXTRA_MONEY` trong `src/data/economy.ts`).
- Chế độ 28 triệu/tuần để sau.

## 7. Chằm Chằm (chồng NPC)

- **Xưng hô:** Misu gọi chồng là **Chằm Chằm**, chồng gọi Misu là **bè chẽ** (`src/config.ts`).
- **Lời nhắn buổi sáng:** hiện có 2 câu mẫu trong `src/data/morningNotes.ts`, quay vòng mỗi ngày. Bạn tự viết thêm.

| Thời gian | Trạng thái (M8 ✅, sửa chữ/giờ trong `src/data/husband.ts`) |
|---|---|
| T2–T6, 6:00–8:30 | Getting ready for work ☕ |
| T2–T6, 8:30–9:00 | Driving to the office 🚗 |
| T2–T6, 9:00–17:00 | At the office 💼 (xoay vòng: board meeting, closing a big deal…; 12:00–13:00 lunch break 🍱) |
| T2–T6, 17:00–17:45 | Driving home 🚗 |
| Mỗi ngày, 17:45–23:00 | Home with you 🏠 |
| Mỗi ngày, 23:00–6:00 | Sleeping 😴 |
| T7–CN | Weekend with you 💗 |
| Cách 1 tuần, T7 hoặc CN (ngẫu nhiên nhưng cố định trong tuần đó), 14:00–18:00 | At band practice 🥁 |

- **Con cái:** chưa có trong v1.

## 8. Thú cưng

- Pet Shop (D2, Lv5): "Adopt a Golden Retriever" đang hiện **Coming soon**. Sẽ làm cùng M9–M10: nhận nuôi, đặt tên, chó hiện ở Home, "Walk the dog" mỗi ngày.
- Mèo và các giống chó khác: sau v1.

## 9. Tin nhắn thành email thật (MFe2–MFe3) ✅

- Misu gửi tin trong game → `POST /api/message` (Vercel Function, file `api/message.js`) → Resend → email về hộp thư của bạn.
- Email gồm: tin của Misu, sticker gửi kèm, tiền xin thêm, câu Chằm Chằm trả lời trong game, Misu đang ra sao (Level, ví, năng lượng, số sticker), Chằm Chằm trong game đang làm gì, nhật ký hôm nay (5 dòng mới nhất), giờ gửi theo giờ Việt Nam.
- Biến môi trường trên Vercel (Production): `RESEND_API_KEY`, `MESSAGE_TO`. **Dùng email của bạn**, không dùng email của Misu, kẻo lộ quà.
- Gửi từ chế độ `?dev` thì tiêu đề email có "🧪 [Test]".
- Chỉ nhận yêu cầu từ trang misuxinhdep.vercel.app (kiểm tra Origin), tin tối đa 500 ký tự, chữ trong tin được escape trước khi đưa vào email.
- Chạy `npm run dev` / `npm run preview` trên Mac thì `/api/message` là bản giả: in tin ra Terminal, không gửi email.
- Resend gói Free: 3.000 email/tháng, tối đa 100/ngày. Gửi từ `onboarding@resend.dev` thì chỉ tới được email chủ tài khoản Resend, mà người nhận chính là bạn nên không cần mua domain.
- API key đặt trong Environment Variables của Vercel, không để trong code. Giới hạn số tin mỗi ngày. Lần đầu nhớ đánh dấu "Not spam".

## 10. MFe4: Love Coupons ✅

**Là gì:** "phiếu quà" trong game, đổi được thành một việc thật ngoài đời do bạn làm.

**Cách chơi:**
- Mỗi lần lên level, game tặng ngẫu nhiên 1 phiếu Misu chưa có (hết phiếu thì thôi). Popup "Level up!" hiện "New Love Coupon", nhật ký ghi lại.
- Phiếu nằm ở đầu tab Collection, mục **Love Coupons 🎟️**, đi qua 3 bước:
  1. **Ready** (nền vàng): bấm **Use this coupon** → hỏi lại "Use this coupon?" → **Use it 💗**.
  2. **Waiting**: bạn nhận email "🎟️ Misu used a Love Coupon: …". Dưới phiếu hiện "Chằm Chằm got the message 💌" (lỗi thì "Tap to retry", mở app lại cũng tự gửi lại).
  3. **Done** (nền mint, dấu DONE): Misu bấm **It happened 💗** sau khi bạn làm thật.
- Mỗi phiếu dùng 1 lần.

**Danh sách (sửa/thêm trong `src/data/coupons.ts`, không đổi `id` phiếu cũ):**
1. 🧋 A GMI mint milk tea, delivered by Chằm Chằm
2. 🍦 A Dairy Queen run, any time
3. 🍣 Sushi date — Chằm Chằm's treat
4. 🎬 Movie night — you pick, no complaints
5. 💐 A bouquet of your favorite flowers
6. 💆 A 20-minute shoulder massage
7. 🛍️ Shopping buddy — Chằm Chằm carries every bag
8. 🍽️ Chằm Chằm does the dishes for a week
9. 🏋️ Gym date together

## 11. Lưu dữ liệu ✅

- Toàn bộ dữ liệu nằm trong localStorage của app trên iPhone (key `misu-day:save`), tự lưu sau mỗi thay đổi. Tắt app hay tải lại vẫn còn.
- Gắn với địa chỉ **misuxinhdep.vercel.app**, không đổi địa chỉ sau 9/10.
- App trên màn hình chính và tab Safari có dữ liệu tách riêng, nên game chặn chơi trong tab Safari.
- WebKit miễn quy tắc tự xóa dữ liệu sau 7 ngày cho app trên màn hình chính. Game cũng xin trình duyệt giữ dữ liệu lâu dài.
- Xóa icon khỏi màn hình chính là mất dữ liệu.
- Save có số phiên bản (`SAVE_VERSION`) và hàm `migrateSave()` trong `src/game/store.ts`. Bản sau thêm trường mới thì save cũ tự lấy giá trị mặc định.

## 12. Nội dung sinh nhật

Lần mở đầu tiên: thư chúc mừng (bạn tự viết, bằng tiếng Anh), quà mở đầu 9,100,000₫ (9/10), một sticker đặc biệt.

## 13. Kỹ thuật

- Vite 8 + React 19 + TypeScript + Tailwind CSS 4 + vite-plugin-pwa + Zustand.
- Vercel (gói Hobby, miễn phí) để host, Vercel Functions (`/api`) và Resend để gửi email.

```
api/message.js     Vercel Function: tin nhắn → email (Resend)
src/
├─ config.ts       tên game, Misu, Chằm Chằm, bè chẽ
├─ data/           NỘI DUNG: quận, địa điểm + hoạt động, đồ sưu tầm, World, lời nhắn, các con số
├─ game/           LUẬT CHƠI: đồng hồ, năng lượng, level, kiểm tra hoạt động, lưu dữ liệu
├─ components/     nút, sheet, hộp thoại, sticker, thanh tab
├─ overlays/       hộp tiền buổi sáng, popup kết quả, công cụ dev
├─ lib/            nhận biết iPhone, gọi /api, đo bàn phím
└─ screens/        Home, Map (+ map/), Messages, Collection
```

**Chế độ thử:** mở `https://misuxinhdep.vercel.app/?preview&dev` trong tab Safari. Dữ liệu ở đó tách riêng với app đã cài. Nút 🛠 Dev (góc phải trên) cho phép tua giờ (+1 hour, Next morning), thêm tiền, thêm XP, hồi năng lượng, reset game. Tin nhắn gửi ở chế độ này vẫn thành email thật, có chữ [Test].

## 14. Lộ trình

| Ngày | Module | Trạng thái |
|---|---|---|
| T5 1/10 | Chốt scope · **M1** khung app + PWA | ✅ (deploy 3/10) |
| T6 2/10 | **M2** game state + lưu · **M3** đồng hồ thế giới | ✅ 3/10 |
| T7 3/10 | **M4** bản đồ (quận, địa điểm, World) · **M5** hoạt động, kinh tế, nhật ký, Collection | ✅ 3/10 |
| CN 4/10 | (lỡ, dồn sang T2) | |
| T2 5/10 | **M8** trạng thái Chằm Chằm · **M6** thưởng level + mở khóa | ✅ 5/10 |
| T2 5/10 | **M9** tin nhắn → email | ✅ 5/10 |
| T3 6/10 | Nhận nuôi Golden · Hình, giao diện, hiệu ứng · **M7** sự kiện ngẫu nhiên (nếu kịp) | |
| T4 7/10 | **M10** Love Coupons | ✅ 7/10 |
| T4 7/10 | Nội dung thật, cân giá, nội dung sinh nhật | |
| T5 8/10 | Test trên iPhone thật, sửa lỗi, **khóa code tối nay** | |
| T6 9/10 | 🎂 Trao quà | |

Nếu trễ, cắt theo thứ tự M10 → M7 → hiệu ứng. Không dời ngày khóa code.

## 15. Out-scope (làm sau v1.0)

1. Các map World (Đà Lạt, Seoul, Tokyo, Paris, London, Milan, New York)
2. Trang trí nhà kiểu Talking Tom (đặt đồ decor đã mua vào nhà)
3. Thay đồ cho avatar (đồ đã mua mặc lên người)
4. Con cái
5. Thêm thú cưng: mèo, các giống chó khác
6. Chế độ 28 triệu/tuần
7. Bạn trả lời từ ngoài đời, tin hiện trong game
8. Thông báo đẩy buổi sáng
9. Sao lưu cloud, chơi trên nhiều máy
10. Mini-game đố vui về phim và TV show
11. Nhạc nền
12. Bản đồ GPS thật

## 16. Đang chờ bạn

- [ ] MFe4 Love Coupons: có làm không, và sửa danh sách phiếu
- [ ] Viết thêm lời nhắn buổi sáng (`src/data/morningNotes.ts`)
- [ ] Giá thật cho từng món (`src/data/places.ts`), trước ngày 7/10
- [ ] Hình: chibi Misu, chibi Chằm Chằm (Golden để sau), trước ngày 6/10
- [ ] Thư sinh nhật (bạn tự viết)
- [ ] Tên game hiển thị (tạm "Misu's Day"; đổi tên không ảnh hưởng địa chỉ web)
