import { createSelector } from 'reselect'
import { storeKey } from '../constants/tasks'
import { RootState } from '../types'
import dayjs from 'dayjs'
import { Task, TaskStatus } from 'types/tasks'
import { WithRequired } from 'types/common'
import minMax from 'dayjs/plugin/minMax'
import { getDayTitle, splitByDays, splitByTime } from 'utils/tasks'
import { ListTitle } from 'components/TasksList'
import memoize from 'lodash/memoize'

dayjs.extend(minMax)

const rawSelectedTasks = (state: RootState) => state[storeKey]
export const selectedTasks = createSelector(
	rawSelectedTasks,
	(state) => state.tasks
)

export const selectedTasksWithDate = createSelector(
	selectedTasks,
	(tasks) => tasks.filter(task =>
		task.date && dayjs(task.date).isAfter(dayjs().subtract(1, 'day'), 'day')
	) as WithRequired<Task, 'date'>[]
)

export const selectedTasksWithoutDate = createSelector(
	selectedTasks,
	(tasks) => tasks
		.filter((task) => !task.date)
		.sort((a, b) => {
			if (!a.dueDate) return -1
			if (!b.dueDate) return 1

			return dayjs(a.dueDate).diff(dayjs(b.dueDate))
		})
)

export const selectedTasksDateRange = createSelector(
	selectedTasksWithDate,
	(tasks) => {
		if (tasks.length === 0) return null

		const dates = tasks.map((task) => dayjs(task.date))
		return {
			firstDate: dayjs.min(dates).startOf('day'),
			lastDate: dayjs.max(dates).endOf('day'),
		}
	}
)

export const selectedTasksWithRepeatable = createSelector(
	selectedTasksWithDate,
	selectedTasksDateRange,
	(tasks, datesRange) => {
		if (tasks.length === 0) return []

		const repeatable = tasks.filter((item) => item.repeatable)
		const nonRepeatable = tasks.filter((item) => !item.repeatable)
		const repeatTasks = repeatable.flatMap((item) => {
			const addItemsFn = (_: unknown, i: number) => {
				const addCount = i * item.repeatable.repeatEvery
				const date = dayjs(item.date)
					.add(addCount, item.repeatable.repeatType)
					.toISOString()

				if (dayjs(date).isAfter(datesRange?.lastDate)) return null
				if (dayjs(date).isSame(item.date)) return null

				return {
					...item,
					repeatable: {
						...item.repeatable,
						repeatIndex: i,
					},
					date,
				} as typeof item
			}
			const itemsCount = Math.floor(datesRange?.lastDate.diff(datesRange?.firstDate, item.repeatable.repeatType) / item.repeatable.repeatEvery)

			return Array.from({ length: itemsCount }, addItemsFn)
		})

		const final = [...repeatTasks, ...repeatable, ...nonRepeatable]

		return final
			.filter(Boolean)
			.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
	}
)

export const selectedRepeatableStatus = memoize((date: string) =>
	createSelector(
		selectedTasksWithRepeatable,
		(tasks) => {
			const task = tasks.find((task) => dayjs(task.date).isSame(date, 'day'))
			const statuses = task?.repeatStatuses ?? []

			return statuses[task?.repeatable?.repeatIndex] ?? task?.status ?? TaskStatus.Init
		}
	))


export const selectedTasksWithTitles = createSelector(
	selectedTasksWithRepeatable,
	tasks => splitByDays(tasks)
		.flatMap(group => {
			const withTime = group
				.filter(item => item.time)
				.sort((a, b) => dayjs(a.time).diff(dayjs(b.time))) as unknown as WithRequired<Task, 'date' | 'time'>[]
			const withTimeSplit = splitByTime(withTime).flatMap(group => {
				const time = dayjs(group[0].time).format('HH:mm')

				return [{ type: 'time', title: time }, ...group] as (Task | ListTitle)[]
			})
			const withoutTime = group
				.filter((item) => !item.time)
				.sort((a, b) => a.priority - b.priority)

			return [
				{ type: 'date', title: getDayTitle(group[0].date), date: group[0].date },
				...withoutTime,
				...withTimeSplit
			] as (Task | ListTitle)[]
		})
)

export const selectedTags = createSelector(
	selectedTasks,
	(tasks) => {
		const tags = new Set<string>()
		for (const task of tasks) {
			for (const tag of task.tags) {
				tags.add(tag)
			}
		}
		return [...tags]
	}
)

export const selectedExpiredTasks = createSelector(
	selectedTasks,
	(tasks) => tasks.filter((task) =>
		task.date && dayjs(task.date).isBefore(dayjs().startOf('day'))
		&& task.status !== TaskStatus.Done
	)
)

export const selectedTasksByDate = memoize((date: string) =>
	createSelector(
		selectedTasksWithRepeatable,
		tasks => tasks.filter((task) =>
			dayjs(task.date).isSame(dayjs(date), 'day')
		)
	))

