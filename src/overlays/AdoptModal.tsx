import { useState, type FormEvent } from 'react'
import { ActivityChips } from '../components/Chip.tsx'
import { GoldenPup } from '../components/GoldenPup.tsx'
import { Modal } from '../components/Modal.tsx'
import { PET_BREED, PET_FOOD_BY_ID, PET_NAME_IDEAS, PET_NAME_MAX, PET_STARTER_PANTRY } from '../data/pet.ts'
import { adoptGolden, findAdoptActivity } from '../game/actions.ts'
import { cleanPetName } from '../game/pet.ts'
import { useUi } from '../game/ui.ts'

// Nhận nuôi cún ở Pet Shop: Misu đặt tên rồi bấm Adopt.

/** "5 🥣 + 1 🦴" */
const starterPack = Object.entries(PET_STARTER_PANTRY)
  .map(([id, n]) => `${n} ${PET_FOOD_BY_ID[id]?.emoji ?? ''}`)
  .join(' + ')

function AdoptForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const found = findAdoptActivity()
  const clean = cleanPetName(name)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const outcome = adoptGolden(clean)
    if (outcome.error) setError(outcome.error)
  }

  return (
    <form onSubmit={submit}>
      <GoldenPup mood="happy" className="mx-auto block h-36 w-36" />
      <p className="mt-1 text-[14px] font-bold text-plum-soft">{found?.place.name ?? 'Pet Shop'}</p>
      <h2 id="adopt-title" className="font-display text-[26px] leading-tight font-bold text-balance">
        Name your puppy
      </h2>
      <p className="mt-1.5 text-[15px] leading-snug text-pretty text-plum-soft">
        A fluffy {PET_BREED} is ready to come home with you.
      </p>

      <input
        value={name}
        onChange={(event) => {
          setName(event.target.value)
          setError(null)
        }}
        maxLength={PET_NAME_MAX + 4}
        enterKeyHint="done"
        autoComplete="off"
        autoCapitalize="words"
        aria-label="Puppy name"
        placeholder="Type a name"
        className="mt-4 w-full rounded-full bg-white px-5 py-3 text-center text-[18px] font-bold ring-1 ring-petal placeholder:font-semibold placeholder:text-plum-soft focus:ring-2 focus:ring-peony focus-visible:outline-none"
      />
      <div className="mt-3 flex flex-wrap justify-center gap-1.5" aria-label="Name ideas">
        {PET_NAME_IDEAS.map((idea) => (
          <button
            key={idea}
            type="button"
            onClick={() => {
              setName(idea)
              setError(null)
            }}
            className={`press rounded-full px-3.5 py-1.5 text-[14px] font-bold ${clean === idea ? 'bg-peony' : 'bg-petal'}`}
          >
            {idea}
          </button>
        ))}
      </div>

      {found && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          <ActivityChips activity={found.activity} />
        </div>
      )}
      <p className="mt-2 text-[13px] font-bold text-plum-soft">Comes with a starter pack: {starterPack}</p>
      {error && (
        <p role="status" className="mt-2 text-[14px] font-extrabold text-peony-deep">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!clean}
        className="press mt-5 w-full rounded-full bg-peony py-3.5 text-[17px] font-extrabold disabled:opacity-50"
      >
        {clean ? `Adopt ${clean} 💛` : 'Adopt 💛'}
      </button>
      <button
        type="button"
        onClick={onClose}
        className="press mt-2 w-full rounded-full py-3 text-[15px] font-extrabold text-plum-soft"
      >
        Not yet
      </button>
    </form>
  )
}

export function AdoptModal() {
  const open = useUi((s) => s.adoptOpen)
  const setAdoptOpen = useUi((s) => s.setAdoptOpen)
  if (!open) return null
  const close = () => setAdoptOpen(false)
  return (
    <Modal labelledBy="adopt-title" onClose={close}>
      <AdoptForm onClose={close} />
    </Modal>
  )
}
