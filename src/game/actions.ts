import { useGame } from './store.ts'
import type { Activity, Place } from './types.ts'
import { useUi } from './ui.ts'

/** Làm hoạt động rồi hiện popup kết quả (place = null là hoạt động ở nhà) */
export function runActivity(place: Place | null, activity: Activity) {
  const outcome = useGame.getState().doActivity(place, activity)
  if (outcome.result) useUi.getState().showResult(outcome.result)
  return outcome
}
