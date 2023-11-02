import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { closeDialog, openDialog, switchDialog } from 'store/actions/dialogs'
import type { DialogsState } from 'types/dialogs'

const createReducer = (initialState: DialogsState) => reducerWithInitialState(initialState)
	.case(openDialog, (state, key) => {
		const keys = Object.keys(state)
		const newState = { ...state }

		for (const k of keys) {
			newState[k] = false
		}

		newState[key] = true

		return newState
	})
	.case(closeDialog, (state, key) => ({
		...state,
		[key]: false,
	}))
	.case(switchDialog, (state, key) => {
		const current = state[key]
		const keys = Object.keys(state)
		const newState = { ...state }

		if (current) {
			for (const k of keys) {
				newState[k] = false
			}
		} else {
			for (const k of keys) {
				newState[k] = false
			}
			newState[key] = true
		}

		return newState
	})

export default createReducer
