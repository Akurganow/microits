import { createSelector } from 'reselect'
import { storeKey } from '../constants/tasks'
import { RootState } from '../types'
import dayjs from 'dayjs'
import { Task } from 'types/tasks'
import { WithRequired } from 'types/common'
import { sortBy } from '@plq/array-functions'
import minMax from 'dayjs/plugin/minMax'
import { getDayTitle, splitByDays, splitByTime } from 'utils/tasks'
import { ListTitle } from 'components/TasksList'

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
	(tasks, { firstDate, lastDate }) => {
		const repeatable = tasks.filter((item) => item.repeatable)
		const nonRepeatable = tasks.filter((item) => !item.repeatable)
		const repeatTasks = repeatable.flatMap((item) => {
			const addItemsFn = (_: unknown, i: number) => {
				const addCount = i * item.repeatable.repeatEvery
				const date = dayjs(item.date)
					.add(addCount, item.repeatable.repeatType)
					.toISOString()

				if (dayjs(date).isAfter(lastDate)) return null
				if (dayjs(date).isSame(item.date)) return null

				return {
					...item,
					date,
				} as typeof item
			}
			const itemsCount = Math.floor(lastDate.diff(firstDate, item.repeatable.repeatType) / item.repeatable.repeatEvery)

			return Array.from({ length: itemsCount }, addItemsFn)
		})

		const final = [...repeatTasks, ...repeatable, ...nonRepeatable]

		return final
			.filter(Boolean)
			.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
	}
)

export const selectedTasksWithTitles = createSelector(
	selectedTasksWithRepeatable,
	tasks => splitByDays(tasks)
		.flatMap(group => {
			const withTime = sortBy(group.filter(item => item.time), ['time', 'priority']) as WithRequired<Task, 'time' | 'date'>[]
			const withTimeSplit = splitByTime(withTime).flatMap(group => {
				const time = dayjs(group[0].time).format('HH:mm')

				return [{ type: 'time', title: time }, ...group] as (Task | ListTitle)[]
			})
			const withoutTime = sortBy(group.filter((item) => !item.time), ['priority'])

			return [{ type: 'date', title: getDayTitle(group[0].date) }, ...withoutTime, ...withTimeSplit] as (Task | ListTitle)[]
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