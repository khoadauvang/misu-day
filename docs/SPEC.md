# Misu's Day — Spec v1.6

*Cập nhật 09/10/2026 · "Misu's Day" là tên tạm, đổi được · Cập nhật file này mỗi khi có quyết định mới.*

- **Link game:** https://misuxinhdep.vercel.app (đã chốt, không đổi sau 9/10)
- **Code:** GitHub `khoadauvang/misu-day`, nhánh `main` → Vercel tự deploy

## 0. Tóm tắt

Game PWA trên iPhone mô phỏng cuộc sống thường ngày của Misu ở Sài Gòn. Mỗi sáng **Chằm Chằm** (chồng NPC) chuyển 4 triệu kèm một lời nhắn. Misu chọn đi đâu, làm gì, sưu tầm đồ, lên level để mở khóa nơi mới và các chuyến du lịch. Quà sinh nhật 09/10/2026.

## 1. Nguyên tắc (không đổi)

1. **100% tiếng Anh** trong game: giao diện, nội dung, tin nhắn. Tên riêng tiếng Việt giữ nguyên (Chằm Chằm, bè chẽ, Phú Nhuận, Bánh Tráng Trộn A Lâm). Ngoại lệ duy nhất: **thư sinh nhật** giữ nguyên lời bạn viết (mục 12).
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

- **Font:** Baloo 2 cho tiêu đề và con số, Nunito cho chữ thường, Mali (chữ viết tay, `font-hand`) cho thư sinh nhật. Cả ba có dấu tiếng Việt.
- **Hình:** emoji iOS dạng sticker, cộng thêm hình riêng:
  - Chibi Misu, chibi Chằm Chằm ✅ (ảnh của bạn, đã tách nền + viền trắng kiểu sticker): `public/chibi/` (`misu.webp`, `husband.webp` toàn thân; `*-head.webp` phần đầu cho avatar tròn). Đường dẫn khai báo ở `src/data/art.ts`. Muốn đổi hình: chép file mới đè lên, giữ tên.
  - Cún Golden ✅ vẽ bằng SVG trong code, có 5 nét mặt (`src/components/GoldenPup.tsx`). Nếu sau này có hình Golden cùng phong cách chibi thì thay được.
  - Bánh kem nến "19" (`src/components/BirthdayCake.tsx`), bản đồ Sài Gòn: SVG trong code.

## 3. Màn hình và cách chơi

Thanh tab nổi ở đáy: **Home · Map · Messages · Collection**.

### Mỗi sáng
- 6:00 sáng là ngày mới. Lần mở app đầu tiên trong ngày hiện hộp **Today's allowance**: lời nhắn của Chằm Chằm + 4,000,000₫, Misu bấm **Collect** để nhận.
- Vắng nhiều ngày: hộp **While you were away** cộng dồn tiền các buổi sáng đã lỡ.

### Home ✅
- Lời chào theo giờ + ngày; chibi Misu (chạm vào thì nhún nhảy); Level + thanh XP; ví tiền 💰; năng lượng ⚡ (kèm "Full in 2h 30m").
- Lời nhắn hôm nay của Chằm Chằm, dạng tờ giấy dán băng keo.
- **At home:** hoạt động miễn phí ở nhà — ô **Movie night 🍿** (xem phim, series; mục 8b), tập ở nhà, đọc sách (cần mua sách trước), chợp mắt (1 lần/ngày, hồi 30 năng lượng).
- **Today's diary:** nhật ký trong ngày, mới nhất ở trên.
- Thẻ trạng thái của Chằm Chằm theo giờ (M8 ✅): avatar chibi + emoji trạng thái, đang làm gì + "until 5:45 PM"; nền mint khi đang ở bên Misu.
- Dưới thanh XP: "🔓 New places at Level X" (level kế tiếp có mở khóa).
- Góc phải trên: 2 nút tròn 🎵 nhạc nền và 🔔 tiếng hiệu ứng, chạm để bật/tắt (mục 8c).
- Thẻ cún Golden ✅ (mục 8): chưa đủ Lv5 thì hiện mờ "Someone fluffy is waiting"; đủ level thì "A puppy is waiting for you" + nút sang Pet Shop; nhận nuôi rồi thì hiện thẻ chăm cún.

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
- Chat kiểu iMessage với Chằm Chằm (M9), đầu trang là avatar chibi của anh. Lần đầu hiện lời chào "Hi bè chẽ 💗 Text me anytime…".
- Tin nhanh (hàng chip trên ô nhập): "I miss you 🥺", "I'm hungry 🍜", "Can I have a little extra? 💸", "Come home early tonight 🏠", "Look what I bought 🛍️". Misu cũng tự gõ được (tối đa 500 ký tự).
- "Look what I bought" tự gửi kèm sticker món đồ mua gần nhất.
- "Can I have a little extra?" 1 lần/ngày: Chằm Chằm gửi thêm 1,000,000₫ (`EXTRA_MONEY`), hiện thẻ "+1,000,000₫ added to your wallet" và ghi nhật ký. Dùng rồi thì chip đổi thành "Extra again tomorrow 💸".
- Chằm Chằm "đang gõ…" (3 chấm) rồi trả lời bằng câu viết sẵn, tùy loại tin và việc anh đang làm (sáng sớm, ở công ty, ăn trưa, lái xe, ở nhà/cuối tuần, tập band, ngủ). Câu trả lời sửa trong `src/data/messages.ts`.
- Dưới tin của Misu: "Sending…" → "Delivered" khi email đã đi; lỗi thì "Not delivered · Tap to retry". Mở app lại hoặc có mạng lại thì tự gửi lại các tin chưa tới (trong 3 ngày).
- Tối đa 30 tin/ngày (`DAILY_MESSAGE_LIMIT`), quá thì hiện "That's a lot of love for one day 💌 More tomorrow!".
- Mỗi tin Misu gửi đi thành một email thật về hộp thư của bạn (mục 9).

### Collection ✅
- Đầu trang: thẻ **Your birthday letter 💌** để đọc lại thư sinh nhật (hiện sau khi đã mở thư lần đầu).
- Love Coupons 🎟️ (mục 10).
- Sổ sticker theo nhóm: Bags · Shoes · Beauty · Jewelry & watches · Tech · Plushies · Flowers · Books · Home decor · Souvenirs.
- Món đã có hiện màu (mua lại thì ×2, ×3…), món chưa có là ô trống viền đứt. Hiện tại có 34 món (thêm sticker đặc biệt "19th birthday cake" 🎂).

## 4. Bản đồ Sài Gòn: quy luật chia quận

Mỗi quận một chủ đề, dựa theo tính chất quận ngoài đời nhưng không bắt buộc đúng 100%.

| Quận | Chủ đề | Địa điểm (Level mở khóa) |
|---|---|---|
| D1 | 👜 Luxury & fashion | Sneaker & Lifestyle Store (1) · Beauty Counter (1) · Tech Store (3) · Luxury Boulevard (5) · Watch & Jewelry House (7) |
| D3 | ☕ Cafés, books & beauty | Garden Café (1) · Bookstore (1) · Beauty Salon: nail, nhuộm tóc, gội đầu dưỡng sinh (1) · Flower Market (1) · Spa & Massage (2) · City Library & History Museum (4) |
| Phú Nhuận | 🧋 Street snacks | ⭐ GMI Tea: trà sữa bạc hà (1) · ⭐ Bánh Tráng Trộn A Lâm (1) |
| D7 | 🍣 Japan & Korea town | Japanese Corner (1) · Korea Town (1) · Dairy Queen (1) · RMIT Campus: miễn phí, +XP (1) |
| D5 | 🥟 Chinatown eats | Dim Sum House (1) · Hot Pot (3) · Roast Duck & Noodles (4) |
| D2 | 🍸 Thảo Điền chill | Fitness Club (1) · Riverside Bar (3) · Home Decor Studio (4) · Pet Shop: nhận nuôi Golden, đồ ăn cho cún, spa cho cún (5) |
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

- **Giá (chốt 08/10 theo bảng giá của bạn):** 69 hoạt động tốn tiền, sửa ở `cost` trong `src/data/places.ts`. Giá gần giá thật ở Sài Gòn (tham khảo Onitsuka Tiger, Chanel, Apple, Sony, Rolex, PNJ, Highlands…); hàng xa xỉ giảm nhẹ để cân bằng: Chanel Classic Mini 163,8 triệu → 150 triệu, Rolex Oyster Perpetual 36 191,5 triệu → 175 triệu.

  | Nhóm | Giá |
  |---|---|
  | Ăn vặt, đồ uống: GMI Tea, Bánh Tráng Trộn A Lâm, Dairy Queen, Garden Café | 30,000–145,000₫ |
  | Bữa ăn: Japanese Corner, Korea Town, Dim Sum, Hot Pot, Roast Duck | 120,000–750,000₫ |
  | Làm đẹp, spa, gym, bar, rạp phim, bảo tàng | 70,000–850,000₫ |
  | Sách, hoa, gấu bông, Miniso/Muji, đồ trang trí, son, ốp iPhone | 90,000–1,100,000₫ |
  | Giày, nước hoa, AirPods, tai nghe Sony, concert | 2,500,000–7,400,000₫ |
  | Trang sức, túi hiệu, đồng hồ | Necklace 12tr · Gucci 45tr · Diamond ring 47tr · Chanel 150tr · Rolex 175tr |
  | Pet Shop (mục 8), vé máy bay (mục 5) | giữ nguyên |

  Năng lượng chỉ đủ khoảng 8–10 hoạt động mỗi ngày nên ngày nào cũng dư tiền; tiền dư để dành cho đồ hiệu, trang sức, công nghệ và vé máy bay. Để dành hết 5 triệu mỗi ngày (4tr + 1tr xin thêm, chưa tính thưởng level) thì Chanel mất khoảng 30 ngày, Rolex khoảng 35 ngày. Nơi mở ở level cao thường đắt hơn. Hoạt động miễn phí giữ 0₫: học ở RMIT, đọc ở thư viện, đọc sách ở góc nhà sách, ngắm đồ ở Luxury Boulevard, chơi với cún ở Pet Shop, hoạt động ở nhà, chăm cún ở nhà.
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

## 8. Thú cưng: cún Golden Retriever ✅

**Nhận nuôi (Pet Shop, D2, Lv5):** "Adopt a Golden Retriever" 8,000,000₫ · −20⚡ · +50 XP → hộp **Name your puppy**: Misu tự gõ tên (tối đa 14 ký tự) hoặc chọn tên gợi ý (Mochi, Bơ, Latte, Honey, Toffee, Butter) → popup "Welcome home, {tên}!" → nút "Go home with {tên} 🏠" về tab Home. Kèm quà: 5 phần kibble + 1 xương gặm. Mỗi người chỉ nuôi 1 cún (v1).

**Độ no 🍖 và độ vui 💛 (0–100):** giảm theo giờ thật kể cả lúc tắt app (no −4/giờ, vui −3/giờ). Dưới 30 no thì cún đói; từ 90 trở lên thì no, không ăn thêm bữa chính (xương gặm vẫn ăn được). **Không phạt:** cún không bao giờ bỏ đi, đói thì chỉ buồn thiu chờ Misu.

**Tâm trạng (nét mặt + câu trên thẻ):** vui · bình thường · đói (mắt long lanh) · buồn, muốn chơi · ngủ (23:00–6:00, vẫn chăm được).

**Thẻ cún ở Home:** hình cún (đuôi vẫy; chạm vào thì cún "nói" Woof!), tên, "Day N together", 2 thanh no/vui, 3 nút:
- **Feed** → sheet tủ đồ ăn: mỗi món còn bao nhiêu phần, tác dụng, nút Feed. Hết đồ thì có nút "Go to the Pet Shop 🛒" (mở thẳng Pet Shop trên Map).
- **Go for a walk** (1 lần/ngày): −15⚡ · +20 XP · +40 vui.
- **Play & cuddle**: −5⚡ · +5 XP · +15 vui.
- Chăm xong cún nhảy lên + bong bóng "+5 XP". Lên level thì hiện popup đầy đủ như hoạt động khác.

**Pet Shop** (giá ước theo thị trường Sài Gòn, sửa trong `src/data/places.ts`):

| Món | Giá | Vào tủ | Mỗi phần cho ăn |
|---|---|---|---|
| Buy puppy kibble | 450,000₫ | 10 phần 🥣 | +40 no · +5 vui · +5 XP |
| Buy chicken & pumpkin bowls | 150,000₫ | 3 phần 🍗 | +55 no · +15 vui · +8 XP |
| Buy chew bones | 90,000₫ | 5 phần 🦴 | +20 vui · +5 XP |
| Buy a pupcake | 120,000₫ | 1 phần 🧁 | +20 no · +40 vui · +10 XP |
| Puppy spa & grooming (1 lần/ngày) | 400,000₫ | | +35 vui · +20 XP |

- Mua đồ ăn cần có cún trước ("Adopt a puppy first").
- Nội dung (tên gợi ý, đồ ăn, độ no/vui, câu nhật ký, câu tâm trạng): `src/data/pet.ts`. Luật (giảm theo giờ, tâm trạng, tủ đồ ăn): `src/game/pet.ts` + `checkPet` trong `src/game/rules.ts`.
- Email Misu gửi có thêm dòng "🐶 Mochi · 84% full · 92% happy".
- Mèo, các giống chó khác, cún lớn lên, dắt cún đi chơi ở các quận: sau v1.

## 8b. Movie night: xem phim ở nhà ✅

**Cách chơi:**
- Home → At home → ô **Movie night 🍿** ("12/80 watched") → sheet danh sách **80 phim và series Mỹ/Anh**: 46 rom-com, 14 phim hài, 20 series.
  - Lọc: All · 💕 Rom-coms · 😂 Comedies · 📺 Series (hàng lọc dính trên đầu khi cuộn).
  - Thứ tự: 4 phim ⭐ Misu thích (Friends, Brooklyn Nine-Nine, Gossip Girl, How to Lose a Guy in 10 Days) → phim chưa xem → phim đã xem (nhãn ✓ ×2) xuống cuối.
  - **🎲 Surprise me:** chọn ngẫu nhiên một phim chưa xem trong nhóm đang lọc.
- Chạm một phim → emoji, năm, 🇺🇸/🇬🇧, loại, một câu giới thiệu + nút **Watch 🎬**.
- Miễn phí · −10⚡ · +15 XP (rom-com, phim hài) hoặc +10 XP (series). Xem phim nào lần đầu thì **+5 XP thưởng** ("✨ First watch bonus").
- Popup: **GIF của phim** trong khung sticker + dòng "Powered by GIPHY", câu giới thiệu, "First watch: +5 bonus XP" hoặc "Watched N times 💗", "N of 80 movies & shows watched", nút **Loved it 🍿**.
- Nhật ký: "Movie night in: Notting Hill (1999). Snacks were involved. 🍿" (series: 📺). Dòng này cũng đi theo email gửi bạn.

**GIF (GIPHY):**
- Gọi API GIPHY thẳng từ iPhone (GIPHY yêu cầu tìm kiếm từ phía người dùng). Key: biến `VITE_GIPHY_KEY` trên Vercel (Production + Preview). Thêm hoặc đổi key thì phải **Redeploy**, vì key được đóng vào bản build.
- Key beta: 100 lần gọi mỗi giờ. Mỗi phim chỉ gọi 1 lần cho tới khi tắt app; lần xem sau chọn GIF khác trong danh sách đã có.
- Tìm "<tên phim> movie" (series: "<tên phim> tv show"), lấy 8 kết quả đầu (rating PG), chọn ngẫu nhiên. Phim nào ra GIF sai: thêm `gif.q` (từ khóa khác) hoặc `gif.ids` (id GIF tự chọn trên giphy.com) trong `src/data/movies.ts`.
- Hiện ảnh động WebP bằng `<img>` (không dùng video: iPhone bật Chế độ nguồn điện thấp sẽ không tự chạy video). Bản gốc nặng quá 2,5 MB thì dùng bản nhỏ.
- GIF được tải trước ngay khi Misu mở giới thiệu phim. Không có key, mất mạng, GIPHY lỗi hoặc chờ quá 7 giây → hiện emoji của phim; popup không bao giờ phải chờ GIF.
- Không tải đoạn phim về rồi tự host (bản quyền của hãng phim).

**Sửa nội dung:** `src/data/movies.ts` (danh sách phim, câu giới thiệu, XP, câu nhật ký; không đổi `id` phim đã có vì số lần xem lưu theo id). Kiểm tra GIF: `?preview&dev` → 🛠 Dev → **Movie night GIFs 🎬** (‹ Prev · Another · Next ›).

**Code:** luật trong `src/game/movies.ts` + `applyMovie` trong `src/game/engine.ts`; gọi GIPHY trong `src/lib/giphy.ts`; khung GIF `src/components/MovieGif.tsx`; giao diện `src/screens/home/MovieNight.tsx`. Save thêm trường `movies` (id phim → số lần đã xem).

## 8c. Âm thanh: nhạc nền + tiếng hiệu ứng ✅

- **Nhạc nền** dễ thương, chill: 16 ô nhịp (~48 giây) lặp liền mạch, giọng Đô trưởng, 80 nhịp/phút. Tiếng hộp nhạc chơi giai điệu, piano điện đệm hợp âm, bass tròn, shaker + trống rất nhẹ. Game tự "chơi" từng nốt bằng code: không dùng file nhạc nên không lo bản quyền, app vẫn nhẹ, chạy được khi mất mạng. Nốt và hợp âm sửa trong `src/data/music.ts` (cách viết: `'A5:1.5 G5:.5'` = tên nốt : số phách).
- **Tiếng hiệu ứng:** mọi nút có tiếng "póc" nhỏ. Trả tiền: "ting-ting" đồng xu · mua đồ có sticker: đồng xu + lấp lánh · hoạt động miễn phí, xem phim: chuông hộp nhạc · lên level, nhận nuôi cún: kèn nhỏ · nhận tiền buổi sáng, Chằm Chằm gửi thêm: ba đồng xu · gửi tin: "blúp" · Chằm Chằm trả lời: "ting-tong" · chạm/chăm cún: đồ chơi "chít" · chạm chibi Misu: lò xo "boing" · mở thư, dùng Love Coupon: lấp lánh · lật trang thư: "sột". Công thức từng tiếng: `src/lib/sfx.ts`.
- **Mở quà sinh nhật:** hộp nhạc chơi Happy Birthday (nhịp 3/4, giai điệu đã hết bản quyền), nhạc nền nhỏ lại trong lúc phát.
- **Bật/tắt:** 2 nút ở đầu tab Home, lưu trong save (`settings`), mặc định bật cả hai.
- **Trên iPhone:** chỉ phát tiếng sau lần chạm đầu tiên (nhạc nhỏ dần lên trong 2,5 giây). Gạt nút im lặng của iPhone là game im. Phát chung được với nhạc của app khác. Thoát ra màn hình chính thì tạm dừng, mở lại phát tiếp.
- Âm lượng: `MUSIC_VOLUME`, `SFX_VOLUME` trong `src/data/music.ts`. Mở game thì nhạc được "thu" sẵn một lần (chia nhỏ từng đoạn để giao diện không bị giật), lúc chơi chỉ phát lại.
- **Code:** bộ tổng hợp âm thanh `src/lib/synth.ts`, tiếng hiệu ứng `src/lib/sfx.ts`, phát + bật/tắt `src/lib/sound.ts`. Nghe thử: `?preview&dev` → 🛠 Dev → **Sounds 🔊** (dòng "Audio: running · music playing" cho biết âm thanh đang chạy).

## 9. Tin nhắn thành email thật (MFe2–MFe3) ✅

- Misu gửi tin trong game → `POST /api/message` (Vercel Function, file `api/message.js`) → Resend → email về hộp thư của bạn.
- Email gồm: tin của Misu, sticker gửi kèm, tiền xin thêm, câu Chằm Chằm trả lời trong game, Misu đang ra sao (Level, ví, năng lượng, số sticker, cún ra sao), Chằm Chằm trong game đang làm gì, nhật ký hôm nay (5 dòng mới nhất), giờ gửi theo giờ Việt Nam.
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
- Save có số phiên bản (`SAVE_VERSION`) và hàm `migrateSave()` trong `src/game/store.ts`. Bản sau thêm trường mới thì save cũ tự lấy giá trị mặc định (ví dụ bản 7/10 thêm `birthdayAt`, `pet`, `pantry`; bản 8/10 thêm `movies`; bản 9/10 thêm `settings` bật/tắt âm thanh).

## 12. Nội dung sinh nhật ✅

**Lần mở game đầu tiên** (save chưa có `birthdayAt`):
1. Game phía sau mờ tối đi. Pháo hoa + pháo giấy bắn lên, bánh kem nến "19" nhảy ra ở góc dưới bên trái, chibi Chằm Chằm trượt vào góc dưới bên phải với bong bóng "Happy 19th, bè chẽ! 🎂".
2. **Bức thư trái tim** đập nhẹ: "A letter for you, bè chẽ 💌 · Tap to open".
3. Chạm → tim nở ra, tờ thư bung ra. Thư gồm 3 tờ giấy màu (hồng · vàng · tím) chia thành 7 trang. Bấm › hoặc vuốt sang trái để lật: trang cũ bay "xoẹt" sang trái, trang sau nhích lên. Bấm ‹ hoặc vuốt sang phải để xem lại. Bánh kem và Chằm Chằm thu nhỏ, ngồi ở 2 góc dưới.
4. Tiêu đề ở trang 1 chia 3 dòng: CHÚC MỪNG SN / VỢ EO THƠM THO / CUTE PHÔ MAI QUE NHÓ. Mỗi dòng không bao giờ tự xuống dòng; cỡ chữ tự co cho vừa bề ngang màn hình.
5. Chữ thư viết tay (Mali) 21px; trang nào dài hoặc máy nhỏ (iPhone SE) thì chữ tự nhỏ dần, tối thiểu 15px.
6. Trang cuối có ký tên "— Chằm Chằm 💗" và nút **Open your gift 🎁** → quà: **+9,100,000₫** ("For your special day, 9/10 💗") + sticker **19th birthday cake** 🎂 vào Collection, nhật ký ghi "Happy 19th birthday!". Bấm **Start my day 💗** → vào game, sau đó mới hiện hộp tiền buổi sáng.
- Quà chỉ nhận một lần. Đọc lại thư: Collection → **Your birthday letter** (không nhận quà lần nữa, có nút × để đóng).
- Sửa chữ, chia trang, số tiền, sticker: `src/data/birthday.ts`. Hiệu ứng: `src/overlays/BirthdayIntro.tsx`.
- **Cách chia trang:** giữ nguyên lời bạn, chỉ cắt ở chỗ ngắt câu tự nhiên; ở chỗ cắt đổi dấu phẩy thành dấu chấm và viết hoa chữ đầu trang sau ("…vk mạnh hơn. / Ck đã tổng hợp…", "…thông minh thì khỏi bàn. / Vừa có tâm…"). Thư tiếng Anh giữ nguyên từng chữ.
- App đã cài trên iPhone của bạn cũng sẽ hiện thư một lần ở lần mở tới (save cũ chưa có `birthdayAt`). Muốn xem lại từ đầu: `?preview&dev` → 🛠 Dev → **Replay birthday 🎂**.

## 13. Kỹ thuật

- Vite 8 + React 19 + TypeScript + Tailwind CSS 4 + vite-plugin-pwa + Zustand.
- Vercel (gói Hobby, miễn phí) để host, Vercel Functions (`/api`) và Resend để gửi email. GIPHY cho GIF phim (mục 8b).

```
api/message.js     Vercel Function: tin nhắn → email (Resend)
src/
├─ config.ts       tên game, Misu, Chằm Chằm, bè chẽ
├─ data/           NỘI DUNG: quận, địa điểm + hoạt động, đồ sưu tầm, World, lời nhắn, các con số,
│                  thư sinh nhật (birthday.ts), cún Golden (pet.ts), phim (movies.ts), nhạc (music.ts), đường dẫn hình chibi (art.ts)
├─ game/           LUẬT CHƠI: đồng hồ, năng lượng, level, kiểm tra hoạt động, cún (pet.ts), phim (movies.ts), lưu dữ liệu
├─ components/     nút, sheet, hộp thoại, sticker, thanh tab, avatar, cún Golden, bánh kem, pháo hoa, khung GIF phim
├─ overlays/       hộp tiền buổi sáng, popup kết quả, thư sinh nhật, đặt tên cún, công cụ dev
├─ lib/            nhận biết iPhone, gọi /api, GIF từ GIPHY, đo bàn phím, âm thanh (synth, sfx, sound)
└─ screens/        Home (+ home/ thẻ cún, Movie night), Map (+ map/), Messages, Collection
public/chibi/      ảnh chibi Misu + Chằm Chằm (toàn thân + đầu)
```

**Chế độ thử:** mở `https://misuxinhdep.vercel.app/?preview&dev` trong tab Safari. Dữ liệu ở đó tách riêng với app đã cài. Nút 🛠 Dev (góc phải trên) cho phép tua giờ (+1 hour, Next morning), thêm tiền, thêm XP, hồi năng lượng, reset game, xem lại màn sinh nhật (Replay birthday 🎂), làm cún đói (Puppy hungry 🥺), bỏ cún để thử nhận nuôi lại (Remove puppy), lướt GIF từng phim (Movie night GIFs 🎬), xóa danh sách phim đã xem (Forget watched movies), nghe thử từng tiếng (Sounds 🔊). Tin nhắn gửi ở chế độ này vẫn thành email thật, có chữ [Test].

## 14. Lộ trình

| Ngày | Module | Trạng thái |
|---|---|---|
| T5 1/10 | Chốt scope · **M1** khung app + PWA | ✅ (deploy 3/10) |
| T6 2/10 | **M2** game state + lưu · **M3** đồng hồ thế giới | ✅ 3/10 |
| T7 3/10 | **M4** bản đồ (quận, địa điểm, World) · **M5** hoạt động, kinh tế, nhật ký, Collection | ✅ 3/10 |
| CN 4/10 | (lỡ, dồn sang T2) | |
| T2 5/10 | **M8** trạng thái Chằm Chằm · **M6** thưởng level + mở khóa | ✅ 5/10 |
| T2 5/10 | **M9** tin nhắn → email | ✅ 5/10 |
| T3 6/10 | Nhận nuôi Golden · Hình chibi, hiệu ứng | ✅ 7/10 |
| T4 7/10 | **M10** Love Coupons | ✅ 7/10 |
| T4 7/10 | Nội dung sinh nhật: thư + pháo hoa + quà | ✅ 7/10 |
| T5 8/10 | **Movie night:** 80 phim/series + GIF (GIPHY) | ✅ 8/10 |
| T5 8/10 | Giá thật từng món/hoạt động (bảng giá của bạn) | ✅ 8/10 |
| T5 8/10 | Lời nhắn buổi sáng · **M7** sự kiện ngẫu nhiên (nếu kịp) | |
| T5 8/10 | Test trên iPhone thật, sửa lỗi, **khóa code tối nay** | |
| T6 9/10 | Nhạc nền + tiếng hiệu ứng | ✅ 9/10 |
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
11. Bản đồ GPS thật
12. Movie night: trailer YouTube chính thức cho phim ⭐, kệ vé xem phim trong Collection, dùng chung danh sách phim cho Cinema (D9)

## 16. Đang chờ bạn

- [x] MFe4 Love Coupons (sửa/thêm phiếu trong `src/data/coupons.ts`)
- [x] Hình chibi Misu + Chằm Chằm
- [x] Thư sinh nhật
- [ ] Tạo key GIPHY (developers.giphy.com → Create an API Key), thêm `VITE_GIPHY_KEY` trên Vercel rồi **Redeploy**; lướt **Movie night GIFs 🎬** trong Dev để sửa GIF sai — 8/10
- [ ] Lời nhắn buổi sáng (`src/data/morningNotes.ts`) — 8/10
- [x] Bảng giá thật cho từng món/hoạt động (đã vào `src/data/places.ts` 8/10)
- [ ] Đọc lại thư trên iPhone thật, sửa chữ nếu muốn (`src/data/birthday.ts`)
- [ ] Tên game hiển thị (tạm "Misu's Day"; đổi tên không ảnh hưởng địa chỉ web)
- [ ] (Tùy chọn) Hình cún Golden cùng phong cách chibi để thay hình SVG
