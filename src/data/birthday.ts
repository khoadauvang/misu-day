import type { ColorToken } from './districts.ts'

// Nội dung sinh nhật: hiện ở lần mở game đầu tiên.
// Trình tự: game mờ đi → pháo hoa, bánh kem nhảy ra góc trái, Chằm Chằm hiện ở góc phải
// → bức thư trái tim → các trang thư (lật "xoẹt") → mở quà.
//
// Thư là ngoại lệ duy nhất của luật "100% tiếng Anh": thư giữ nguyên giọng của bạn.
// Mỗi tờ thư (sheet) một màu giấy, mỗi tờ chia thành vài trang để chữ đủ to trên iPhone.
// Sửa chữ thoải mái; muốn thêm trang thì thêm một chuỗi vào `pages`.

/** Quà mở đầu: 9,100,000₫ cho ngày 9/10 */
export const BIRTHDAY_GIFT = 9_100_000

/** Sticker đặc biệt tặng kèm (id trong items.ts) */
export const BIRTHDAY_STICKER = 'birthday-cake-19'

/** Dòng ghi vào nhật ký khi nhận quà */
export const BIRTHDAY_DIARY = 'Happy 19th birthday! 🎂 A letter and a gift from Chằm Chằm.'

/** Tiêu đề thư: mỗi phần tử là một dòng, không bao giờ tự xuống dòng; cỡ chữ tự co cho vừa màn hình */
export const LETTER_TITLE = ['CHÚC MỪNG SN', 'VỢ EO THƠM THO', 'CUTE PHÔ MAI QUE NHÓ']

export type LetterSheet = {
  /** Màu giấy (tên màu trong src/index.css) */
  paper: ColorToken
  pages: string[]
}

export const LETTER_SHEETS: LetterSheet[] = [
  {
    paper: 'petal',
    pages: [
      'hì hì, ck mong là món quà nhỏ này của ck không quá obvious, vì somehow bữa giờ thread nó cũng rầm rộ cái trend game chơi trên web safari, kiểu trùng hợp vãi, và ý nghĩa game này a thiết kế cho vk là giúp vợ manifest những thứ vk muốn trong cuộc sống vk mạnh hơn.',
      'Ck đã tổng hợp và nghiên cứu sâu về hành vi của vk để tạo ra con game này, nhưng mà cũng cảm ơn AI giúp anh code và ngày đêm nghiên cứu hướng thiết kế trải nghiệm game và tích lũy đủ các thứ để vk làm trong con game mini (mini vì mới version 1 thui, đợi các phiên bản cập nhật sắp tới nhe hehe)',
    ],
  },
  {
    paper: 'butter',
    pages: [
      'NHƯNG MÀ YESSSSS, vk iu của chằm lên 19, chúc mừng vk iuuuu, chằm chúc 19 này của bà chã sẽ có cực kì nhiều điều thú vị xảy ra, chằm cũng chả biết đâu nhưng mà những điều thú vị ấy dù tốt xấu gì, chằm vẫn sẽ ở bên bà chã, cùng experience nó, cùng đón nhận nó, và cùng vượt qua nó.',
      'Và chúc vợ săn được nhiều HD hơn, keep in mind là vợ luôn có thằng chằm cite đỉnh nhất cái rmit này roài, im well trained kkkkk. Chúc nhiều quá mà chằm mém quên khen, rằng bà chã là người dễ thương nhấttttt, xinh đẹp thì phải gọi là cốc cốc mở cửa cho anh đeeeeeee, thông minh thì khỏi bàn.',
      'Vừa có tâm có công sức đổ vào mọi thứ bà chã làm, vừa thông minh thì chắc chắn phải cam đoan bà chã đang rất đẳng cấp và sẽ trở thành người đẳng cấp nhứt thế giới lày (cùng chằm). Và kiên cường nữa, rất kiên cường, cũng như là kiên nhẫn :<. Chằm không bao giờ quên cách bà chã endure chằm được tới giờ :<.',
    ],
  },
  {
    paper: 'lavender',
    pages: [
      'Believe me when I say this, ur the 1st one AND THE ONLY ONE, who i truly want to spend my entire life with, at least in a way which sound more promising is that i want to keep building this relationship with u babe, no matter whatever hardships we have to face.',
      'And in addition to celebrating ur birthday together this year, im also celebrating for the event of us finding each other, it may have started out rough, but things get easier and easier day by day, Lets enjoy this journey and share every last bit of moments together. Ô cấy? 💝💝💝',
    ],
  },
]

/** Ký tên cuối thư */
export const LETTER_SIGNATURE = 'Chằm Chằm'

/** Câu Chằm Chằm nói ở góc màn hình */
export const BIRTHDAY_BUBBLES = {
  party: 'Happy 19th, bè chẽ! 🎂',
  gift: 'One more thing… 🎁',
}
