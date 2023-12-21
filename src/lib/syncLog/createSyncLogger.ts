import { createLogStorage } from 'lib/syncLog/storages'
import type { UnknownAction } from 'redux'
import type { SyncLog, SyncLogCreatorConfig, SyncPayload } from 'lib/syncLog/types'
import type { RootState } from 'store/types'

export function createSyncLogger<T extends { id: string }>({ name, config }: SyncLogCreatorConfig<T>): SyncLog<T> {
	const logger: LocalForage = createLogStorage(name)

	const syncLog = (action: UnknownAction, state: RootState) => {
		// console.debug(`syncLog:${name}`, action)
		// console.debug(`syncLog:${name}:isActionHandled`, isActionHandled(action))
		if (!isActionHandled(action)) {
			return
		}

		const logPayloadCreator = config[action.type]
		// console.debug(`syncLog:${name}:logPayloadCreator`, logPayloadCreator)

		if (logPayloadCreator) {
			const logPayload = logPayloadCreator(action, state)
			const timestamp = Date.now().toString()
			// console.debug(`syncLog:${name}:logPayload`, logPayload)

			if (Array.isArray(logPayload)) {
				logPayload.forEach((payload, index) => {
					logger.setItem(`${timestamp}:${index}`, payload)
				})
			} else {
				logger.setItem(timestamp, logPayload)
			}
		}
	}

	const isActionHandled = (action: UnknownAction) => {
		// console.debug(`syncLog:${name}:isActionHandled`, action)
		if (!action || !action.type) return false
		// console.debug(`syncLog:${name}:config`, config)
		// console.debug(`syncLog:${name}:config[${action.type}]`, config[action.type])

		const logPayloadCreator = config[action.type]

		return !!logPayloadCreator
	}

	const getLog = async (): Promise<SyncPayload<T>[]> => {
		const keys = await logger.keys()

		return (
			await Promise.all(
				keys.map(key =>
					logger.getItem<SyncPayload<T>>(key)
				)
			)
		).filter(Boolean) as SyncPayload<T>[]
	}

	return {
		log: syncLog,
		isActionHandled,
		getLog,
	}
}