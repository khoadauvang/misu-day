import type { MessageKind } from '../game/types.ts'

// Module 9: tin nhắn giữa Misu và Chằm Chằm. Sửa chữ ở đây, viết bằng tiếng Anh.
// Logic chọn câu trả lời nằm ở src/game/messages.ts.

/** Tin nhanh: Misu chạm là gửi luôn */
export const QUICK_MESSAGES: { kind: Exclude<MessageKind, 'text'>; text: string }[] = [
  { kind: 'miss-you', text: 'I miss you 🥺' },
  { kind: 'hungry', text: "I'm hungry 🍜" },
  { kind: 'extra', text: 'Can I have a little extra? 💸' },
  { kind: 'come-home', text: 'Come home early tonight 🏠' },
  { kind: 'look-bought', text: 'Look what I bought 🛍️' },
]

/** Lời chào hiện khi chưa có tin nào */
export const CHAT_INTRO = 'Hi bè chẽ 💗 Text me anytime. Every message you send here reaches me for real.'

/** Misu gửi tối đa bao nhiêu tin mỗi ngày (mỗi tin là một email thật) */
export const DAILY_MESSAGE_LIMIT = 30

/** Lịch sử chat giữ tối đa bao nhiêu tin (tin cũ nhất bị xóa trước) */
export const MESSAGE_HISTORY_LIMIT = 300

/** Tin nhắn dài tối đa bao nhiêu ký tự */
export const MESSAGE_MAX_LENGTH = 500

/**
 * "Tâm trạng" khi trả lời, theo việc Chằm Chằm đang làm (xem src/data/husband.ts):
 * - morning: đang chuẩn bị đi làm
 * - work: ở công ty · lunch: nghỉ trưa · driving: đang lái xe
 * - home: ở nhà buổi tối hoặc cuối tuần · band: tập band · sleeping: đang ngủ
 * - any: dùng khi không có câu riêng cho tâm trạng đó
 */
export type ReplyMood = 'morning' | 'work' | 'lunch' | 'driving' | 'home' | 'band' | 'sleeping'

/**
 * Câu trả lời tự động của Chằm Chằm. Mỗi lần chọn ngẫu nhiên một câu.
 * Chỗ trống tự điền:
 * - {item}: món Misu mua gần nhất (chỉ dùng cho "Look what I bought")
 * - {amount}: số tiền gửi thêm (chỉ dùng cho "Can I have a little extra?")
 * - {until}: giờ Chằm Chằm xong việc đang làm, ví dụ "6:00 PM"
 */
export const REPLIES: Record<MessageKind, Partial<Record<ReplyMood, string[]>> & { any: string[] }> = {
  'miss-you': {
    morning: ['Miss you already and I haven’t even left 🥺', 'One more hug before I go? 🤗'],
    work: [
      'Miss you more 🥺 Home by 5:45, promise.',
      'Sneaking a peek at your photo between meetings 💗',
      'Save me a hug for tonight, bè chẽ 🤗',
    ],
    lunch: ['Eating lunch and missing you 🍱💗', 'Lunch would taste better with you here 🥺'],
    driving: ['Siri, tell bè chẽ I miss her too 🚗💗'],
    home: ['I’m right here 🥺 Come here, hug time 🤗', 'Look up, I’m in the next room 😄💗'],
    band: ['Missing you between songs 🥁💗 Home right after, around {until}.'],
    sleeping: ['Zzz… 😴 *mumbles* miss you too, bè chẽ…'],
    any: ['Miss you more, bè chẽ 💗'],
  },
  hungry: {
    morning: ['Eat breakfast first, bè chẽ! 🥐', 'There’s bread in the kitchen 🍞 Eat before you go out!'],
    work: [
      'Go get a mint milk tea at GMI Tea 🧋 You deserve it!',
      'Bánh Tráng Trộn A Lâm is calling your name 😋',
      'Eat something yummy and tell me all about it tonight 🍜',
    ],
    lunch: ['Same! Let’s both go eat right now 🍱', 'I’m eating too. Go get sushi in District 7 🍣'],
    driving: ['Siri, tell bè chẽ to grab some Dairy Queen 🍦🚗'],
    home: ['Let’s go eat together! Hot pot or sushi? 🍲🍣', 'I’ll cook tonight… or we order in 😄'],
    band: ['Grab a snack, I’ll take you to dinner after practice 🥁🍜'],
    sleeping: ['Zzz… 😴 *mumbles* there’s ice cream in the freezer…'],
    any: ['Go eat something yummy, bè chẽ 🍜'],
  },
  extra: {
    work: ['Sent you {amount} 💸 Have fun, bè chẽ!', 'Done! {amount} is in your wallet 💸 Buy something cute.'],
    lunch: ['Sent {amount} from the lunch table 💸 Treat yourself!'],
    driving: ['Sent {amount} from the parking lot 💸 Have fun!'],
    home: ['Here you go, {amount} 💸 Now come give me a kiss 😘'],
    band: ['Sent {amount} between songs 🥁💸'],
    sleeping: ['Zzz… *sleepily sends {amount}* 😴💸'],
    any: ['Sent you {amount} 💸 Have fun, bè chẽ!'],
  },
  'come-home': {
    morning: ['I haven’t even left yet 😄 Home by 5:45, promise.'],
    work: ['Leaving as early as I can 🏃‍♂️💨', 'Wrapping things up now. Wait for me 🏠💗'],
    lunch: ['I’ll try to sneak out early tonight 🤫🏠'],
    driving: ['Siri, tell bè chẽ: tonight I’m all hers 🚗💗'],
    home: ['I’m already home, silly 😄 Come cuddle 🏠💗'],
    band: ['Practice ends at {until}, then I’m all yours 🥁💗'],
    sleeping: ['Zzz… 😴 I’m right here next to you, bè chẽ 💗'],
    any: ['I’ll be home as soon as I can 🏠💗'],
  },
  'look-bought': {
    sleeping: ['Zzz… 😴 *mumbles* so pretty…'],
    any: [
      'Ooh, {item}! 😍 Show me tonight.',
      'Wow, {item}? You have the best taste, bè chẽ 💗',
      'Show me, show me! 🛍️',
    ],
  },
  text: {
    morning: ['Good morning, bè chẽ ☀️ Got your message 💗'],
    work: [
      'Got it 💗 In a meeting, I’ll call you later!',
      'Reading this under the table 🙈 Love you!',
      'You just made my day at the office 💼💗',
    ],
    lunch: ['Perfect timing, I’m on lunch break 🍱 Tell me more!'],
    driving: ['Siri, read bè chẽ’s message… aww 🚗💗'],
    home: ['Coming to give you a hug 🤗', 'Why are we texting, I’m right here 😄💗'],
    band: ['Got it! Back to drumming 🥁💗'],
    sleeping: ['Zzz… 😴💗'],
    any: ['Love you, bè chẽ 💗'],
  },
}
