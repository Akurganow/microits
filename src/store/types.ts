import { storeKey as dialogsStoreKey } from 'store/constants/dialogs'
import { storeKey as settingsStoreKey } from 'store/constants/settings'
import { storeKey as tasksStoreKey } from 'store/constants/tasks'
import { storeKey as tagsStoreKey } from 'store/constants/tags'
import { storeKey as logsStoreKey } from 'store/constants/logs'
import type { DialogsState } from 'types/dialogs'
import type { SettingsState } from 'types/settings'
import type { TasksState } from 'types/tasks'
import type { TagsState } from 'types/tags'
import type { LogsState } from 'types/logs'

export interface PersistPartial {
    _persist: { version: number; rehydrated: boolean };
}

export type RootState = {
    [dialogsStoreKey]: DialogsState,
    [logsStoreKey]: LogsState & PersistPartial
    [settingsStoreKey]: SettingsState & PersistPartial
    [tagsStoreKey]: TagsState & PersistPartial
    [tasksStoreKey]: TasksState & PersistPartial
}