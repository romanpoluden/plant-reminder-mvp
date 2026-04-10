import { createEvents, type EventAttributes } from 'ics'
import type { IsoDateString, Plant } from '../types/plant'
import { getNextFertilizeDate, getNextWaterDate } from './schedule'

/** ICS date-time in local wall time (single reminder slot). */
function isoToLocalStart(
  iso: IsoDateString,
): [number, number, number, number, number] {
  const [y, m, d] = iso.split('-').map(Number)
  return [y, m, d, 9, 0]
}

export function buildPlantRemindersIcs(
  plants: Plant[],
  reference: Date = new Date(),
): string | null {
  if (plants.length === 0) return null

  const events: EventAttributes[] = []

  for (const plant of plants) {
    const waterDate = getNextWaterDate(plant, reference)
    const fertDate = getNextFertilizeDate(plant, reference)

    events.push({
      title: `Water — ${plant.name}`,
      description: `Plant care reminder (water). Pot: ${plant.potSize}.`,
      start: isoToLocalStart(waterDate),
      startInputType: 'local',
      duration: { minutes: 30 },
      status: 'CONFIRMED',
      busyStatus: 'FREE',
      transp: 'TRANSPARENT',
      uid: `plant-${plant.id}-water-${waterDate}@plant-reminder-mvp`,
    })

    events.push({
      title: `Fertilize — ${plant.name}`,
      description: `Plant care reminder (fertilizer). Pot: ${plant.potSize}.`,
      start: isoToLocalStart(fertDate),
      startInputType: 'local',
      duration: { minutes: 30 },
      status: 'CONFIRMED',
      busyStatus: 'FREE',
      transp: 'TRANSPARENT',
      uid: `plant-${plant.id}-fertilize-${fertDate}@plant-reminder-mvp`,
    })
  }

  const { error, value } = createEvents(events, {
    calName: 'Plant care reminders',
  })

  if (error) {
    console.error(error)
    return null
  }

  return value
}

export function downloadTextFile(filename: string, contents: string): void {
  const blob = new Blob([contents], {
    type: 'text/calendar;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
