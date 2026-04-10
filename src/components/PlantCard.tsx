import type { Plant } from '../types/plant'
import { getNextFertilizeDate, getNextWaterDate } from '../lib/schedule'

type Props = {
  plant: Plant
  onEdit: (plant: Plant) => void
  onDelete: (id: string) => void
  onWater: (id: string) => void
  onFertilize: (id: string) => void
}

export function PlantCard({
  plant,
  onEdit,
  onDelete,
  onWater,
  onFertilize,
}: Props) {
  const nextWater = getNextWaterDate(plant)
  const nextFert = getNextFertilizeDate(plant)

  return (
    <article className="plant-card">
      <div className="plant-card-head">
        <h3 className="plant-card-name">{plant.name}</h3>
        <span className="plant-card-pot">{plant.potSize}</span>
      </div>
      <dl className="plant-card-dates">
        <div>
          <dt>Next water</dt>
          <dd>{nextWater}</dd>
        </div>
        <div>
          <dt>Next fertilize</dt>
          <dd>{nextFert}</dd>
        </div>
      </dl>
      <div className="plant-card-actions">
        <button
          type="button"
          className="btn small"
          aria-label={`Mark ${plant.name} as watered today`}
          onClick={() => onWater(plant.id)}
        >
          Watered
        </button>
        <button
          type="button"
          className="btn small"
          aria-label={`Mark ${plant.name} as fertilized today`}
          onClick={() => onFertilize(plant.id)}
        >
          Fertilized
        </button>
        <button
          type="button"
          className="btn small"
          aria-label={`Edit ${plant.name}`}
          onClick={() => onEdit(plant)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn small danger"
          aria-label={`Delete ${plant.name}`}
          onClick={() => onDelete(plant.id)}
        >
          Delete
        </button>
      </div>
    </article>
  )
}
