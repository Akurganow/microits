import { storeKey } from 'store/constants/tasks'
import { CheckListItem, NewTaskValues, Task } from 'types/tasks'
import { actionCreatorFactory } from 'store/helpers/actions'
import { RecursivePartial } from 'types/common'

const createAction = actionCreatorFactory(storeKey)

export const setNewTask = createAction<NewTaskValues | null>('SET_NEW_TASK')
export const addTask = createAction<Task>('ADD_TASK')
export const removeTask = createAction<Task['id']>('REMOVE_TASK')
export const updateTask = createAction<RecursivePartial<Task>>('UPDATE_TASK')
export const updateChecklistItem = createAction<{ taskId: Task['id'], item: CheckListItem }>('UPDATE_CHECKLIST_ITEM')
export const addChecklistItem = createAction<Task['id']>('ADD_CHECKLIST_ITEM')
export const removeChecklistItem = createAction<{ taskId: Task['id'], itemId: CheckListItem['id'] }>('REMOVE_CHECKLIST_ITEM')
export const importTasks = createAction<Task[]>('IMPORT_TASKS')