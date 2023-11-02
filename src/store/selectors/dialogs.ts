import { createSelector } from 'reselect'
import { storeKey } from 'store/constants/dialogs'
import type { RootState } from 'store/types'
import type { DialogsState } from 'types/dialogs'

const rawSelectedDialogs = (state: RootState) => state[storeKey]
export const selectedDialogs = createSelector(
	rawSelectedDialogs,
	(dialogs) => dialogs
)
export const createDialogSelector = createSelector(
	[
		selectedDialogs,
		(_state, key) => key,
	],
	(dialogs, key) => (dialogs[key] || false) as boolean
)
export const selectedDialog = (name: string) =>
	(state: DialogsState) => createDialogSelector(state, name)
