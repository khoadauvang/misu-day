# Misu's Day — Spec v1.0

*Chốt 01/10/2026 · "Misu's Day" là tên tạm, đổi được · Cập nhật file này mỗi khi có quyết định mới.*

## 0. Tóm tắt

Game PWA trên iPhone mô phỏng cuộc sống thường ngày của Misu ở Sài Gòn. Mỗi sáng **Hubby** (chồng NPC) chuyển 4 triệu kèm một lời nhắn. Misu chọn đi đâu, làm gì, sưu tầm đồ, lên level để mở khóa nơi mới và các chuyến du lịch. Quà sinh nhật 09/10/2026.

## 1. Nguyên tắc (không đổi)

1. **100% tiếng Anh** trong game: giao diện, nội dung, tin nhắn.
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
| petal | `#FFE4EC` | mảng nền phụ, tab đang chọn |
| peony | `#F4A6BD` | màu chính: nút, thanh tiến trình |
| plum | `#5A3A4A` | chữ (thay cho màu đen) |
| hydrangea | `#B4C6F2` | năng lượng |
| lavender | `#D6C4F2` | XP |
| butter | `#FFE7A6` | tiền |
| peach | `#FFD9C9` | màu phụ để phân biệt các quận |

- **Font:** Baloo 2 cho tiêu đề và con số, Nunito cho chữ thường. Cả hai có dấu tiếng Việt cho tên riêng như "Bánh Tráng Trộn A Lâm".
- **Hình:** dùng emoji iOS dạng sticker. Chỉ cần vẽ riêng: chibi Misu, chibi Hubby, chó Golden. Bản đồ Sài Gòn vẽ bằng SVG trong code.

## 3. Màn hình và cách chơi

Thanh tab nổi ở đáy: **Home · Map · Messages · Collection**.

### Home
- Lời chào theo giờ + ngày; chibi Misu; Level + thanh XP; ví tiền 💰; năng lượng ⚡.
- Thẻ trạng thái Hubby theo giờ thật (mục 7).
- Lời nhắn buổi sáng của Hubby, kèm khoản 4 triệu.
- Nhật ký hôm nay (Today's diary).
- Thú cưng, khi đã nhận nuôi.
- Hoạt động ở nhà, miễn phí: xem series, xem rom-com, đọc sách đã mua, tập ở nhà, chợp mắt.

### Map: luồng tương tác

```
Map picker (Saigon ▾)
 ├─ Saigon (mở) → bản đồ 6 quận → chạm quận → sheet danh sách POI
 │                                    → chạm POI → sheet hoạt động
 │                                        → "Do it" → popup kết quả
 │                                           (+ sự kiện ngẫu nhiên, diary, sticker)
 └─ World: Vietnam · Asia · Europe · Americas (khóa)
        → chạm → yêu cầu (Level + vé máy bay) + "This trip opens in a future update"
```

- POI bị khóa hiện ổ khóa + "Lv X".
- Mỗi hoạt động ghi rõ giá ₫, năng lượng ⚡, XP ✨, có thể kèm item.
- Một số nơi có giờ mở cửa: bar 17:00–02:00, concert tối thứ Sáu và thứ Bảy. Ngoài giờ hiện "Opens at 5 PM".

### Messages
- Chat kiểu iMessage với Hubby.
- Tin nhanh: "I miss you 🥺", "I'm hungry 🍜", "Can I have a little extra? 💸" (1 lần/ngày), "Come home early tonight 🏠", "Look what I bought 🛍️". Misu cũng tự gõ được.
- Hubby trả lời ngay bằng câu viết sẵn, tùy trạng thái (đang họp, đang lái xe, ở nhà…).
- Mỗi tin Misu gửi đi thành một email thật về hộp thư của bạn (mục 9).

### Collection
- Lưới sticker những thứ đã mua hoặc nhận, chia nhóm: Bags · Shoes · Beauty · Jewelry & watches · Tech · Plushies · Flowers · Books · Home decor · Souvenirs.
- Love Coupons cũng nằm ở đây, nếu chốt làm MFe4.

## 4. Bản đồ Sài Gòn: quy luật chia quận

Mỗi quận một chủ đề, dựa theo tính chất quận ngoài đời nhưng không bắt buộc đúng 100%. Sở thích nào của Misu cũng có chỗ.

| Quận | Chủ đề | POI (Level mở khóa, đề xuất) |
|---|---|---|
| D1 · Downtown | 👜 Luxury & fashion | Sneaker & Lifestyle Store: Onitsuka Tiger Mexico 66, Birkenstock, sneakers trắng/hồng (Lv1) · Beauty Counter: makeup (Lv1) · Tech Store: Apple, Sony (Lv3) · Luxury Boulevard: Chanel, Gucci (Lv5) · Watch & Jewelry House: Rolex, vòng cổ, vòng tay, nhẫn kim cương (Lv7) |
| D3 · Old Quarter | ☕ Cafés, books & beauty | Garden Café: view đẹp (Lv1) · Bookstore (Lv1) · Beauty Salon: nail, cắt/nhuộm tóc, gội đầu dưỡng sinh (Lv1) · Flower Market: lavender, cẩm tú cầu, hồng, tulip, baby's breath, mẫu đơn (Lv1) · ⭐ GMI Tea: trà sữa bạc hà (Lv1) · ⭐ Bánh Tráng Trộn A Lâm (Lv1) · Spa & Massage (Lv2) · City Library & History Museum (Lv4) |
| D7 · Phú Mỹ Hưng | 🍣 Japan & Korea town | Japanese Corner: sushi, sashimi, cơm lươn, soba lạnh (Lv1) · Korea Town: gà rán Hàn, mì lạnh, mì tương đen lạnh (Lv1) · Dairy Queen (Lv1) · RMIT Campus: học, tự học, làm nhóm; miễn phí, +XP (Lv1, optional) |
| D5 · Chinatown | 🥟 Chinese food | Dim Sum House (Lv1) · Hot Pot (Lv3) · Roast Duck & Noodles (Lv4) |
| D2 · Thảo Điền | 🍸 Expat chill | Fitness Club: gym (Lv1) · Riverside Bar: cocktail, wine, view hoàng hôn, 17:00–02:00 (Lv3) · Home Decor Studio: modern giản dị, pastel (Lv4) · Pet Shop: Golden Retriever (Lv5) |
| D9 · Grand Park | 🎤 Entertainment | Cute Shop: gấu bông, Fuggler, Miniso, Moji, Muji (Lv1) · Cinema: phim mới, rom-com night (Lv2) · Concert Park: tối thứ Sáu và thứ Bảy (Lv5) |

Tổng cộng 27 POI. Nếu trễ lịch, v1.0 có thể ra với khoảng 18 POI, phần còn lại thêm qua bản cập nhật.

## 5. World: các map khác

| Vùng | Điểm đến | Mở khóa (đề xuất) | Vé máy bay |
|---|---|---|---|
| Vietnam | Đà Lạt 🌸 (đồi cẩm tú cầu, vườn lavender). *Đề xuất thêm.* | Lv 7 | 3,000,000₫ |
| Asia | Seoul 🇰🇷 | Lv 8 | 12,000,000₫ |
| Asia | Tokyo 🇯🇵 | Lv 10 | 15,000,000₫ |
| Europe | Paris 🇫🇷 | Lv 14 | 35,000,000₫ |
| Europe | London 🇬🇧 | Lv 14 | 35,000,000₫ |
| Europe | Milan 🇮🇹 | Lv 16 | 38,000,000₫ |
| Americas | New York 🇺🇸 | Lv 20 | 45,000,000₫ |

Ở v1.0, tất cả điểm đến đều hiện trong World. Chạm vào sẽ thấy yêu cầu + "This trip opens in a future update". Từng map mở dần qua các bản cập nhật sau sinh nhật.

## 6. Kinh tế và tiến trình (số liệu chốt lại ngày 7/10)

- **Allowance:** 4,000,000₫ lúc 6:00 sáng mỗi ngày, kèm lời nhắn của Hubby. Vắng N ngày thì khi quay lại nhận đủ N lần ("While you were away…").
- **Energy:** tối đa 100, hồi +10 mỗi giờ, kể cả khi tắt app. Mỗi hoạt động tốn 10–40.
- **XP / Level:** từ level n lên n+1 cần 100 × n XP. Chơi đều thì khoảng 1 tuần tới Lv5, 3–4 tuần tới Lv10.
- **Lên level:** Hubby thưởng Level × 500,000₫, gửi tin chúc mừng, kèm danh sách thứ vừa mở khóa.
- **"Can I have a little extra? 💸":** 1 lần/ngày, Hubby gửi một khoản ngẫu nhiên.
- **Hoạt động miễn phí** (ở nhà, gym, RMIT, thư viện) để Misu vẫn lên level khi để dành tiền.
- **Mục tiêu để dành:** đồ hiệu (Chanel, Rolex, kim cương), MacBook, chó Golden, vé máy bay.
- Chế độ 28 triệu/tuần để sau.

## 7. Hubby (chồng NPC)

| Thời gian | Trạng thái |
|---|---|
| T2–T6, 6:00–8:30 | Getting ready for work ☕ |
| T2–T6, 8:30–9:00 | Driving to the office 🚗 |
| T2–T6, 9:00–17:00 | At the office 💼 (xoay vòng: board meeting, closing a big deal…; 12:00–13:00 lunch break 🍱) |
| T2–T6, 17:00–17:45 | Driving home 🚗 |
| Mỗi ngày, 17:45–23:00 | Home with you 🏠 |
| Mỗi ngày, 23:00–6:00 | Sleeping 😴 |
| T7–CN | Weekend with you 💗 |
| Cách 1 tuần, T7 hoặc CN (ngẫu nhiên nhưng cố định trong tuần đó), 14:00–18:00 | At band practice 🥁 |

- **Lời nhắn buổi sáng:** khoảng 30 câu tiếng Anh, không lặp trong 1 tháng. Mình soạn nháp, bạn sửa lại theo giọng của bạn.
- **Tên trong game:** mặc định "Hubby", đổi ở `src/config.ts`.
- **Con cái:** chưa có trong v1.

## 8. Thú cưng

- Pet Shop (D2, Lv5): nhận nuôi Golden Retriever, một mục tiêu lớn (khoảng 15,000,000₫).
- Nhận nuôi xong, Misu đặt tên, chó hiện ở Home. Mỗi ngày có "Walk the dog" (miễn phí, +XP); Pet Spa thì tốn tiền.
- Mèo và các giống chó khác: sau v1.

## 9. Tin nhắn thành email thật (MFe2–MFe3)

- Misu gửi tin trong game → `POST /api/message` (Vercel Function) → Resend → email về hộp thư của bạn. Email kèm snapshot: Level, ví tiền, đang ở đâu, vừa làm gì.
- Resend gói Free: 3.000 email/tháng, tối đa 100/ngày. Gửi từ `onboarding@resend.dev` thì chỉ tới được email chủ tài khoản Resend. Người nhận chính là bạn nên không cần mua domain.
- API key đặt trong Environment Variables của Vercel, không để trong code.
- Giới hạn số tin mỗi ngày. Email từ địa chỉ mặc định dễ vào spam, nên lần đầu nhớ đánh dấu "Not spam".

## 10. MFe4: Love Coupons (chờ bạn chốt)

**Là gì:** "phiếu quà" trong game, đổi được thành một việc thật ngoài đời do bạn làm.

**Ví dụ:** Misu lên Level 3 thì mở khóa phiếu "🍣 Sushi date — Hubby's treat". Cô ấy bấm **Use**, bạn nhận email "Misu used: Sushi date", rồi bạn dẫn cô ấy đi ăn thật.

**Mốc mở phiếu:** lên level, chơi 7 ngày liên tiếp, lần đầu làm một việc nào đó…

**Danh sách gợi ý (theo sở thích của Misu):**
1. 🧋 A GMI mint milk tea, delivered by Hubby
2. 🍦 A Dairy Queen run, any time
3. 🍣 Sushi date — Hubby's treat
4. 🎬 Movie night — you pick, no complaints
5. 💐 A bouquet of your favorite flowers
6. 💆 A 20-minute shoulder massage
7. 🛍️ Shopping buddy — Hubby carries every bag
8. 🍽️ Hubby does the dishes for a week
9. 🏋️ Gym date together
10. ☕ Breakfast in bed

**Bạn cần trả lời:** có làm không, và gạch hoặc sửa danh sách, chỉ giữ những việc bạn chắc chắn làm được.

## 11. Lưu dữ liệu (cách game "tự lưu")

- Trên iPhone, trình duyệt cho mỗi trang web một "hộp lưu trữ" riêng (localStorage). Mỗi lần Misu làm gì, game ghi toàn bộ trạng thái (tiền, level, đồ, nhật ký…) vào hộp đó. Mở lại thì game đọc ra và chơi tiếp. Không cần server, không cần tài khoản.
- Hộp này gắn với **địa chỉ web**. Phải chốt tên miền Vercel trước 9/10 và không đổi sau đó.
- App trên màn hình chính và tab Safari có **dữ liệu tách riêng**. Vì vậy game chặn chơi trong tab Safari và hiện hướng dẫn "Add to Home Screen".
- WebKit miễn quy tắc tự xóa dữ liệu sau 7 ngày cho app đã thêm vào màn hình chính.
- Xóa icon khỏi màn hình chính là mất dữ liệu.
- Save có số phiên bản (`version`) và hàm `migrate()`, để bản cập nhật sau vẫn đọc được save cũ.
- Sau v1: sao lưu lên cloud.

## 12. Nội dung sinh nhật

Lần mở đầu tiên: thư chúc mừng (bạn tự viết, bằng tiếng Anh), quà mở đầu 9,100,000₫ (9/10), một sticker đặc biệt.

## 13. Kỹ thuật

- Vite 8 + React 19 + TypeScript + Tailwind CSS 4 + vite-plugin-pwa + Zustand.
- Vercel (gói Hobby, miễn phí) để host, Vercel Functions (`/api`) và Resend để gửi email.

```ts
type DistrictId = 'd1' | 'd2' | 'd3' | 'd5' | 'd7' | 'd9'

type Activity = {
  id: string; name: string; emoji: string
  cost: number; energy: number; xp: number
  item?: string                 // id sticker thêm vào Collection
  unlockLevel?: number
  openHours?: [number, number]  // ví dụ [17, 2] cho bar
  days?: number[]               // 0 = CN … 6 = T7
  diary: string[]               // câu nhật ký, chọn ngẫu nhiên
}

type Place = {
  id: string; name: string; emoji: string; district: DistrictId
  tagline: string; unlockLevel: number; special?: boolean
  activities: Activity[]
}

type Destination = {
  id: string; name: string; region: 'vietnam' | 'asia' | 'europe' | 'americas'
  flag: string; unlockLevel: number; flightCost: number; open: boolean
}

type GameState = {
  version: number
  money: number; energy: number; xp: number   // level tính từ xp
  lastSeenAt: string; lastAllowanceDate: string
  diary: DiaryEntry[]; inbox: Message[]; collection: Record<string, number>
  pet?: { kind: 'golden'; name: string }
  coupons: string[]
}
```

## 14. Lộ trình

| Ngày | Module | Xong khi |
|---|---|---|
| T5 1/10 | Chốt scope · **M1** khung app + PWA | Link Vercel cài được lên iPhone, mở toàn màn hình |
| T6 2/10 | **M2** game state + lưu · **M3** đồng hồ thế giới | Tắt app mở lại vẫn còn dữ liệu; qua 6:00 nhận 4 triệu; energy hồi |
| T7 3/10 | **M4** bản đồ (quận, POI, World) · **M5** hoạt động, kinh tế, diary, Collection | Chơi được trọn một vòng |
| CN 4/10 | **M6** level + mở khóa · **M7** sự kiện · **M8** Hubby | Có lên level, có sự kiện, Hubby đổi trạng thái theo giờ |
| T2 5/10 | **M9** tin nhắn → email · **M10** Love Coupons (nếu chốt) · nhận nuôi Golden | Gửi tin trong game → email về bạn |
| T3 6/10 | Hình, giao diện, hiệu ứng | Nhìn ra "game" |
| T4 7/10 | Nội dung thật, cân giá, nội dung sinh nhật | Đủ nội dung cho 1–2 tuần đầu |
| T5 8/10 | Test trên iPhone thật, sửa lỗi, **khóa code tối nay** | Bản chốt |
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
- [ ] Tên game + tên project Vercel (cũng là địa chỉ web; chốt trước 9/10)
- [ ] GMI Tea và A Lâm ngoài đời ở quận nào, để đặt đúng chỗ (mặc định D3)
- [ ] Misu gọi bạn là gì (mặc định "Hubby")
- [ ] Hình: chibi Misu, chibi Hubby (Golden để sau)
- [ ] Thư sinh nhật (bạn tự viết)
