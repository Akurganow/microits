import { actionCreatorFactory } from 'typescript-fsa'
import { storeKey } from 'store/constants/settings'
import { SettingsState, SettingsKey, SettingsValue } from 'types/settings'
import { RecursivePartial } from 'types/common'

const createAction = actionCreatorFactory(storeKey)

export const setSettings = createAction<RecursivePartial<SettingsState>>('setSettings')
export const setSetting = createAction<{ key: SettingsKey, value: SettingsValue<SettingsKey> }>('setSetting')

export const setOpenAIApiKey = createAction<string>('setApiKey')
export const setOpenAIUserId = createAction('setUserId')