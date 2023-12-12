import { createReducer } from '@reduxjs/toolkit'
import { closeDialog, openDialog, switchDialog } from 'store/actions/dialogs'
import type { DialogsState } from 'types/dialogs'

const dialogsReducer = (initialState: DialogsState) => createReducer(initialState, builder =>
	builder
		.addCase(openDialog, (state, action) => {
			const keys = Object.keys(state)

			for (const k of keys) {
				state[k] = false
			}

			state[action.payload] = true
		})
		.addCase(closeDialog, (state, action) => {
			state[action.payload] = false
		})
		.addCase(switchDialog, (state, action) => {
			const keys = Object.keys(state)
			const current = state[action.payload]

			for (const k of keys) {
				state[k] = false
			}

			state[action.payload] = !current
		})
)

export default dialogsReducer
