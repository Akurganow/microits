import { actionCreatorFactory } from 'typescript-fsa'
import { storeKey } from 'store/constants/tasks'
import { CheckListItem, Task } from 'types/tasks'

const createAction = actionCreatorFactory(storeKey)

export const addTask = createAction<Task>('ADD_TASK')
export const removeTask = createAction<Task['id']>('REMOVE_TASK')
export const updateTask = createAction<Task>('UPDATE_TASK')
export const toggleTask = createAction<Task['id']>('TOGGLE_TASK')

export const setTaskField = createAction<{ id: Task['id'], field: keyof Task, value: Task[keyof Task] }>('SET_TASK_FIELD')

export const updateChecklistItem = createAction<{ taskId: Task['id'], item: CheckListItem }>('UPDATE_CHECKLIST_ITEM')

export const addChecklistItem = createAction<Task['id']>('ADD_CHECKLIST_ITEM')

export const removeChecklistItem = createAction<{ taskId: Task['id'], itemId: CheckListItem['id'] }>('REMOVE_CHECKLIST_ITEM')