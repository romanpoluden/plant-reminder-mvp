import type { Plant } from '../types/plant'
import { buildPlantRemindersIcs, downloadTextFile } from '../lib/exportIcs'

type Props = {
  plants: Plant[]
}

export function ExportButton({ plants }: Props) {
  const disabled = plants.length === 0

  function handleClick() {
    const ics = buildPlantRemindersIcs(plants)
    if (!ics) return
    downloadTextFile('plant-care-reminders.ics', ics)
  }

  return (
    <button
      type="button"
      className="btn"
      disabled={disabled}
      title={
        disabled
          ? 'Add at least one plant to export reminders'
          : 'Download next water and fertilize dates as .ics'
      }
      onClick={handleClick}
    >
      Export .ics
    </button>
  )
}
