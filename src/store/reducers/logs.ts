import { LogsState } from 'types/logs'
import { createReducer } from '@reduxjs/toolkit'
import { addLog, clearLogs } from 'store/actions/logs'

const logsReducer = (initialState: LogsState) => createReducer(initialState, builder =>
	builder
		.addCase(addLog, (state, action) => {
			state.logs.push(action.payload)
		})
		.addCase(clearLogs, (state, action) => {
			state.logs = state.logs.filter(log => log.createdAt > action.payload)
			state.lastServerUpdate = action.payload
		})
)

export default logsReducer