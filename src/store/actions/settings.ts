import { storeKey } from 'store/constants/settings'
import { actionCreatorFactory } from 'store/helpers/actions'
import { SettingsState } from 'types/settings'
import { RecursivePartial } from 'types/common'

const createAction = actionCreatorFactory(storeKey)

export const setSettings = createAction<RecursivePartial<SettingsState>>('setSettings')
export const setAutoSync = createAction<boolean>('setAutoSync')
export const setOpenAIUserId = createAction('setUserId')