import { useState, type FormEvent } from 'react'
import type { Plant } from '../types/plant'

type Props = {
  initial: Plant | null
  onSave: (data: Omit<Plant, 'id'>, existingId?: string) => void
  onCancel: () => void
}

function defaultsFor(initial: Plant | null) {
  if (!initial) {
    return {
      name: '',
      potSize: '',
      wateringIntervalDays: '7',
      fertilizingIntervalDays: '30',
      lastWateredDate: '',
      lastFertilizedDate: '',
    }
  }
  return {
    name: initial.name,
    potSize: initial.potSize,
    wateringIntervalDays: String(initial.wateringIntervalDays),
    fertilizingIntervalDays: String(initial.fertilizingIntervalDays),
    lastWateredDate: initial.lastWateredDate ?? '',
    lastFertilizedDate: initial.lastFertilizedDate ?? '',
  }
}

export function PlantForm({ initial, onSave, onCancel }: Props) {
  const d = defaultsFor(initial)
  const [name, setName] = useState(d.name)
  const [potSize, setPotSize] = useState(d.potSize)
  const [wateringIntervalDays, setWateringIntervalDays] = useState(
    d.wateringIntervalDays,
  )
  const [fertilizingIntervalDays, setFertilizingIntervalDays] = useState(
    d.fertilizingIntervalDays,
  )
  const [lastWateredDate, setLastWateredDate] = useState(d.lastWateredDate)
  const [lastFertilizedDate, setLastFertilizedDate] = useState(
    d.lastFertilizedDate,
  )
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const w = Number.parseInt(wateringIntervalDays, 10)
    const f = Number.parseInt(fertilizingIntervalDays, 10)
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    if (!Number.isFinite(w) || w < 1) {
      setError('Watering interval must be at least 1 day.')
      return
    }
    if (!Number.isFinite(f) || f < 1) {
      setError('Fertilizing interval must be at least 1 day.')
      return
    }
    setError(null)
    const payload: Omit<Plant, 'id'> = {
      name: name.trim(),
      potSize: potSize.trim() || '—',
      wateringIntervalDays: w,
      fertilizingIntervalDays: f,
      lastWateredDate: lastWateredDate || null,
      lastFertilizedDate: lastFertilizedDate || null,
    }
    onSave(payload, initial?.id)
  }

  return (
    <form className="plant-form" onSubmit={handleSubmit}>
      <div className="field-grid">
        <label className="field">
          <span className="field-label">Name</span>
          <input
            className="field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            required
          />
        </label>
        <label className="field">
          <span className="field-label">Pot size</span>
          <input
            className="field-input"
            value={potSize}
            onChange={(e) => setPotSize(e.target.value)}
            placeholder="e.g. 18 cm"
            autoComplete="off"
          />
        </label>
        <label className="field">
          <span className="field-label">Water every (days)</span>
          <input
            className="field-input"
            type="number"
            min={1}
            inputMode="numeric"
            value={wateringIntervalDays}
            onChange={(e) => setWateringIntervalDays(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">Fertilize every (days)</span>
          <input
            className="field-input"
            type="number"
            min={1}
            inputMode="numeric"
            value={fertilizingIntervalDays}
            onChange={(e) => setFertilizingIntervalDays(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">Last watered</span>
          <input
            className="field-input"
            type="date"
            value={lastWateredDate}
            onChange={(e) => setLastWateredDate(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">Last fertilized</span>
          <input
            className="field-input"
            type="date"
            value={lastFertilizedDate}
            onChange={(e) => setLastFertilizedDate(e.target.value)}
          />
        </label>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="form-actions">
        <button type="submit" className="btn primary">
          {initial ? 'Save' : 'Add plant'}
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
