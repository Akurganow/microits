import { storeKey } from 'store/constants/dialogs'
import { actionCreatorFactory } from 'store/helpers/actions'

const createAction = actionCreatorFactory(storeKey)
export const openDialog = createAction<string>('openDialog')
export const closeDialog = createAction<string>('closeDialog')
export const switchDialog = createAction<string>('switchDialog')
