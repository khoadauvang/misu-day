// Chi tiết từng loài hoa (bấm vào hoa trong Collection): ý nghĩa, chuyện kể, điều thú vị, kiểu gói.
// id trùng với id món đồ trong items.ts. Hình bó hoa vẽ ở src/components/Flowers.tsx.
// Nguồn ý nghĩa: các trang về "language of flowers" (floriography) của nhà hoa và vườn bách thảo.

export type FlowerInfo = {
  id: string
  /** Vài từ khóa ý nghĩa, hiện thành chip */
  meanings: string[]
  /** Ý nghĩa + câu chuyện */
  story: string
  /** "Did you know?" */
  fact: string
  /** Kiểu gói của bó hoa */
  wrap: string
}

export const FLOWERS: FlowerInfo[] = [
  {
    id: 'roses',
    meanings: ['Love', 'Passion', 'Courage'],
    story:
      "The red rose is the classic flower of romantic love. Greek myth ties it to Aphrodite, goddess of love, and in the Victorian language of flowers a red rose was a brave little \"I love you\". One rose means love at first sight; a dozen means a love that lasts.",
    fact: "Victorians weren't allowed to talk about feelings out loud, so they sent flowers instead. A bouquet was basically a secret love letter.",
    wrap: 'Kraft paper and a twine bow, the classic way',
  },
  {
    id: 'tulips',
    meanings: ['Affection', 'Happiness', 'Caring'],
    story:
      'Pink tulips are the soft, happy kind of love: affection, care and good wishes. Tulips first grew wild in Central Asia, were adored in Persia and the Ottoman Empire, and reached Europe in the 1500s.',
    fact: 'In the 1630s the Dutch went so crazy for tulips ("Tulip Mania") that one rare bulb could cost as much as a house.',
    wrap: 'Cream paper, a sheer pink layer and a satin bow',
  },
  {
    id: 'peonies',
    meanings: ['Prosperity', 'Honor', 'Happy love'],
    story:
      'In China the peony is the "king of flowers", a symbol of wealth, honor and good fortune. Tang dynasty emperors grew huge peony gardens, and peony paintings are hung at home to invite luck. It is also a flower of romance and a happy marriage.',
    fact: 'Its name comes from Paeon, the healer of the Greek gods, who was turned into a peony to keep him safe.',
    wrap: 'Peach and white double wrap with a long silk ribbon',
  },
  {
    id: 'hydrangeas',
    meanings: ['Gratitude', 'Heartfelt feelings', 'Understanding'],
    story:
      'Hydrangeas mean heartfelt emotion and gratitude. A Japanese legend tells of an emperor who sent hydrangeas to the family of the girl he loved, to thank them for understanding him. Each big round head is really lots of tiny flowers holding hands.',
    fact: 'Hydrangeas change color with their soil: acidic soil turns them blue, alkaline soil turns them pink.',
    wrap: 'Korean style: lilac and white layers with a blue ribbon',
  },
  {
    id: 'lavender',
    meanings: ['Devotion', 'Calm', 'Grace'],
    story:
      'Lavender stands for devotion, serenity and grace. In the Victorian language of flowers it meant a quiet, faithful love. Its name most likely comes from the Latin lavare, "to wash", because the Romans scented their baths with it.',
    fact: 'Lavender keeps its scent long after it dries, so a bunch can keep a room calm for months.',
    wrap: 'A farmhouse bundle: linen wrap and twine',
  },
  {
    id: 'babys-breath',
    meanings: ['Everlasting love', 'Purity', 'Innocence'],
    story:
      "Baby's breath means everlasting love, purity and innocence. Its tiny white flowers look like a soft little cloud, and florists love tucking it next to roses to say \"forever\".",
    fact: 'Its scientific name, Gypsophila, means "lover of gypsum" in Greek, because it grows happily in chalky soil.',
    wrap: 'A pink paper cone with a scalloped edge',
  },
]

export const FLOWER_BY_ID: Record<string, FlowerInfo> = Object.fromEntries(FLOWERS.map((f) => [f.id, f]))
