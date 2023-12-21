import tasksSyncConfig from 'lib/syncLog/tasks'
import { createSyncLogger } from 'lib/syncLog/createSyncLogger'
import type { Task } from 'types/tasks'
import type { UnknownAction } from 'redux'
import { RootState } from 'store/types'

export default function syncLog(action: UnknownAction, state: RootState) {
	const tasksSyncLogger = createSyncLogger<Task>({
		name: 'tasks',
		config: tasksSyncConfig
	})

	tasksSyncLogger.log(action, state)
}