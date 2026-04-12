import type { Plant } from '../types/plant'

const STORAGE_KEY = 'plant-reminder-mvp:data'
const SCHEMA_VERSION = 1

type StoredPayload = {
  version: number
  plants: Plant[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function coercePlant(raw: unknown): Plant | null {
  if (!isRecord(raw)) return null
  const id = raw.id
  const name = raw.name
  const potSize = raw.potSize
  const wateringIntervalDays = raw.wateringIntervalDays
  const fertilizingIntervalDays = raw.fertilizingIntervalDays
  const lastWateredDate = raw.lastWateredDate
  const lastFertilizedDate = raw.lastFertilizedDate
  const perenualIdRaw = raw.perenualId

  if (typeof id !== 'string' || typeof name !== 'string') return null
  if (typeof potSize !== 'string') return null
  if (typeof wateringIntervalDays !== 'number' || wateringIntervalDays < 1)
    return null
  if (typeof fertilizingIntervalDays !== 'number' || fertilizingIntervalDays < 1)
    return null

  const lw =
    lastWateredDate === null || typeof lastWateredDate === 'string'
      ? lastWateredDate
      : null
  const lf =
    lastFertilizedDate === null || typeof lastFertilizedDate === 'string'
      ? lastFertilizedDate
      : null

  const perenualId =
    typeof perenualIdRaw === 'number' &&
    Number.isFinite(perenualIdRaw) &&
    perenualIdRaw > 0
      ? perenualIdRaw
      : undefined

  const plant: Plant = {
    id,
    name,
    potSize,
    wateringIntervalDays,
    fertilizingIntervalDays,
    lastWateredDate: lw,
    lastFertilizedDate: lf,
  }
  if (perenualId !== undefined) plant.perenualId = perenualId
  return plant
}

export function loadPlants(): Plant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return []
    const version = parsed.version
    const plantsRaw = parsed.plants
    if (version !== SCHEMA_VERSION || !Array.isArray(plantsRaw)) return []
    const plants: Plant[] = []
    for (const p of plantsRaw) {
      const plant = coercePlant(p)
      if (plant) plants.push(plant)
    }
    return plants
  } catch {
    return []
  }
}

export function savePlants(plants: Plant[]): void {
  const payload: StoredPayload = { version: SCHEMA_VERSION, plants }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function newPlantId(): string {
  return crypto.randomUUID()
}
