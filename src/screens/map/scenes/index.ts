import type { ComponentType } from 'react'
import type { DistrictId } from '../../../game/types.ts'
import { District1, District2, District3, District5, District7, District9, PhuNhuan } from './scenes.tsx'

/** Cảnh vẽ của từng quận (xem scenes.tsx) */
export const SCENES: Record<DistrictId, ComponentType> = {
  d1: District1,
  d2: District2,
  d3: District3,
  d5: District5,
  d7: District7,
  d9: District9,
  pn: PhuNhuan,
}
