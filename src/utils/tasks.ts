import dayjs, { Dayjs } from 'dayjs'
import capitalize from 'lodash/capitalize'
import i18n from 'src/i18n'
import { Task, TaskFormValues } from 'types/tasks'

export function getDayTitle(date?: string) {
	const isToday = dayjs(date).isSame(dayjs(), 'day')
	const isTomorrow = dayjs(date).isSame(dayjs().add(1, 'day'), 'day')
	const isSameWeek = dayjs(date).isSame(dayjs(), 'week')
	const isSameYear = dayjs(date).isSame(dayjs(), 'year')
	const currentLanguage = i18n.resolvedLanguage
	const formatter = new Intl.RelativeTimeFormat(currentLanguage, {
		numeric: 'auto',
	})

	switch (true) {
	case isToday: {
		return capitalize(formatter.format(0, 'day'))
	}
	case isTomorrow: {
		return capitalize(formatter.format(1, 'day'))
	}
	case isSameWeek: {
		return capitalize(new Date(date).toLocaleString(currentLanguage, { weekday: 'long' }))
	}
	case isSameYear: {
		return capitalize(new Date(date).toLocaleString(currentLanguage, { weekday: 'long', day: 'numeric', month: 'long' }))
	}
	default: {
		return capitalize(new Date(date).toLocaleString(currentLanguage, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
	}
	}
}

/*
	Splits an array of elements with the time property into arrays with elements with the same dates, field time is ignore actual date
 */
export function splitByTime<T extends { time: string | number | Date | Dayjs }>(array: T[]) {
	const result: T[][] = []
	let currentTime: string | undefined

	for (const item of array) {
		const time = dayjs(item.time).format('HH:mm')

		if (time === currentTime) {
			result.at(-1).push(item)
		} else {
			result.push([item])
			currentTime = time
		}
	}

	return result
}

/*
	Splits an array of elements with the date property into arrays with elements with the same dates
 */
export function splitByDays<T extends { date: string | number | Date | Dayjs }>(array: T[]) {
	const result: T[][] = []
	let currentDay: string | undefined

	for (const item of array) {
		const day = dayjs(item.date).format('YYYY-MM-DD')

		if (day === currentDay) {
			result.at(-1).push(item)
		} else {
			result.push([item])
			currentDay = day
		}
	}

	return result
}

export function valuesToTask(values: TaskFormValues, task: Task): Task {
	const checkList = values.checkList?.map((checkListItem, index) => {
		const itemChecklist = task.checkList[index]

		return {
			...itemChecklist,
			...checkListItem,
		}
	})

	return {
		...task,
		...values,
		checkList,
		dueDate: values.dueDate?.toISOString(),
		date: values.date?.toISOString(),
		time: values.time?.toISOString(),
	}
}