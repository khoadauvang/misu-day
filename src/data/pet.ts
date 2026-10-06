import type { Activity } from '../game/types.ts'

// Cún Golden Retriever của Misu.
// Nhận nuôi + mua đồ ăn ở Pet Shop (District 2, xem places.ts); cho ăn, đi dạo, chơi ở tab Home.
// Cún không bao giờ bỏ đi hay bị phạt: đói thì chỉ buồn thiu chờ Misu.
// Viết bằng tiếng Anh. Trong câu nhật ký, {pet} được thay bằng tên cún.

export const PET_BREED = 'Golden Retriever'

/** Tên gợi ý khi nhận nuôi (Misu tự gõ tên khác cũng được) */
export const PET_NAME_IDEAS = ['Mochi', 'Bơ', 'Latte', 'Honey', 'Toffee', 'Butter']

/** Tên dài tối đa bao nhiêu ký tự */
export const PET_NAME_MAX = 14

/** Cún mới về nhà: độ no, độ vui ban đầu (0–100) */
export const PET_START = { fullness: 70, happiness: 90 }

/** Đồ ăn tặng kèm khi nhận nuôi: id đồ ăn → số phần */
export const PET_STARTER_PANTRY: Record<string, number> = { kibble: 5, bone: 1 }

/** Mỗi giờ (kể cả lúc tắt app) cún đói thêm / buồn thêm bao nhiêu */
export const PET_FULLNESS_PER_HOUR = 4
export const PET_HAPPINESS_PER_HOUR = 3

/** Độ no dưới mức này: cún kêu đói */
export const PET_HUNGRY_BELOW = 30
/** Độ no từ mức này trở lên: cún no rồi, không ăn thêm (trừ xương gặm) */
export const PET_FULL_AT = 90
/** Độ vui dưới mức này: cún buồn, muốn chơi */
export const PET_BORED_BELOW = 35

/** Câu hiện trên thẻ cún ở Home, theo tâm trạng */
export const PET_MOOD_LINES = {
  happy: '{pet} is so happy to see you 💛',
  okay: '{pet} is chilling at home 🐾',
  hungry: '{pet} is hungry 🥺 Time for a meal!',
  bored: '{pet} wants to play 🎾',
  sleeping: '{pet} is fast asleep 😴',
} as const

/** Chạm vào cún ở Home: cún "nói" một câu ngẫu nhiên (không cộng gì) */
export const PET_TAP_LINES = ['Woof! 🐾', 'Arf arf!', '💛💛💛', '*wiggles*', 'Boop! 👃']

export type PetFood = {
  id: string
  name: string
  emoji: string
  /** Tên hành động khi cho ăn */
  action: string
  /** Mỗi phần cộng bao nhiêu độ no / độ vui */
  fullness: number
  happiness: number
  /** XP Misu nhận mỗi lần cho ăn */
  xp: number
  diary: string[]
}

/** Đồ ăn của cún. Giá và số phần mỗi lần mua nằm ở Pet Shop trong places.ts */
export const PET_FOODS: PetFood[] = [
  {
    id: 'kibble',
    name: 'Puppy kibble',
    emoji: '🥣',
    action: 'A bowl of kibble',
    fullness: 40,
    happiness: 5,
    xp: 5,
    diary: ['{pet} gobbled up a bowl of kibble. Crunch crunch! 🥣', 'Breakfast for {pet}. Bowl licked clean in ten seconds.'],
  },
  {
    id: 'chicken',
    name: 'Chicken & pumpkin bowl',
    emoji: '🍗',
    action: 'A chicken & pumpkin bowl',
    fullness: 55,
    happiness: 15,
    xp: 8,
    diary: ['Fresh chicken & pumpkin for {pet}. Happiest tail wags ever. 🍗'],
  },
  {
    id: 'bone',
    name: 'Chew bone',
    emoji: '🦴',
    action: 'A chew bone',
    fullness: 0,
    happiness: 20,
    xp: 5,
    diary: ['{pet} is busy with a chew bone. Do not disturb. 🦴'],
  },
  {
    id: 'pupcake',
    name: 'Pupcake',
    emoji: '🧁',
    action: 'A pupcake treat',
    fullness: 20,
    happiness: 40,
    xp: 10,
    diary: ['A pupcake for {pet}! Happy zoomies all around the room. 🧁'],
  },
]

export const PET_FOOD_BY_ID: Record<string, PetFood> = Object.fromEntries(PET_FOODS.map((food) => [food.id, food]))

/** Cho ăn ở Home: mỗi món trong tủ đồ ăn là một hoạt động (không tốn tiền, đã trả lúc mua) */
export const FEED_ACTIVITIES: Activity[] = PET_FOODS.map((food) => ({
  id: `feed-${food.id}`,
  name: food.action,
  emoji: food.emoji,
  cost: 0,
  energy: 0,
  xp: food.xp,
  pet: { feed: food.id },
  diary: food.diary,
}))

/** Chăm cún ở Home */
export const PET_CARE: Activity[] = [
  {
    id: 'walk-dog',
    name: 'Go for a walk',
    emoji: '🦮',
    cost: 0,
    energy: 15,
    xp: 20,
    oncePerDay: true,
    pet: { happiness: 40 },
    diary: [
      'Took {pet} for a walk in the park. The tail never stopped wagging. 🦮',
      'Evening walk with {pet}. Everyone stopped to say hi. 🦮',
      '{pet} chased a butterfly on our walk. So silly. 🦋',
    ],
  },
  {
    id: 'play-dog',
    name: 'Play & cuddle',
    emoji: '🎾',
    cost: 0,
    energy: 5,
    xp: 5,
    pet: { happiness: 15 },
    diary: [
      'Played fetch with {pet}. The ball came back a little soggy. 🎾',
      'Belly rubs for {pet}. Instant puppy puddle. 💛',
      'Tug of war with {pet}. {pet} won, obviously.',
    ],
  },
]
