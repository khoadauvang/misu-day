import { PLAYER_NAME } from '../../../config.ts'
import { HOME_SPOT } from './context.ts'
import { BACK, C, FRONT, SCENE_H } from './geometry.ts'
import {
  Bitexco,
  Bush,
  ChinaGate,
  ChineseRow,
  ChineseShop,
  Cinema,
  ClassicHall,
  Cloud,
  ColonialHouse,
  Emoji,
  FptCampus,
  Ground,
  Lamp,
  Lanterns,
  Palm,
  Pagoda,
  RmitCampus,
  Shop,
  Sky,
  Spot,
  Stage,
  Stall,
  Stool,
  StringLights,
  Tower,
  Traffic,
  Tree,
  TubeHouse,
  Villa,
  Wires,
} from './parts.tsx'

// Cảnh riêng của từng quận. Mỗi <Spot id="…"> là một địa điểm trong places.ts (chạm để vào).
// Thêm địa điểm mới vào quận: thêm một <Spot> ở đây, nếu không nó chỉ hiện trong danh sách dưới cảnh.

/** Quận 1: trung tâm thành phố, chọc trời san sát, có tháp Bitexco */
export function District1() {
  return (
    <>
      <Sky top={C.petal} />
      <Cloud x={70} y={40} />
      <Cloud x={230} y={70} s={0.8} />
      {/* lớp nhà cao tầng xa phía sau */}
      <Tower x={0} w={50} h={150} fill={C.lavender} far />
      <Tower x={150} w={44} h={176} fill={C.hydrangea} far />
      <Tower x={262} w={52} h={190} fill={C.lavender} far />
      <Ground />
      <Tower x={0} w={42} h={128} fill={C.lavender} facade="bands" />
      <Spot id="tech-store" label="Tech" sign={[72, 170]}>
        <Bitexco x={44} w={58} h={196} />
      </Spot>
      <Spot id="jewelry-house" label="Jewelry" sign={[136, 140]}>
        <Tower x={108} w={56} h={164} fill={C.butter} facade="fins" roof="crown" trim={C.white} />
      </Spot>
      <Tower x={170} w={46} h={132} fill={C.hydrangea} roof="spire" />
      <Tower x={222} w={58} h={184} fill={C.peony} facade="bands" roof="spire" />
      <Tower x={286} w={36} h={118} fill={C.lavender} />
      <Tower x={326} w={40} h={160} fill={C.hydrangea} facade="fins" />
      <Traffic vehicles={['🚕', '🛵', '🚗', '🛵']} />
      <Tree x={120} base={292} s={0.6} />
      <Tree x={238} base={292} s={0.6} />
      <Spot id="sneaker-store" label="Sneakers" sign={[61, 308]}>
        <Shop x={6} w={110} wall={C.white} awning={C.peony} goods="👟" />
      </Spot>
      <Spot id="beauty-counter" label="Beauty" sign={[179, 308]}>
        <Shop x={124} w={110} wall={C.petal} awning={C.lavender} goods="💄" />
      </Spot>
      <Spot id="luxury-boulevard" label="Luxury" sign={[298, 308]}>
        <Shop x={242} w={112} wall={C.butter} awning={C.peonyDeep} goods="👜" />
      </Spot>
      <Lamp x={118} />
      <Lamp x={236} />
    </>
  )
}

/** Quận 3: phố cây xanh, nhà kiểu Pháp, quán cà phê, hiệu sách, tiệm làm đẹp */
export function District3() {
  return (
    <>
      <Sky top={C.butter} />
      <Cloud x={90} y={44} />
      <Ground />
      <Tree x={128} base={BACK} s={1.5} />
      <Tree x={230} base={BACK} s={1.4} />
      <Spot id="library-museum" label="Museum" sign={[63, 150]}>
        <ClassicHall x={6} w={116} h={104} dome />
      </Spot>
      <Spot id="spa" label="Spa" sign={[178, 158]}>
        <ColonialHouse x={132} w={92} h={92} fill={C.petal} />
      </Spot>
      <Spot id="flower-market" label="Flowers" sign={[296, 106]}>
        <Stall x={238} w={50} goods="🌷" umbrella={C.butter} base={BACK} />
        <Stall x={300} w={50} goods="🌻" umbrella={C.peony} base={BACK} />
      </Spot>
      <Traffic vehicles={['🛵', '🛵', '🚕', '🚲']} />
      <Tree x={120} base={292} s={0.6} />
      <Tree x={238} base={292} s={0.6} />
      <Spot id="garden-cafe" label="Café" sign={[61, 308]}>
        <Shop x={6} w={110} wall={C.mint} awning={C.peony} goods="☕" />
      </Spot>
      <Spot id="bookstore" label="Books" sign={[179, 308]}>
        <Shop x={124} w={110} wall={C.butter} awning={C.hydrangea} goods="📚" />
      </Spot>
      <Spot id="beauty-salon" label="Salon" sign={[298, 308]}>
        <Shop x={242} w={112} wall={C.petal} awning={C.lavender} goods="💅" />
      </Spot>
      <Bush x={-6} base={SCENE_H} w={30} />
      <Bush x={330} base={SCENE_H} w={34} />
    </>
  )
}

/** Phú Nhuận: phố local, nhà ống, dây điện, quán ăn vặt + trà sữa san sát, và biệt thự nhà Misu */
export function PhuNhuan() {
  return (
    <>
      <Sky top={C.mint} />
      <Cloud x={60} y={40} s={0.9} />
      <Ground />
      <TubeHouse x={0} w={44} floors={4} fill={C.peach} />
      <TubeHouse x={44} w={42} floors={3} fill={C.butter} />
      <Spot id={HOME_SPOT} label={`${PLAYER_NAME}'s Villa`} sign={[162, 100]}>
        <Villa x={98} w={128} />
      </Spot>
      <TubeHouse x={238} w={40} floors={4} fill={C.lavender} />
      <Spot id="che-corner" label="Chè" sign={[299, 172]}>
        <TubeHouse x={278} w={42} floors={3} fill={C.petal} goods="🍧" awning={C.mint} />
      </Spot>
      <Spot id="xien-que" label="Xiên Que" sign={[322, 128]}>
        <TubeHouse x={320} w={40} floors={4} fill={C.hydrangea} goods="🍢" awning={C.butter} />
      </Spot>
      <Wires poles={[4, 88]} />
      <Wires poles={[236, 356]} />
      <Traffic vehicles={['🛵', '🛵', '🛵', '🚕', '🛵']} />
      <Spot id="gmi-tea" label="GMI Tea" sign={[52, 308]}>
        <Shop x={4} w={96} wall={C.mint} awning={C.peony} goods="🧋" />
      </Spot>
      <Spot id="banh-trang-a-lam" label="A Lâm" sign={[148, 296]}>
        <Stall x={118} w={60} goods="🥢" umbrella={C.butter} />
      </Spot>
      <Spot id="milk-tea-alley" label="Trà Sữa" sign={[237, 308]}>
        <Shop x={196} w={82} wall={C.lavender} awning={C.mint} goods="🧋" />
      </Spot>
      <Spot id="banh-mi-cart" label="Bánh Mì" sign={[320, 296]}>
        <Stall x={292} w={56} goods="🥖" umbrella={C.hydrangea} />
      </Spot>
      <Stool x={102} base={410} />
      <Stool x={182} base={410} fill={C.hydrangea} />
      <Stool x={280} base={410} />
      <Stool x={350} base={410} fill={C.hydrangea} />
    </>
  )
}

/** Quận 5: Chợ Lớn, phố người Hoa, đèn lồng đỏ, chùa, cổng chào */
export function District5() {
  return (
    <>
      <Sky top={C.peach} />
      <Cloud x={280} y={90} s={0.8} />
      <Ground />
      <ChineseRow x={0} w={58} h={86} />
      <Pagoda x={62} w={78} />
      <ChinaGate x={148} w={98} h={96} />
      <ChineseRow x={254} w={52} h={94} fill={C.butter} />
      <ChineseRow x={306} w={56} h={80} fill={C.petal} />
      <Lanterns x1={-4} x2={364} y={178} count={8} sag={8} />
      <Traffic vehicles={['🛵', '🚕', '🛵', '🛺']} />
      <Spot id="dim-sum" label="Dim Sum" sign={[61, 290]}>
        <ChineseShop x={8} w={106} goods="🥟" />
      </Spot>
      <Spot id="hot-pot" label="Hot Pot" sign={[179, 290]}>
        <ChineseShop x={126} w={106} wall={C.butter} goods="🍲" />
      </Spot>
      <Spot id="roast-duck" label="Roast Duck" sign={[298, 290]}>
        <ChineseShop x={244} w={108} wall={C.petal} goods="🦆" />
      </Spot>
    </>
  )
}

/** Quận 7: Phú Mỹ Hưng, phố Nhật – Hàn, trường RMIT */
export function District7() {
  return (
    <>
      <Sky top={C.hydrangea} />
      <Cloud x={190} y={36} />
      <Tower x={240} w={60} h={196} fill={C.lavender} far />
      <Ground />
      <Tower x={0} w={46} h={140} fill={C.lavender} facade="bands" />
      <Spot id="rmit" label="RMIT" sign={[120, 92]}>
        <RmitCampus x={52} w={156} h={120} />
      </Spot>
      <Tower x={232} w={50} h={162} fill={C.white} trim={C.hydrangea} roof="spire" />
      <Tower x={288} w={72} h={108} fill={C.peach} roof="garden" />
      <Palm x={222} base={BACK} s={0.9} />
      <Traffic vehicles={['🚗', '🛵', '🚕', '🛵']} />
      <Tree x={120} base={292} s={0.6} fill={C.petal} />
      <Tree x={238} base={292} s={0.6} fill={C.petal} />
      <Spot id="japanese-corner" label="Japan" sign={[61, 308]}>
        <Shop x={6} w={110} wall={C.white} awning={C.peonyDeep} goods="🍣" />
      </Spot>
      <Spot id="korea-town" label="Korea" sign={[179, 308]}>
        <Shop x={124} w={110} wall={C.lavender} awning={C.peony} goods="🍗" />
      </Spot>
      <Spot id="dairy-queen" label="Dairy Queen" sign={[298, 308]}>
        <Shop x={242} w={112} wall={C.petal} awning={C.peonyDeep} goods="🍦" />
      </Spot>
    </>
  )
}

/**
 * Quận 2: Thảo Điền – Thủ Thiêm, cũng cao tầng nhưng là căn hộ ven sông:
 * mái vườn xanh, ban công, hàng dừa, phía trước là sông Sài Gòn (khác Quận 1 toàn tòa văn phòng kính)
 */
export function District2() {
  return (
    <>
      <Sky top={C.lavender} />
      <Cloud x={120} y={30} s={0.9} />
      <Ground front={C.hydrangea} />
      <Spot id="fitness-club" label="Gym" sign={[35, 112]}>
        <Tower x={4} w={62} h={176} fill={C.hydrangea} facade="fins" roof="garden" />
      </Spot>
      <Tower x={72} w={54} h={200} fill={C.white} facade="bands" trim={C.mint} roof="garden" />
      <Tower x={132} w={58} h={150} fill={C.petal} roof="dome" />
      <Tower x={196} w={48} h={186} fill={C.white} facade="bands" trim={C.lavender} roof="garden" />
      <Tower x={250} w={62} h={140} fill={C.mint} facade="fins" />
      <Tower x={318} w={42} h={170} fill={C.lavender} facade="bands" roof="spire" />
      <Palm x={66} base={BACK} s={0.9} />
      <Palm x={190} base={BACK} s={0.85} />
      <Palm x={310} base={BACK} s={0.9} />
      <Traffic vehicles={['🚗', '🛵', '🚙', '🛵']} />
      <Spot id="riverside-bar" label="Riverside Bar" sign={[61, 308]}>
        <Shop x={6} w={110} wall={C.lavender} awning={C.hydrangea} goods="🍸" />
        <StringLights x1={10} x2={112} y={300} sag={3} count={9} />
      </Spot>
      <Spot id="decor-studio" label="Decor" sign={[179, 308]}>
        <Shop x={124} w={110} wall={C.white} awning={C.mint} goods="🕯️" />
      </Spot>
      <Spot id="pet-shop" label="Pet Shop" sign={[298, 308]}>
        <Shop x={242} w={112} wall={C.butter} awning={C.peony} goods="🐶" />
      </Spot>
      {/* sông Sài Gòn chảy ngang phía trước */}
      {[40, 150, 260].map((x) => (
        <path key={x} d={`M ${x} 408 q 8 -5 16 0 t 16 0`} fill="none" stroke={C.white} strokeWidth={2} strokeLinecap="round" />
      ))}
      <Emoji x={210} y={404} size={16}>
        ⛵
      </Emoji>
    </>
  )
}

/** Quận 9: khu công nghệ cao, trường FPT, sân khấu concert, rạp phim, công viên */
export function District9() {
  return (
    <>
      <Sky top={C.petal} />
      <Cloud x={300} y={100} s={0.8} />
      <Cloud x={110} y={36} />
      <Ground front={C.mint} />
      <Tree x={176} base={BACK} s={0.9} />
      <Spot id="fpt-university" label="FPT University" sign={[68, 98]}>
        <FptCampus x={4} w={164} h={112} />
      </Spot>
      <Spot id="concert-park" label="Concert" sign={[248, 118]}>
        <Stage x={188} w={120} h={104} />
      </Spot>
      <Tree x={334} base={BACK} s={1.1} />
      <Traffic vehicles={['🛵', '🚌', '🛵', '🚗']} />
      <Spot id="cute-shop" label="Cute Shop" sign={[61, 308]}>
        <Shop x={6} w={110} wall={C.petal} awning={C.peony} goods="🧸" />
      </Spot>
      <Spot id="cinema" label="Cinema" sign={[186, 308]}>
        <Cinema x={124} w={124} />
      </Spot>
      <Tree x={278} s={1.05} />
      <Tree x={326} s={1.25} fill={C.mint} />
      <Bush x={256} base={FRONT} w={36} />
    </>
  )
}

