import { useMemo, useState } from 'react'
import { CalendarExportCard } from './components/CalendarExport'
import { PerenualCatalog } from './components/PerenualCatalog'
import { PlantCard } from './components/PlantCard'
import { PlantForm } from './components/PlantForm'
import { TaskGroups } from './components/TaskGroups'
import { usePlants } from './hooks/usePlants'
import {
  speciesDisplayName,
  type PerenualSpeciesSummary,
} from './lib/perenual'
import { groupTasksByBucket } from './lib/schedule'
import './App.css'

function App() {
  const {
    plants,
    addPlant,
    updatePlant,
    removePlant,
    markWatered,
    markFertilized,
  } = usePlants()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const editingPlant =
    editingId === null ? null : (plants.find((p) => p.id === editingId) ?? null)

  const taskGroups = useMemo(() => groupTasksByBucket(plants), [plants])

  function openCreate() {
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(plant: { id: string }) {
    setEditingId(plant.id)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
  }

  function confirmRemovePlant(id: string) {
    const plant = plants.find((p) => p.id === id)
    if (!plant) return
    const ok = globalThis.confirm(
      `Remove "${plant.name}"? This cannot be undone.`,
    )
    if (ok) removePlant(id)
  }

  function addFromCatalog(s: PerenualSpeciesSummary) {
    if (plants.some((p) => p.perenualId === s.id)) {
      globalThis.alert(
        `${speciesDisplayName(s)} is already in your plants.`,
      )
      return
    }
    addPlant({
      name: speciesDisplayName(s),
      potSize: '—',
      wateringIntervalDays: 7,
      fertilizingIntervalDays: 30,
      lastWateredDate: null,
      lastFertilizedDate: null,
      perenualId: s.id,
    })
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Plant care reminders</h1>
        <p className="app-tagline">
          Track watering and fertilizing — runs locally in your browser.
        </p>
      </header>

      <main className="app-main">
        <section className="region" aria-labelledby="tasks-heading">
          <h2 id="tasks-heading" className="region-title">
            Tasks
          </h2>
          <CalendarExportCard plants={plants} />
          {plants.length === 0 ? (
            <p className="region-placeholder region-placeholder-tight">
              Add a plant to see overdue, due today, and upcoming care tasks — and
              to download calendar reminders above.
            </p>
          ) : (
            <TaskGroups groups={taskGroups} />
          )}
        </section>

        <section className="region" aria-labelledby="catalog-heading">
          <h2 id="catalog-heading" className="region-title">
            Plant catalog
          </h2>
          <p className="region-placeholder region-placeholder-tight">
            Search Perenual’s database and add a plant to your list with default
            care intervals (you can edit it afterward).
          </p>
          <PerenualCatalog onAdd={addFromCatalog} />
        </section>

        <section className="region" aria-labelledby="plants-heading">
          <div className="region-toolbar">
            <h2 id="plants-heading" className="region-title inline">
              Plants
            </h2>
            {!showForm ? (
              <button type="button" className="btn primary" onClick={openCreate}>
                Add plant
              </button>
            ) : null}
          </div>

          {showForm ? (
            <PlantForm
              key={editingPlant?.id ?? 'new'}
              initial={editingPlant}
              onSave={(data, existingId) => {
                if (existingId) {
                  const prev = plants.find((p) => p.id === existingId)
                  updatePlant({
                    ...data,
                    id: existingId,
                    ...(prev?.perenualId != null
                      ? { perenualId: prev.perenualId }
                      : {}),
                  })
                } else addPlant(data)
                closeForm()
              }}
              onCancel={closeForm}
            />
          ) : plants.length === 0 ? (
            <p className="region-placeholder">
              No plants yet. Add one to get started.
            </p>
          ) : (
            <ul className="plant-list">
              {plants.map((p) => (
                <li key={p.id}>
                  <PlantCard
                    plant={p}
                    onEdit={openEdit}
                    onDelete={confirmRemovePlant}
                    onWater={markWatered}
                    onFertilize={markFertilized}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
