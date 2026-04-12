/** ISO 8601 calendar date only: YYYY-MM-DD (local date inputs / storage). */
export type IsoDateString = string

export type Plant = {
  id: string
  /** Set when the plant was added from the Perenual catalog. */
  perenualId?: number
  name: string
  /** Display / filter helper (e.g. cm or label). */
  potSize: string
  /** Days between waterings. */
  wateringIntervalDays: number
  /** Days between fertilizing. */
  fertilizingIntervalDays: number
  /** Last time the plant was watered; null if never. */
  lastWateredDate: IsoDateString | null
  /** Last time the plant was fertilized; null if never. */
  lastFertilizedDate: IsoDateString | null
}
