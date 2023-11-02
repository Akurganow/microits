import { actionCreatorFactory } from 'typescript-fsa'
import { storeKey } from 'store/constants/dialogs'

const createAction = actionCreatorFactory(storeKey)
export const openDialog = createAction<string>('openDialog')
export const closeDialog = createAction<string>('closeDialog')
export const switchDialog = createAction<string>('switchDialog')
