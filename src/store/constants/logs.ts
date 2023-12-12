import { LogsState } from 'types/logs'

export const storeKey = 'logs'
export const initialState: LogsState = {
	logs: [],
	lastServerUpdate: 0,
}