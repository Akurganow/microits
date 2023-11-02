import { actionCreatorFactory } from 'typescript-fsa'
import { storeKey } from 'store/constants/tasks'
import { Task } from 'types/tasks'

const createAction = actionCreatorFactory(storeKey)

export const addTask = createAction<Task>('ADD_TASK')
export const removeTask = createAction<Task['id']>('REMOVE_TASK')
export const updateTask = createAction<Task>('UPDATE_TASK')
export const toggleTask = createAction<Task['id']>('TOGGLE_TASK')

export const setTaskField = createAction<{ id: Task['id'], field: keyof Task, value: Task[keyof Task] }>('SET_TASK_FIELD')