import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Task, TasksState } from 'types/tasks'
import { addTask, removeTask, setTaskField, updateTask } from 'store/actions/tasks'

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
	.case(updateTask, (state, task) => ({
		...state,
		tasks: state.tasks.map(t => t.id === task.id ? task : t),
	}))
	.case(setTaskField, (state, { id, field, value }) => ({
		...state,
		tasks: state.tasks.map(task => task.id === id ? { ...task, [field]: value } : task),
	}))
export default createReducer