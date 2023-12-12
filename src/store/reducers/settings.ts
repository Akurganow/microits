import { SettingsState } from 'types/settings'
import { setOpenAIUserId, setSettings } from 'store/actions/settings'
import { nanoid } from 'nanoid'
import { createReducer } from '@reduxjs/toolkit'

const settingsReducer = (initialState: SettingsState) => createReducer(initialState, builder =>
	builder
		.addCase(setSettings, (state, action) => {
			Object.assign(state, action.payload)
		})
		.addCase(setOpenAIUserId, state => {
			state.openAI.userId = nanoid()
		})
)

export default settingsReducer