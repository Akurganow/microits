import { storeKey } from 'store/constants/logs'
import { actionCreatorFactory, thunkCreatorFactory } from 'store/helpers/actions'
import { Log } from 'types/logs'

const createAction = actionCreatorFactory(storeKey)
const createThunk = thunkCreatorFactory(storeKey)

export const addLog = createAction<Log>('addLog')
export const clearLogs = createAction<Log['createdAt']>('clearLogs')

export const fetchLogs = createThunk<Log[]>('fetchLogs', async () => {
	const response = await fetch('/api/logs')
	const logs = await response.json()

	return logs
})