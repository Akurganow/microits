import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Task, TasksState } from 'types/tasks'
import { addTask, removeTask, setTaskField, toggleTask, updateTask } from 'store/actions/tasks'

const createReducer = (initialState: TasksState) => reducerWithInitialState(initialState)
	.case(addTask, (state, task) => ({
		...state,
		tasks: [...state.tasks, { ...task, id: state.tasks.length + 1 as Task['id'] }],
	}))
	.case(removeTask, (state, id) => ({
		...state,
		tasks: state.tasks.filter(task => task.id !== id),
	}))
	.case(updateTask, (state, task) => ({
		...state,
		tasks: state.tasks.map(t => t.id === task.id ? task : t),
	}))
	.case(toggleTask, (state, id) => ({
		...state,
		tasks: state.tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task),
	}))
	.case(setTaskField, (state, { id, field, value }) => ({
		...state,
		tasks: state.tasks.map(task => task.id === id ? { ...task, [field]: value } : task),
	}))
export default createReducer