// Nhạc nền + bài Happy Birthday hộp nhạc.
// Game tự "chơi" các nốt này bằng Web Audio (src/lib/synth.ts): không dùng file nhạc,
// nên không lo bản quyền, app vẫn nhẹ và chạy được khi mất mạng.
//
// Cách viết nốt: tên nốt + quãng tám (C4 = Đô giữa, A5 = La cao hơn), dấu ':' rồi số phách.
// Ví dụ 'A5:1.5 G5:.5 E5:1 G5:1' = La 1 phách rưỡi, Sol nửa phách, Mi 1 phách, Sol 1 phách.
// '-:1' là nghỉ 1 phách. Mỗi ô nhịp phải cộng đủ số phách (nhạc nền 4, Happy Birthday 3).

/** Âm lượng (0–1). Misu bật/tắt nhạc và tiếng ở đầu tab Home */
export const MUSIC_VOLUME = 0.5
export const SFX_VOLUME = 0.8

/** Một hợp âm: nốt bass + các nốt piano điện chơi cùng lúc */
export type ChordShape = { bass: string; notes: string[] }

export type Song = {
  bpm: number
  beatsPerBar: number
  /** Nốt nửa phách nghịch phách đi trễ bao nhiêu phách (0 = đều, 0.1 = hơi nhún kiểu lo-fi) */
  swing: number
  /** chill: piano đệm + bass + trống nhẹ, lặp mãi · waltz: bùm-chát-chát kiểu hộp nhạc, phát một lần */
  style: 'chill' | 'waltz'
  /** Bỏ bớt bao nhiêu phách im lặng ở đầu bài (ô nhịp lấy đà) */
  skip?: number
  shapes: Record<string, ChordShape>
  /** Mỗi ô nhịp một chuỗi hợp âm. 'Dm7 G7' = chia đôi ô; 'C:2 G7:1' = ghi rõ số phách; '' = không đệm */
  chords: string[]
  /** Mỗi ô nhịp một chuỗi nốt giai điệu, chơi bằng tiếng hộp nhạc */
  melody: string[]
}

/** Nhạc nền: 16 ô nhịp (~48 giây), lặp lại liền mạch. Giọng Đô trưởng, chậm rãi, dễ thương */
export const BGM: Song = {
  bpm: 80,
  beatsPerBar: 4,
  swing: 0.1,
  style: 'chill',
  // Thế bấm piano không có nốt gốc (bass đã chơi), các nốt trượt nhẹ sang nhau cho êm
  shapes: {
    Fmaj7: { bass: 'F2', notes: ['A3', 'C4', 'E4', 'G4'] },
    Em7: { bass: 'E2', notes: ['B3', 'D4', 'E4', 'G4'] },
    Dm7: { bass: 'D2', notes: ['A3', 'C4', 'D4', 'F4'] },
    Cmaj7: { bass: 'C3', notes: ['G3', 'B3', 'D4', 'E4'] },
    Am7: { bass: 'A2', notes: ['A3', 'C4', 'E4', 'G4'] },
    G7: { bass: 'G2', notes: ['F3', 'A3', 'B3', 'D4'] },
    G7sus: { bass: 'G2', notes: ['F3', 'A3', 'C4', 'D4'] },
  },
  chords: [
    // Đoạn A
    'Fmaj7', 'Em7', 'Dm7', 'Cmaj7',
    'Fmaj7', 'Em7 Am7', 'Dm7 G7', 'Cmaj7',
    // Đoạn B
    'Am7', 'Em7', 'Fmaj7', 'Cmaj7',
    'Dm7', 'Em7', 'Fmaj7', 'G7sus G7',
  ],
  melody: [
    // Đoạn A: mỗi ô bắt đầu bằng nốt thứ ba của hợp âm rồi đi xuống từng bậc
    'A5:1.5 G5:.5 E5:1 G5:1',
    'G5:1.5 E5:.5 D5:1 E5:1',
    'F5:1.5 E5:.5 D5:1 A5:1',
    'E5:2.5 -:.5 E5:.5 G5:.5',
    'A5:1.5 G5:.5 A5:1 C6:1',
    'B5:1.5 A5:.5 G5:1 E5:1',
    'F5:1 A5:1 G5:1 F5:1',
    'E5:3 -:1',
    // Đoạn B: cao hơn, lấp lánh hơn
    'E5:.5 A5:.5 C6:1 B5:.5 A5:.5 G5:1',
    'G5:1.5 E5:.5 D5:1 B4:1',
    'A5:.5 C6:.5 E6:1 D6:.5 C6:.5 A5:1',
    'G5:2.5 A5:.5 G5:.5 E5:.5',
    'A5:1.5 G5:.5 F5:1 D5:1',
    'G5:1.5 A5:.5 B5:1 D6:1',
    'C6:1.5 A5:.5 G5:1 E5:1',
    'D5:1 C5:1 B4:1 D5:.5 F5:.5',
  ],
}

/** Happy Birthday (giai điệu đã hết bản quyền), hộp nhạc nhịp 3/4, phát một lần khi Misu mở quà */
export const BIRTHDAY_SONG: Song = {
  bpm: 104,
  beatsPerBar: 3,
  swing: 0,
  style: 'waltz',
  skip: 2,
  shapes: {
    C: { bass: 'C3', notes: ['E4', 'G4', 'C5'] },
    G7: { bass: 'G2', notes: ['D4', 'F4', 'B4'] },
    C7: { bass: 'C3', notes: ['E4', 'Bb4', 'C5'] },
    F: { bass: 'F2', notes: ['F4', 'A4', 'C5'] },
  },
  chords: ['', 'C', 'G7', 'G7', 'C', 'C7', 'F', 'C:2 G7:1', 'C'],
  melody: [
    '-:2 G5:.75 G5:.25',
    'A5:1 G5:1 C6:1',
    'B5:2 G5:.75 G5:.25',
    'A5:1 G5:1 D6:1',
    'C6:2 G5:.75 G5:.25',
    'G6:1 E6:1 C6:1',
    'B5:1 A5:1 F6:.75 F6:.25',
    'E6:1 C6:1 D6:1',
    'C6:3',
  ],
}
