'use client'
import syncLog from 'lib/syncLog'
import { Dispatch, isAction, Middleware, UnknownAction } from 'redux'
import type { RootState } from 'store/types'

const ignoredActionParts = [
	'persist',
	'dialogs',
]

function getIsActionIgnored(action: UnknownAction) {
	return !isAction(action) || ignoredActionParts.some(ignoredAction =>
		action.type.includes(ignoredAction)
	)
}

const logMiddleware =
	((storeApi) => (next: Dispatch) => (action: UnknownAction) => {
		const isActionIgnored = getIsActionIgnored(action)

		if (!isActionIgnored) {
			const state = storeApi.getState() as RootState
			syncLog(action, state)
		}

		return next(action)
	}) as Middleware<NonNullable<unknown>, RootState>

export default logMiddleware