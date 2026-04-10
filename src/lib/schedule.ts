import type { IsoDateString, Plant } from '../types/plant'
import { addCalendarDays, compareIsoDates, todayIso } from './dates'

export type TaskKind = 'water' | 'fertilize'

export type TaskBucket = 'overdue' | 'dueToday' | 'upcoming'

export type PlantTask = {
  plantId: string
  plantName: string
  kind: TaskKind
  nextDueDate: IsoDateString
}

/** If never done, treat as due today so the task surfaces immediately. */
export function getNextWaterDate(
  plant: Plant,
  reference: Date = new Date(),
): IsoDateString {
  const t = todayIso(reference)
  if (!plant.lastWateredDate) return t
  return addCalendarDays(plant.lastWateredDate, plant.wateringIntervalDays)
}

export function getNextFertilizeDate(
  plant: Plant,
  reference: Date = new Date(),
): IsoDateString {
  const t = todayIso(reference)
  if (!plant.lastFertilizedDate) return t
  return addCalendarDays(
    plant.lastFertilizedDate,
    plant.fertilizingIntervalDays,
  )
}

function bucketForDueDate(
  nextDue: IsoDateString,
  today: IsoDateString,
): TaskBucket {
  const c = compareIsoDates(nextDue, today)
  if (c < 0) return 'overdue'
  if (c === 0) return 'dueToday'
  return 'upcoming'
}

export type TaskGroups = Record<TaskBucket, PlantTask[]>

export function groupTasksByBucket(
  plants: Plant[],
  reference: Date = new Date(),
): TaskGroups {
  const t = todayIso(reference)
  const overdue: PlantTask[] = []
  const dueToday: PlantTask[] = []
  const upcoming: PlantTask[] = []

  for (const plant of plants) {
    const waterDue = getNextWaterDate(plant, reference)
    const waterTask: PlantTask = {
      plantId: plant.id,
      plantName: plant.name,
      kind: 'water',
      nextDueDate: waterDue,
    }
    switch (bucketForDueDate(waterDue, t)) {
      case 'overdue':
        overdue.push(waterTask)
        break
      case 'dueToday':
        dueToday.push(waterTask)
        break
      case 'upcoming':
        upcoming.push(waterTask)
        break
    }

    const fertDue = getNextFertilizeDate(plant, reference)
    const fertTask: PlantTask = {
      plantId: plant.id,
      plantName: plant.name,
      kind: 'fertilize',
      nextDueDate: fertDue,
    }
    switch (bucketForDueDate(fertDue, t)) {
      case 'overdue':
        overdue.push(fertTask)
        break
      case 'dueToday':
        dueToday.push(fertTask)
        break
      case 'upcoming':
        upcoming.push(fertTask)
        break
    }
  }

  const byDue = (a: PlantTask, b: PlantTask) =>
    compareIsoDates(a.nextDueDate, b.nextDueDate)
  overdue.sort(byDue)
  dueToday.sort(byDue)
  upcoming.sort(byDue)

  return { overdue, dueToday, upcoming }
}
