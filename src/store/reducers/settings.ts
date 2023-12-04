import { SettingsState } from 'types/settings'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { setOpenAIApiKey, setOpenAIUserId, setSetting, setSettings } from 'store/actions/settings'
import { nanoid } from 'nanoid'

const createReducer = (initialState: SettingsState) => reducerWithInitialState(initialState)
	.case(setSetting, (state, { key, value }) => ({
		...state,
		[key]: value,
	}))
	.case(setSettings, (state, settings) => {
		const newState = { ...state }

		for (const key in settings) {
			newState[key] = settings[key]
		}

		return newState
	})
	.case(setOpenAIApiKey, (state, apiKey) => ({
		...state,
		openAI: {
			...state.openAI,
			apiKey,
		},
	}))
	.case(setOpenAIUserId, (state) => ({
		...state,
		openAI: {
			...state.openAI,
			userId: nanoid(),
		},
	}))

export default createReducer