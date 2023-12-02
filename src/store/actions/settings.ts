import { actionCreatorFactory } from 'typescript-fsa'
import { storeKey } from 'store/constants/settings'
import { SettingsState, SettingsKey, SettingsValue } from 'types/settings'

const createAction = actionCreatorFactory(storeKey)

export const setSettings = createAction<SettingsState>('setSettings')
export const setSetting = createAction<{ key: SettingsKey, value: SettingsValue<SettingsKey> }>('setSetting')

export const setOpenAIApiKey = createAction<string>('setApiKey')
export const setOpenAIUserId = createAction('setUserId')