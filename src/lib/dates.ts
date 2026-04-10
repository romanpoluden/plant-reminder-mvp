import type { IsoDateString } from '../types/plant'

/** Calendar date in the user's local timezone (no UTC shift for YYYY-MM-DD). */
export function parseIsoDateLocal(iso: IsoDateString): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatLocalDate(d: Date): IsoDateString {
  const y = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${month}-${day}`
}

export function todayIso(reference: Date = new Date()): IsoDateString {
  return formatLocalDate(
    new Date(reference.getFullYear(), reference.getMonth(), reference.getDate()),
  )
}

export function addCalendarDays(iso: IsoDateString, days: number): IsoDateString {
  const d = parseIsoDateLocal(iso)
  d.setDate(d.getDate() + days)
  return formatLocalDate(d)
}

/** Negative if a is before b, zero if the same day, positive if a is after b. */
export function compareIsoDates(a: IsoDateString, b: IsoDateString): number {
  if (a === b) return 0
  return a < b ? -1 : 1
}
