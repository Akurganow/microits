import tasksSyncConfig from 'lib/syncLog/tasks'
import tagsSyncConfig from 'lib/syncLog/tags'
import { createSyncLogger } from 'lib/syncLog/createSyncLogger'
import type { Task } from 'types/tasks'
import type { UnknownAction } from 'redux'
import type{ RootState } from 'store/types'
import type { Tag } from 'types/tags'

export default function syncLog(action: UnknownAction, state: RootState) {
	const tasksSyncLogger = createSyncLogger<Task>({
		name: 'tasks',
		config: tasksSyncConfig
	})
	const tagsSyncLogger = createSyncLogger<Tag>({
		name: 'tags',
		config: tagsSyncConfig
	})

	tasksSyncLogger.log(action, state)
	tagsSyncLogger.log(action, state)
}