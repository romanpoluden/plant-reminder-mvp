import type { Plant } from '../types/plant'
import { buildPlantRemindersIcs, downloadTextFile } from '../lib/exportIcs'

type Props = {
  plants: Plant[]
}

/**
 * Exports next water/fertilize dates as an .ics file for calendar apps.
 * This is not the same as phone or browser push notifications.
 */
export function CalendarExportCard({ plants }: Props) {
  const disabled = plants.length === 0

  function handleClick() {
    const ics = buildPlantRemindersIcs(plants)
    if (!ics) {
      globalThis.alert('Could not create the calendar file. Please try again.')
      return
    }
    downloadTextFile('plant-care-reminders.ics', ics)
  }

  return (
    <div className="calendar-export">
      <h3 className="calendar-export-title">Reminders in your calendar</h3>
      <p className="calendar-export-body">
        This app does not send push notifications. Use the button below to download
        an <strong>.ics</strong> file, then open or import it in Apple Calendar,
        Google Calendar, Outlook, or another app that supports iCalendar.
      </p>
      <button
        type="button"
        className="btn primary calendar-export-btn"
        disabled={disabled}
        title={
          disabled
            ? 'Add at least one plant first'
            : 'Saves plant-care-reminders.ics to your device'
        }
        onClick={handleClick}
      >
        Download calendar file (.ics)
      </button>
      {disabled ? (
        <p className="calendar-export-note">Add a plant to enable download.</p>
      ) : (
        <p className="calendar-export-note">
          Includes the next water and next fertilize date for each plant. Export
          again after you water or fertilize to refresh.
        </p>
      )}
    </div>
  )
}
