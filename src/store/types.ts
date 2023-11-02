import { storeKey as dialogsStoreKey } from 'store/constants/dialogs'
import { storeKey as settingsStoreKey } from 'store/constants/settings'
import { storeKey as tasksStoreKey } from './constants/tasks'
import type { CombinedState } from 'redux'
import type { DialogsState } from 'types/dialogs'
import type { SettingsState } from 'types/settings'
import type { TasksState } from 'types/tasks'

interface PersistPartial {
    _persist: { version: number; rehydrated: boolean };
}

export type RootState = CombinedState<{
    [dialogsStoreKey]: DialogsState,
    [settingsStoreKey]: SettingsState & PersistPartial
    [tasksStoreKey]: TasksState & PersistPartial
}>