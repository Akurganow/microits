import { SettingsState } from 'types/settings'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { setSetting, setSettings } from 'store/actions/settings'

const createReducer = (initialState: SettingsState) => reducerWithInitialState(initialState)
	.case(setSetting, (state, { key, value }) => ({
		...state,
		[key]: value,
	}))
	.case(setSettings, (state, settings) => ({
		...state,
		...settings,
	}))

export default createReducer