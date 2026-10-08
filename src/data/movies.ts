import type { Movie, MovieKind } from '../game/types.ts'

// Movie night 🍿: phim và series Mỹ/Anh Misu xem ở nhà (tab Home → Movie night).
// Chỉ là NỘI DUNG: thêm, bớt, đổi thứ tự thoải mái. Chữ hiển thị viết bằng tiếng Anh.
// Không đổi `id` của phim đã có: số lần Misu đã xem được lưu theo id.
//
// GIF lấy từ GIPHY lúc Misu bấm Watch (xem src/lib/giphy.ts):
//   - gif.ids: id GIF tự chọn trên giphy.com (phần sau dấu "-" cuối cùng trong link giphy.com/gifs/...). Có thì dùng trước.
//   - gif.q:   từ khóa tìm kiếm, dùng khi tìm theo tên phim ra GIF sai.
//   - không có: tìm "<tên phim> movie" (series thì "<tên phim> tv show").

/** Năng lượng, XP và tên hiển thị của Movie night */
export const MOVIE_NIGHT = {
  name: 'Movie night',
  emoji: '🍿',
  /** Năng lượng tốn mỗi lần xem */
  energy: 10,
  /** XP mỗi lần xem, theo loại */
  xp: { romcom: 15, comedy: 15, series: 10 } satisfies Record<MovieKind, number>,
  /** XP thưởng thêm khi xem một phim lần đầu */
  firstWatchXp: 5,
}

/** Các nhóm lọc trong danh sách */
export const MOVIE_KINDS: { kind: MovieKind; label: string; emoji: string }[] = [
  { kind: 'romcom', label: 'Rom-coms', emoji: '💕' },
  { kind: 'comedy', label: 'Comedies', emoji: '😂' },
  { kind: 'series', label: 'Series', emoji: '📺' },
]

/** Tên loại khi hiện cạnh từng phim */
export const KIND_NAME: Record<MovieKind, string> = { romcom: 'Rom-com', comedy: 'Comedy', series: 'TV series' }

export const COUNTRY_FLAG: Record<Movie['from'], string> = { US: '🇺🇸', UK: '🇬🇧' }

/** Câu ghi vào nhật ký, chọn ngẫu nhiên. {title} = tên phim, {year} = năm */
export const MOVIE_DIARY = {
  movie: ['Movie night in: {title} ({year}). Snacks were involved. 🍿', '{title} ({year}) on the sofa. Laughed, swooned, repeat. 🍿'],
  movieAgain: ['Rewatched {title}. Still perfect. 💕', 'Another round of {title}. It never gets old. 🍿'],
  series: ['Started {title}. Just one more episode… 📺', 'A {title} marathon on the sofa. 📺'],
  seriesAgain: ['Another episode of {title}. And another. And another. 📺', '{title} again. Comfort show, comfort snacks. 📺'],
}

export const MOVIES: Movie[] = [
  // ⭐ Phim Misu thích nhất (hiện đầu danh sách)
  { id: 'friends', title: 'Friends', year: 1994, from: 'US', kind: 'series', emoji: '☕', fav: true,
    line: 'Six friends, one orange couch and a lot of coffee.' },
  { id: 'brooklyn-nine-nine', title: 'Brooklyn Nine-Nine', year: 2013, from: 'US', kind: 'series', emoji: '🚓', fav: true,
    line: 'The funniest police precinct in New York.' },
  { id: 'gossip-girl', title: 'Gossip Girl', year: 2007, from: 'US', kind: 'series', emoji: '💋', fav: true,
    line: 'Upper East Side secrets, served with a headband.' },
  { id: 'how-to-lose-a-guy', title: 'How to Lose a Guy in 10 Days', year: 2003, from: 'US', kind: 'romcom', emoji: '📰', fav: true,
    line: 'A secret article, a secret bet and ten very long days.' },

  // 💕 Rom-com cuối thập niên 90 và 2000
  { id: 'my-best-friends-wedding', title: "My Best Friend's Wedding", year: 1997, from: 'US', kind: 'romcom', emoji: '💍',
    line: "Four days to stop her best friend's wedding." },
  { id: 'youve-got-mail', title: "You've Got Mail", year: 1998, from: 'US', kind: 'romcom', emoji: '💌',
    line: 'Rivals by day, pen pals by night.' },
  { id: 'the-wedding-singer', title: 'The Wedding Singer', year: 1998, from: 'US', kind: 'romcom', emoji: '🎤',
    line: "Big '80s hair and even bigger feelings." },
  { id: '10-things-i-hate-about-you', title: '10 Things I Hate About You', year: 1999, from: 'US', kind: 'romcom', emoji: '📝',
    line: 'Shakespeare goes to high school, 1999 style.' },
  { id: 'shes-all-that', title: "She's All That", year: 1999, from: 'US', kind: 'romcom', emoji: '🎨',
    line: 'A prom-queen bet and a makeover nobody saw coming.' },
  { id: 'never-been-kissed', title: 'Never Been Kissed', year: 1999, from: 'US', kind: 'romcom', emoji: '🏫',
    line: 'A reporter goes back to high school, undercover.' },
  { id: 'runaway-bride', title: 'Runaway Bride', year: 1999, from: 'US', kind: 'romcom', emoji: '👰',
    line: 'A bride who keeps running, and the reporter who wants the story.' },
  { id: 'the-wedding-planner', title: 'The Wedding Planner', year: 2001, from: 'US', kind: 'romcom', emoji: '📋',
    line: 'She plans perfect weddings, then falls for a groom.' },
  { id: 'the-princess-diaries', title: 'The Princess Diaries', year: 2001, from: 'US', kind: 'romcom', emoji: '👑',
    line: 'Shy teen today, princess of Genovia tomorrow.' },
  { id: 'kate-and-leopold', title: 'Kate & Leopold', year: 2001, from: 'US', kind: 'romcom', emoji: '🎩',
    line: 'A duke from 1876 lands in modern New York.' },
  { id: 'serendipity', title: 'Serendipity', year: 2001, from: 'US', kind: 'romcom', emoji: '🧤',
    line: 'A pair of gloves, a five-dollar bill and a lot of fate.' },
  { id: 'maid-in-manhattan', title: 'Maid in Manhattan', year: 2002, from: 'US', kind: 'romcom', emoji: '🏨',
    line: 'A hotel maid, a borrowed designer coat and one big mix-up.' },
  { id: 'sweet-home-alabama', title: 'Sweet Home Alabama', year: 2002, from: 'US', kind: 'romcom', emoji: '🏡',
    line: 'A New York designer goes home to Alabama to settle the past.' },
  { id: 'two-weeks-notice', title: 'Two Weeks Notice', year: 2002, from: 'US', kind: 'romcom', emoji: '🏢',
    line: 'She quits. He has two weeks to learn to live without her.' },
  { id: '13-going-on-30', title: '13 Going on 30', year: 2004, from: 'US', kind: 'romcom', emoji: '✨',
    line: 'Make a wish at 13, wake up at 30.' },
  { id: '50-first-dates', title: '50 First Dates', year: 2004, from: 'US', kind: 'romcom', emoji: '🌺',
    line: 'Making her fall in love again, every single morning.' },
  { id: 'a-cinderella-story', title: 'A Cinderella Story', year: 2004, from: 'US', kind: 'romcom', emoji: '👠',
    line: 'A lost phone instead of a glass slipper.' },
  { id: 'hitch', title: 'Hitch', year: 2005, from: 'US', kind: 'romcom', emoji: '💘',
    line: "New York's secret date doctor meets his match." },
  { id: 'the-holiday', title: 'The Holiday', year: 2006, from: 'US', kind: 'romcom', emoji: '❄️',
    line: 'Two strangers swap homes for Christmas: sunny LA and a snowy English cottage.' },
  { id: 'enchanted', title: 'Enchanted', year: 2007, from: 'US', kind: 'romcom', emoji: '🏰',
    line: 'A cartoon princess tumbles into real-life New York.' },
  { id: 'music-and-lyrics', title: 'Music and Lyrics', year: 2007, from: 'US', kind: 'romcom', emoji: '🎹',
    line: "An '80s pop star needs a new song, and a lyricist, fast." },
  { id: '27-dresses', title: '27 Dresses', year: 2008, from: 'US', kind: 'romcom', emoji: '👗',
    line: 'Always a bridesmaid, with 27 dresses to prove it.' },
  { id: 'confessions-of-a-shopaholic', title: 'Confessions of a Shopaholic', year: 2009, from: 'US', kind: 'romcom', emoji: '🛍️',
    line: 'A green scarf, a lot of shopping bags and a job writing about money.' },
  { id: 'the-proposal', title: 'The Proposal', year: 2009, from: 'US', kind: 'romcom', emoji: '💼',
    line: 'A fake engagement and a very real trip to Alaska.' },

  // 💕 Rom-com kinh điển
  { id: 'when-harry-met-sally', title: 'When Harry Met Sally...', year: 1989, from: 'US', kind: 'romcom', emoji: '🍂',
    line: 'Can a man and a woman ever just be friends?' },
  { id: 'pretty-woman', title: 'Pretty Woman', year: 1990, from: 'US', kind: 'romcom', emoji: '🌹',
    line: 'A week in Beverly Hills and a shopping spree on Rodeo Drive.' },
  { id: 'sleepless-in-seattle', title: 'Sleepless in Seattle', year: 1993, from: 'US', kind: 'romcom', emoji: '📻',
    line: 'A radio show, a heartbroken dad and the Empire State Building.' },

  // 💕 Rom-com 2010 – 2020
  { id: 'crazy-stupid-love', title: 'Crazy, Stupid, Love', year: 2011, from: 'US', kind: 'romcom', emoji: '🍸',
    line: 'A newly single dad gets dating lessons from a smooth stranger.' },
  { id: 'crazy-rich-asians', title: 'Crazy Rich Asians', year: 2018, from: 'US', kind: 'romcom', emoji: '💎',
    line: 'Meeting his family in Singapore turns out to be a whole event.' },
  { id: 'to-all-the-boys', title: "To All the Boys I've Loved Before", year: 2018, from: 'US', kind: 'romcom', emoji: '📬',
    line: 'Her five secret love letters get mailed out. Oops.' },
  { id: 'set-it-up', title: 'Set It Up', year: 2018, from: 'US', kind: 'romcom', emoji: '🍕',
    line: 'Two overworked assistants play matchmaker for their bosses.' },
  { id: 'always-be-my-maybe', title: 'Always Be My Maybe', year: 2019, from: 'US', kind: 'romcom', emoji: '🍜',
    line: 'Childhood best friends meet again in San Francisco.' },
  { id: 'isnt-it-romantic', title: "Isn't It Romantic", year: 2019, from: 'US', kind: 'romcom', emoji: '🌸',
    line: 'She hates rom-coms, then wakes up inside one.' },
  { id: 'the-lost-city', title: 'The Lost City', year: 2022, from: 'US', kind: 'romcom', emoji: '🗺️',
    line: 'A romance novelist and her cover model, lost in the jungle.' },

  // 💕 Rom-com Anh
  { id: 'four-weddings-and-a-funeral', title: 'Four Weddings and a Funeral', year: 1994, from: 'UK', kind: 'romcom', emoji: '💒',
    line: 'Very British, very awkward and very much in love.' },
  { id: 'notting-hill', title: 'Notting Hill', year: 1999, from: 'UK', kind: 'romcom', emoji: '📚',
    line: 'A London bookshop owner and the most famous actress in the world.' },
  { id: 'bridget-jones', title: "Bridget Jones's Diary", year: 2001, from: 'UK', kind: 'romcom', emoji: '📔',
    line: 'One year, one diary and two very different men.' },
  { id: 'love-actually', title: 'Love Actually', year: 2003, from: 'UK', kind: 'romcom', emoji: '🎄',
    line: 'Christmas in London and lots of little love stories.' },
  { id: 'wimbledon', title: 'Wimbledon', year: 2004, from: 'UK', kind: 'romcom', emoji: '🎾',
    line: 'One last tennis tournament and a brand-new love.' },
  { id: 'mamma-mia', title: 'Mamma Mia!', year: 2008, from: 'UK', kind: 'romcom', emoji: '🏝️',
    line: 'A Greek island wedding, three possible dads and a lot of ABBA.' },
  { id: 'about-time', title: 'About Time', year: 2013, from: 'UK', kind: 'romcom', emoji: '⏳',
    line: 'He can go back in time, and he uses it for love.' },
  { id: 'love-rosie', title: 'Love, Rosie', year: 2014, from: 'UK', kind: 'romcom', emoji: '💞',
    line: 'Best friends forever. Timing: terrible.' },
  { id: 'yesterday', title: 'Yesterday', year: 2019, from: 'UK', kind: 'romcom', emoji: '🎸',
    line: 'He wakes up in a world where only he remembers the Beatles.',
    gif: { q: 'yesterday movie beatles' } },
  { id: 'last-christmas', title: 'Last Christmas', year: 2019, from: 'UK', kind: 'romcom', emoji: '⛄',
    line: 'A Christmas-shop elf in London meets a mysterious stranger.' },
  { id: 'emma', title: 'Emma.', year: 2020, from: 'UK', kind: 'romcom', emoji: '🎀',
    line: 'A Regency matchmaker who gets everything wrong.',
    gif: { q: 'emma 2020 anya taylor-joy' } },

  // 😂 Phim hài
  { id: 'clueless', title: 'Clueless', year: 1995, from: 'US', kind: 'comedy', emoji: '💛',
    line: 'Beverly Hills, plaid outfits and matchmaking gone wrong.' },
  { id: 'miss-congeniality', title: 'Miss Congeniality', year: 2000, from: 'US', kind: 'comedy', emoji: '🕵️‍♀️',
    line: 'An FBI agent goes undercover at a beauty pageant.' },
  { id: 'legally-blonde', title: 'Legally Blonde', year: 2001, from: 'US', kind: 'comedy', emoji: '💅',
    line: 'Pink, blonde and headed for Harvard Law.' },
  { id: 'freaky-friday', title: 'Freaky Friday', year: 2003, from: 'US', kind: 'comedy', emoji: '🔄',
    line: 'Mom and daughter swap bodies for one very long Friday.',
    gif: { q: 'freaky friday 2003' } },
  { id: 'mean-girls', title: 'Mean Girls', year: 2004, from: 'US', kind: 'comedy', emoji: '💖',
    line: 'New school, new rules, and pink on Wednesdays.' },
  { id: 'the-devil-wears-prada', title: 'The Devil Wears Prada', year: 2006, from: 'US', kind: 'comedy', emoji: '👜',
    line: 'A fashion magazine, a terrifying boss and one cerulean sweater.' },
  { id: 'mr-beans-holiday', title: "Mr. Bean's Holiday", year: 2007, from: 'UK', kind: 'comedy', emoji: '🏖️',
    line: 'Mr. Bean wins a trip to the French Riviera. Chaos follows.' },
  { id: '17-again', title: '17 Again', year: 2009, from: 'US', kind: 'comedy', emoji: '🏀',
    line: 'A grown-up dad gets to be 17 again.' },
  { id: 'easy-a', title: 'Easy A', year: 2010, from: 'US', kind: 'comedy', emoji: '🅰️',
    line: 'One little rumor, and the whole school is talking.' },
  { id: 'pitch-perfect', title: 'Pitch Perfect', year: 2012, from: 'US', kind: 'comedy', emoji: '🎵',
    line: 'A college a cappella group with something to prove.' },
  { id: 'paddington', title: 'Paddington', year: 2014, from: 'UK', kind: 'comedy', emoji: '🧸',
    line: 'A polite bear from Peru, a London family and lots of marmalade.' },
  { id: 'the-intern', title: 'The Intern', year: 2015, from: 'US', kind: 'comedy', emoji: '👔',
    line: 'A 70-year-old intern at a fashion start-up.' },
  { id: 'paddington-2', title: 'Paddington 2', year: 2017, from: 'UK', kind: 'comedy', emoji: '🍊',
    line: 'A pop-up book, a big mix-up and the kindest bear in London.' },
  { id: 'barbie', title: 'Barbie', year: 2023, from: 'US', kind: 'comedy', emoji: '💗',
    line: 'Everything is pink, until Barbie visits the real world.' },

  // 📺 Series Mỹ
  { id: 'gilmore-girls', title: 'Gilmore Girls', year: 2000, from: 'US', kind: 'series', emoji: '🍁',
    line: 'A mom and daughter who talk fast and drink coffee faster.' },
  { id: 'how-i-met-your-mother', title: 'How I Met Your Mother', year: 2005, from: 'US', kind: 'series', emoji: '🗽',
    line: 'A dad tells his kids a very, very long story.' },
  { id: 'the-office', title: 'The Office', year: 2005, from: 'US', kind: 'series', emoji: '📎',
    line: "A paper company and the world's most awkward boss.",
    gif: { q: 'the office us' } },
  { id: 'the-big-bang-theory', title: 'The Big Bang Theory', year: 2007, from: 'US', kind: 'series', emoji: '🔬',
    line: 'Genius physicists, zero social skills and the girl across the hall.' },
  { id: 'modern-family', title: 'Modern Family', year: 2009, from: 'US', kind: 'series', emoji: '👨‍👩‍👧‍👦',
    line: 'Three households, one big and very loud family.' },
  { id: 'parks-and-recreation', title: 'Parks and Recreation', year: 2009, from: 'US', kind: 'series', emoji: '🧇',
    line: 'Small-town government with a big heart and lots of waffles.' },
  { id: 'new-girl', title: 'New Girl', year: 2011, from: 'US', kind: 'series', emoji: '🎈',
    line: 'A quirky teacher moves in with three guys.' },
  { id: 'the-good-place', title: 'The Good Place', year: 2016, from: 'US', kind: 'series', emoji: '😇',
    line: 'She ended up in the Good Place by mistake.' },
  { id: 'emily-in-paris', title: 'Emily in Paris', year: 2020, from: 'US', kind: 'series', emoji: '🥐',
    line: 'A Chicago marketer, a job in Paris and very good outfits.' },
  { id: 'ted-lasso', title: 'Ted Lasso', year: 2020, from: 'US', kind: 'series', emoji: '⚽',
    line: 'An American football coach takes over an English soccer club.' },
  { id: 'never-have-i-ever', title: 'Never Have I Ever', year: 2020, from: 'US', kind: 'series', emoji: '📓',
    line: 'Crushes, grades and one very dramatic sophomore year.' },
  { id: 'abbott-elementary', title: 'Abbott Elementary', year: 2021, from: 'US', kind: 'series', emoji: '🍎',
    line: 'An underfunded school with the most dedicated teachers.' },

  // 📺 Series Anh
  { id: 'the-it-crowd', title: 'The IT Crowd', year: 2006, from: 'UK', kind: 'series', emoji: '💻',
    line: 'Two IT guys in a basement and a boss who knows nothing about computers.' },
  { id: 'gavin-and-stacey', title: 'Gavin & Stacey', year: 2007, from: 'UK', kind: 'series', emoji: '💑',
    line: 'Essex boy meets Welsh girl, and two families collide.' },
  { id: 'miranda', title: 'Miranda', year: 2009, from: 'UK', kind: 'series', emoji: '🎁',
    line: 'A tall, clumsy joke-shop owner who chats to the camera.',
    gif: { q: 'miranda hart' } },
  { id: 'derry-girls', title: 'Derry Girls', year: 2018, from: 'UK', kind: 'series', emoji: '🎒',
    line: 'Teenage chaos in 1990s Northern Ireland.' },
  { id: 'ghosts', title: 'Ghosts', year: 2019, from: 'UK', kind: 'series', emoji: '👻',
    line: 'A couple inherits a country house, and all its ghosts.',
    gif: { q: 'ghosts bbc' } },
]

export const MOVIE_BY_ID: Record<string, Movie> = Object.fromEntries(MOVIES.map((movie) => [movie.id, movie]))
