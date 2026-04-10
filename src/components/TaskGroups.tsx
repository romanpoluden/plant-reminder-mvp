import type { PlantTask, TaskGroups as TaskGroupsModel } from '../lib/schedule'

function kindLabel(kind: PlantTask['kind']): string {
  return kind === 'water' ? 'Water' : 'Fertilize'
}

function TaskList({
  title,
  tasks,
  empty,
}: {
  title: string
  tasks: PlantTask[]
  empty: string
}) {
  return (
    <div className="task-list">
      <h3 className="task-list-title">{title}</h3>
      {tasks.length === 0 ? (
        <p className="task-list-empty">{empty}</p>
      ) : (
        <ul className="task-list-items">
          {tasks.map((t) => (
            <li key={`${t.plantId}-${t.kind}`} className="task-list-item">
              <span className="task-kind">{kindLabel(t.kind)}</span>
              <span className="task-plant">{t.plantName}</span>
              <span className="task-due">{t.nextDueDate}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

type Props = { groups: TaskGroupsModel }

export function TaskGroups({ groups }: Props) {
  return (
    <div className="task-groups">
      <TaskList
        title="Overdue"
        tasks={groups.overdue}
        empty="Nothing overdue."
      />
      <TaskList
        title="Due today"
        tasks={groups.dueToday}
        empty="Nothing due today."
      />
      <TaskList
        title="Upcoming"
        tasks={groups.upcoming}
        empty="No upcoming tasks."
      />
    </div>
  )
}
