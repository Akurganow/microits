import { HTMLAttributes, useCallback, useMemo } from 'react'
import { AutoSizer, List } from 'react-virtualized'
import TaskListItem from 'components/TaskListItem'
import TaskListTitle from 'components/TaskListTitle'
import { Task } from 'types/tasks'
import * as st from './styles.module.css'
import { Empty } from 'antd'

export interface ListTitle<T = 'date' | 'time'> {
	type: T
	title: string
}

interface TasksListProps extends HTMLAttributes<HTMLUListElement> {
	items: (Task | ListTitle)[]
}

function isTitle(item: Task | ListTitle): item is ListTitle {
	return item && 'type' in item
}

function isDateTitle(item: Task | ListTitle): item is ListTitle<'date'> {
	return isTitle(item) && item.type === 'date'
}

export default function TasksList({ items, ...props }: TasksListProps) {
	const rowCount = useMemo(() => items.length, [items])
	const getItem = useCallback((index: number) => items[index], [items])

	const rowHeight = useCallback(({ index }) => {
		const item = getItem(index)

		return isTitle(item) && isDateTitle(item) ? 64 : 32
	}, [getItem])
	const rowRenderer = useCallback(({ key, index, style }) => {
		const item = getItem(index)

		return isTitle(item)
			? <TaskListTitle key={key} style={style} item={item} />
			: <TaskListItem key={key} style={style} item={item} index={index} />
	}, [getItem])

	return <ul className={st.list} {...props}>
		<AutoSizer>
			{({ height, width }) => (
				<List
					height={height}
					width={width}
					rowHeight={rowHeight}
					rowRenderer={rowRenderer}
					rowCount={rowCount}
					noRowsRenderer={() => <Empty />}
				/>
			)}
		</AutoSizer>
	</ul>
}