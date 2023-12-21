import type { SyncConfig, SyncConfigCreator, SyncPayload } from 'lib/syncLog/types'
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import type { RootState } from 'store/types'

export type BuilderHandler<T extends { id: string }> = (builder: SyncConfigCreator<T>) => SyncConfigCreator<T>

export function createSyncConfig<T extends { id: string }>(builderHandler: BuilderHandler<T>) {
	const config: SyncConfig<T> = {}

	const builder = {
		config,
		case<A extends ActionCreatorWithPayload<unknown, string>>(action: A, payloadCreator: (action: ReturnType<A>, state: RootState) => SyncPayload<T> | SyncPayload<T>[]) {
			const setPayloadCreator = (action: A) => {
				if ('type' in action && typeof action.type === 'string') {
					config[action.type] = payloadCreator
				}
			}

			setPayloadCreator(action)

			return builder
		}
	}

	builderHandler(builder)

	return config
}