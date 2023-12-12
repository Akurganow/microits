import { TasksState } from 'types/tasks'
import {
	addChecklistItem,
	addTask,
	importTasks,
	removeChecklistItem,
	removeTask, setNewTask,
	updateChecklistItem,
	updateTask
} from 'store/actions/tasks'
import { nanoid } from 'nanoid'
import { createReducer } from '@reduxjs/toolkit'

const tasksReducer = (initialState: TasksState) => createReducer(initialState, builder =>
	builder
		.addCase(setNewTask, (state, action) => {
			state.newTask = action.payload
		})
		.addCase(addTask, (state, action) => {
			const highestCount = state.tasks.reduce((acc, task) => Math.max(acc, task.count), 0)

			state.tasks.push({
				...action.payload,
				id: nanoid(),
				count: highestCount + 1,
			})
		})
		.addCase(removeTask, (state, action) => {
			state.tasks = state.tasks.filter(task => task.id !== action.payload)
		})
		.addCase(updateTask, (state, action) => {
			const task = state.tasks.find(task => task.id === action.payload.id)

			if (task) {
				Object.assign(task, action.payload)
			}
		})
		.addCase(updateChecklistItem, (state, action) => {
			const task = state.tasks.find(task => task.id === action.payload.taskId)

			if (task) {
				task.checkList = (task.checkList || []).map(item => item.id === action.payload.item.id ? action.payload.item : item)
			}
		})
		.addCase(addChecklistItem, (state, action) => {
			const task = state.tasks.find(task => task.id === action.payload)

			if (task) {
				task.checkList = [...(task.checkList || []), {
					id: (task.checkList || []).length,
					title: '',
					completed: false
				}]
			}
		})
		.addCase(removeChecklistItem, (state, action) => {
			const task = state.tasks.find(task => task.id === action.payload.taskId)

			if (task) {
				task.checkList = (task.checkList || []).filter(item => item.id !== action.payload.itemId)
			}
		})
		.addCase(importTasks, (state, action) => {
			state.tasks = [
				...state.tasks.filter(task => !action.payload.find(t => t.id === task.id)),
				...action.payload,
			]
		})
)
export default tasksReducer