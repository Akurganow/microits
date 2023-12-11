import { MigrationManifest } from 'redux-persist'
import { TasksState } from 'types/tasks'
import { nanoid } from 'nanoid'
import { PersistPartial } from 'store/types'

const tasks: MigrationManifest = {
	1: (state: TasksState & PersistPartial) => ({
		...state,
		tasks: state.tasks.map(task => ({
			...task,
			count: parseInt(task.id),
			id: nanoid(),
		}))
	})
}

export default tasks