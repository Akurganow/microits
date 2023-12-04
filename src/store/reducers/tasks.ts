import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Task, TasksState } from 'types/tasks'
import {
	addChecklistItem,
	addTask,
	importTasks,
	removeChecklistItem,
	removeTask,
	setTaskField,
	updateChecklistItem,
	updateTask
} from 'store/actions/tasks'

const createReducer = (initialState: TasksState) => reducerWithInitialState(initialState)
	.case(addTask, (state, task) => {
		const highestId = state.tasks.reduce((acc, task) => Math.max(acc, task.id), 0)

		return {
			...state,
			tasks: [...state.tasks, { ...task, id: highestId + 1 as Task['id'] }],
		}
	})
	.case(removeTask, (state, id) => ({
		...state,
		tasks: state.tasks.filter(task => task.id !== id),
	}))
	.case(updateTask, (state, task) => {
		return {
			...state,
			tasks: state.tasks.map(t => t.id === task.id ? task : t),
		}
	})
	.case(setTaskField, (state, { id, field, value }) => ({
		...state,
		tasks: state.tasks.map(task => task.id === id ? { ...task, [field]: value } : task),
	}))
	.case(updateChecklistItem, (state, { taskId, item }) => ({
		...state,
		tasks: state.tasks.map(task => task.id === taskId
			? {
				...task,
				checkList: (task.checkList || []).map(i => i.id === item.id ? item : i) }
			: task
		),
	}))
	.case(addChecklistItem, (state, taskId) => ({
		...state,
		tasks: state.tasks.map(task => task.id === taskId
			? {
				...task,
				checkList: [...(task.checkList || []), {
					id: (task.checkList || []).length,
					title: '',
					completed: false
				}],
			}
			: task
		),
	}))
	.case(removeChecklistItem, (state, { taskId, itemId }) => ({
		...state,
		tasks: state.tasks.map(task => task.id === taskId
			? {
				...task,
				checkList: (task.checkList || []).filter(item => item.id !== itemId),
			}
			: task
		),
	}))
	.case(importTasks, (state, tasks) => ({
		...state,
		tasks: [
			...state.tasks,
			...tasks.filter(task => !state.tasks.find(t => t.id === task.id)),
		],
	}))
export default createReducer