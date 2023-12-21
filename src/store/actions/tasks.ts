import { storeKey } from 'store/constants/tasks'
import { actionCreatorFactory, thunkCreatorFactory } from 'store/helpers/actions'
import { performClientDiff } from 'lib/tasks/server'
import type { CheckListItem, NewTaskValues, Task, TaskDiff, TasksState } from 'types/tasks'
import type { RecursivePartial } from 'types/common'
import type { RootState } from 'store/types'
import { createLogStorage } from 'lib/syncLog/storages'
import { SyncPayload } from 'lib/syncLog/types'

const createAction = actionCreatorFactory(storeKey)
const createThunk = thunkCreatorFactory(storeKey)

export const setNewTask = createAction<NewTaskValues | null>('SET_NEW_TASK')
export const addTask = createAction<Task>('ADD_TASK')
export const removeTask = createAction<Task['id']>('REMOVE_TASK')
export const updateTask = createAction<RecursivePartial<Task> & Pick<Task, 'id'>>('UPDATE_TASK')
export const updateChecklistItem = createAction<{ taskId: Task['id'], item: CheckListItem }>('UPDATE_CHECKLIST_ITEM')
export const addChecklistItem = createAction<Task['id']>('ADD_CHECKLIST_ITEM')
export const removeChecklistItem = createAction<{ taskId: Task['id'], itemId: CheckListItem['id'] }>('REMOVE_CHECKLIST_ITEM')
export const importTasks = createAction<Task[]>('IMPORT_TASKS')
export const setIsSyncing = createAction<boolean>('SET_IS_SYNCING')
export const initialSyncTasksWithServer = createThunk(
	'INITIAL_SYNC_WITH_SERVER',
	(_, api) => {
		const state = api.getState() as RootState
		return initialSync(state.tasks)
	}
)
export const syncTasksWithServer = createThunk<
	{ diff?: TaskDiff, lastServerUpdate?: Date } | undefined
>(
	'SYNC_WITH_SERVER',
	(_, api) => {
		const state = api.getState() as RootState
		return startSync(state.tasks)
	},
)

async function initialSync(state: TasksState): Promise<{ diff?: TaskDiff, lastServerUpdate?: Date }> {
	const clientDiff: TaskDiff = {
		create: state.tasks,
		update: [],
		delete: [],
	}
	const lastServerUpdate = state.lastServerUpdate ? new Date(state.lastServerUpdate) : undefined

	try {
		const response = await fetch('/api/sync/tasks', {
			method: 'POST',
			next: { revalidate: 360 },
			body: JSON.stringify({
				diff: clientDiff,
				lastServerUpdate: lastServerUpdate || new Date(0)
			}),
			headers: {

			}
		})
		const result: { diff?: TaskDiff, lastServerUpdate?: Date } = await response.json()

		if (result) {
			return result
		}
	} catch (error) {
		console.error('startSync:performServerDiff:error', error)
	}

	return {}
}

async function startSync(state: TasksState): Promise<{ diff?: TaskDiff, lastServerUpdate?: Date }> {
	const lastServerUpdate = state.lastServerUpdate ? new Date(state.lastServerUpdate) : undefined

	const clientDiff: TaskDiff = {
		create: [],
		update: [],
		delete: [],
	}
	let serverDiff: TaskDiff = {
		create: [],
		update: [],
		delete: [],
	}

	const tasksSyncLogger = createLogStorage('tasks')
	const tasksLog = (await Promise.all(
		(await tasksSyncLogger.keys())
			.map(key => tasksSyncLogger.getItem<SyncPayload<Task>>(key))
	)).filter(Boolean) as SyncPayload<Task>[]

	for (const log of tasksLog) {
		if (log.created) {
			clientDiff.create.push(log.created)
		}
		if (log.updated) {
			const updateId = log.updated.id
			const existedUpdate = clientDiff.update.find(task => task.id === updateId)

			if (existedUpdate) {
				Object.assign(existedUpdate, log.updated)
			} else {
				clientDiff.update.push(log.updated)
			}
		}
		if (log.deleted) {
			clientDiff.delete.push(log.deleted)
		}
	}

	let newServerUpdate = lastServerUpdate

	try {
		const result = await performClientDiff(clientDiff, lastServerUpdate || new Date(0))

		if (result) {
			serverDiff = result.diff
			newServerUpdate = result.lastServerUpdate

			await tasksSyncLogger.clear()
		}
	} catch (error) {
		console.error('startSync:performServerDiff:error', error)
	}

	return {
		diff: serverDiff,
		lastServerUpdate: newServerUpdate,
	}
}