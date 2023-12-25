import { MigrationManifest } from 'redux-persist'
import { TasksState } from 'types/tasks'
import { nanoid } from 'nanoid'
import { PersistPartial } from 'store/types'

const tasks: MigrationManifest = {
	1: (state: PersistPartial<TasksState>) => ({
		...state,
		tasks: state.items.map(task => ({
			...task,
			count: parseInt(task.id),
			id: nanoid(),
		}))
	}),
	2: (state: PersistPartial<TasksState>) => ({
		...state,
		tasks: state.items.map(task => ({
			...task,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			checklist: task.checkList
		}))
	}),
	3: (state: PersistPartial<TasksState>) => ({
		...state,
		tasks: state.items.map(task => ({
			...task,
			checkList: undefined
		}))
	}),
}

export const tasksVersion = 3

export default tasks