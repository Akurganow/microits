import { TasksState } from 'types/tasks'
import {
	addChecklistItem,
	addTask,
	importTasks,
	removeChecklistItem,
	removeTask, setIsSyncing, setNewTask, syncTasksWithServer,
	updateChecklistItem,
	updateTask
} from 'store/actions/tasks'
import { createReducer } from '@reduxjs/toolkit'
import { isEmpty } from '@plq/is'

const tasksReducer = (initialState: TasksState) => createReducer(initialState, builder =>
	builder
		.addCase(setNewTask, (state, action) => {
			state.newTask = action.payload
		})
		.addCase(addTask, (state, action) => {
			const highestCount = state.tasks.reduce((acc, task) => Math.max(acc, task.count), 0)

			state.tasks.push({
				...action.payload,
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
				task.checklist = (task.checklist || []).map(item => item.id === action.payload.item.id ? action.payload.item : item)
			}
		})
		.addCase(addChecklistItem, (state, action) => {
			const task = state.tasks.find(task => task.id === action.payload)

			if (task) {
				task.checklist = [...(task.checklist || []), {
					id: (task.checklist || []).length,
					title: '',
					completed: false
				}]
			}
		})
		.addCase(removeChecklistItem, (state, action) => {
			const task = state.tasks.find(task => task.id === action.payload.taskId)

			if (task) {
				task.checklist = (task.checklist || []).filter(item => item.id !== action.payload.itemId)
			}
		})
		.addCase(importTasks, (state, action) => {
			state.tasks = [
				...state.tasks.filter(task => !action.payload.find(t => t.id === task.id)),
				...action.payload,
			]
		})
		.addCase(setIsSyncing, (state, action) => {
			state.isSyncing = action.payload
		})
		.addCase(syncTasksWithServer.pending, (state) => {
			state.isSyncing = true
		})
		.addCase(syncTasksWithServer.rejected, (state) => {
			state.isSyncing = false
		})
		.addCase(syncTasksWithServer.fulfilled, (state, { payload }) => {
			console.log('syncWithServer.fulfilled:start')
			if (!payload || isEmpty(payload)) return
			// console.debug('syncWithServer.fulfilled:payload', payload)
			const { diff, lastServerUpdate } = payload

			// console.debug('syncWithServer.fulfilled:diff.create', diff?.create && diff.create.length > 0, diff?.create)
			if (diff && diff.create.length > 0) {
				const tasksMap = new Map(state.tasks.map(task => [task.id, task]))

				for (const task of diff.create) {
					tasksMap.set(task.id, task)
				}

				state.tasks = Array.from(tasksMap.values())
				// console.debug('syncWithServer.fulfilled:diff.create:state.tasks', state.tasks)
			}

			for (const task of (diff?.update || [])) {
				state.tasks.map(t => t.id === task.id ? { ...t, ...task } : t)
			}

			if (diff && diff.delete.length > 0) {
				// console.debug('syncWithServer.fulfilled:diff.delete', diff.delete)
				// console.debug(
				// 	'syncWithServer.fulfilled:diff.delete:removedTasks',
				// 	state.tasks
				// 		.filter(task => diff.delete.includes(task.id))
				// 		.map(({ id, title }) => ({ id, title }))
				// )
				state.tasks = state.tasks.filter(task => !diff.delete.includes(task.id))
			}

			state.lastServerUpdate = lastServerUpdate?.toString()
			state.isSyncing = false
		})

)
export default tasksReducer