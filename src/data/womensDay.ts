import type { LetterPage } from '../components/Letter.tsx'

// Quà 20/10 (Ngày Phụ nữ Việt Nam): hiện một lần khi Misu mở game (sau thư sinh nhật nếu chưa đọc).
// Trình tự: game tối đi, hoa rơi → các trang thư (lật "xoẹt") → hộp quà lắc lắc → chạm là nổ ra
// cả bộ sưu tập hoa → hoa vào Collection. Đọc lại thư được từ Collection.
//
// Thư giữ nguyên giọng của bạn (ngoại lệ của luật "100% tiếng Anh", giống thư sinh nhật).

/** Tiêu đề thư: mỗi phần tử là một dòng, cỡ chữ tự co cho vừa màn hình */
export const WOMENS_DAY_TITLE = ['HAPPY', "WOMEN'S DAY", '20 · 10']

export const WOMENS_DAY_PAGES: LetterPage[] = [
  {
    paper: 'petal',
    text: 'Mừng ngày phụ nữ Việt Nam nhóoo vợ iu!!!! Vậy là mình lại đi qua một ngày lễ đặc biệt cùng nhau nữa gùii Yayyyyyyyyyyyyy! Cẻm ưn bè chẽ vì vẫn còn ở đây tiếp tục phát triển và đồng hành cùng chằm, vè bè chẽ lè người phụ nữ đẳng cấp nhất thế gian này, vừa xinh đẹp vừa hài hước vừa giỏi giang cái gì cũng biết cái gì cũng làm ra cơm ra bã hehe, anh iu vợ nhèooo <3333',
    signed: true,
  },
  {
    paper: 'butter',
    text: 'và đây là mụt vài món qè nho nhỏ của chằm chằmmmmm.',
    big: 'BỘ SƯU TẬP BÔNG HOA\nFULL COLLECTIONNNNN',
  },
]

/** Ký tên cuối thư */
export const WOMENS_DAY_SIGNATURE = 'Chằm Chằm'

/** Các loài hoa trong quà (id trong items.ts, chi tiết ở flowers.ts) */
export const WOMENS_DAY_FLOWERS = ['roses', 'tulips', 'peonies', 'hydrangeas', 'lavender', 'babys-breath']

/** Dòng ghi vào nhật ký khi nhận quà */
export const WOMENS_DAY_DIARY = "Happy Vietnamese Women's Day! 💐 A full flower collection from Chằm Chằm."

/** Câu Chằm Chằm nói ở góc màn hình */
export const WOMENS_DAY_BUBBLES = {
  gift: 'Open it, bè chẽ! 🎁',
  burst: 'All for you 💐',
}
