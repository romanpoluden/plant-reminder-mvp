import { useCallback, useEffect, useState } from 'react'
import type { Plant } from '../types/plant'
import { todayIso } from '../lib/dates'
import { loadPlants, newPlantId, savePlants } from '../lib/storage'

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>(loadPlants)

  useEffect(() => {
    savePlants(plants)
  }, [plants])

  const addPlant = useCallback((plant: Omit<Plant, 'id'>) => {
    const next: Plant = { ...plant, id: newPlantId() }
    setPlants((p) => [...p, next])
    return next
  }, [])

  const updatePlant = useCallback((plant: Plant) => {
    setPlants((p) => p.map((x) => (x.id === plant.id ? plant : x)))
  }, [])

  const removePlant = useCallback((id: string) => {
    setPlants((p) => p.filter((x) => x.id !== id))
  }, [])

  const markWatered = useCallback((id: string) => {
    const d = todayIso()
    setPlants((p) =>
      p.map((x) => (x.id === id ? { ...x, lastWateredDate: d } : x)),
    )
  }, [])

  const markFertilized = useCallback((id: string) => {
    const d = todayIso()
    setPlants((p) =>
      p.map((x) => (x.id === id ? { ...x, lastFertilizedDate: d } : x)),
    )
  }, [])

  return {
    plants,
    addPlant,
    updatePlant,
    removePlant,
    markWatered,
    markFertilized,
  }
}
