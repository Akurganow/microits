import { Action, Middleware } from 'redux'
import { RootState } from 'store/types'
import { Log } from 'types/logs'
import { nanoid } from 'nanoid'
import { addLog } from 'store/actions/logs'

const ignoredActionKeys = [
	'persist',
	'logs',
	'dialogs',
	'tasks/SET_NEW_TASK',
]

function isIgnoredAction(action: Action) {
	return ignoredActionKeys.some(key => action.type.includes(key))
}

function isAction(action: unknown): action is Action {
	return typeof action === 'object' && action !== null && 'type' in action
}

const logsMiddleware: Middleware<object, RootState> = ({ dispatch }) => next => action => {
	if (!isAction(action)) {
		return next(action)
	}

	if (!isIgnoredAction(action)) {
		const log: Log = {
			id: nanoid(),
			createdAt: Date.now(),
			action,
		}

		dispatch<Action>(addLog(log))
	}

	return next(action)
}

export default logsMiddleware
