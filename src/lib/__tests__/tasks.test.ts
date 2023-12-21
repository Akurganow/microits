import { getTaskDiff } from 'lib/tasks/client'
import { Task, TaskPriority, TaskStatus } from 'types/tasks'

const DEFAULT_TASK: Task = {
	id: '1',
	count: 1,
	title: 'Title',
	description: 'Description',
	date: '2020-01-01',
	dueDate: '2020-01-02',
	priority: TaskPriority.Low,
	status: TaskStatus.InProgress,
	estimate: 1,
	timeSpent: 0,
	checklist: [],
	tags: [],
	createdAt: '2020-01-01',
	updatedAt: '2021-01-01',
	userId: '1',
}

describe('getTasksDiff', () => {
	test('should return the diff between two tasks and id', () => {
		const newTasks: Task = {
			...DEFAULT_TASK,
			title: 'New title',
			estimate: 2,
		}
		const oldTasks: Task = { ...DEFAULT_TASK }
		const diff = getTaskDiff(oldTasks, newTasks)

		expect(diff).toEqual({
			title: 'New title',
			estimate: 2,
			id: '1',
		})
	})
})