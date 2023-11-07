import type { CombinedState } from 'redux'
import { storeKey as dialogsStoreKey } from 'store/constants/dialogs'
import { storeKey as settingsStoreKey } from 'store/constants/settings'
import { storeKey as tasksStoreKey } from 'store/constants/tasks'
import { storeKey as tagsStoreKey } from 'store/constants/tags'
import type { DialogsState } from 'types/dialogs'
import type { SettingsState } from 'types/settings'
import type { TasksState } from 'types/tasks'
import type { TagsState } from 'types/tags'

export interface PersistPartial {
    _persist: { version: number; rehydrated: boolean };
}

export type RootState = CombinedState<{
    [dialogsStoreKey]: DialogsState,
    [settingsStoreKey]: SettingsState & PersistPartial
    [tagsStoreKey]: TagsState & PersistPartial
    [tasksStoreKey]: TasksState & PersistPartial
}>