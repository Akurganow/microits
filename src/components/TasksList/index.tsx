import { HTMLAttributes, useMemo } from 'react'
import { AutoSizer, List } from 'react-virtualized'
import TaskListItem from 'components/TaskListItem'
import TaskListTitle from 'components/TaskListTitle'
import { Task } from 'types/tasks'
import st from './styles.module.css'
import { Empty } from 'antd'

export interface ListTitle {
	type: 'date' | 'time'
	title: string
}

interface TasksListProps extends HTMLAttributes<HTMLUListElement> {
	items: (Task | ListTitle)[]
}

function isTitle(item: Task | ListTitle): item is ListTitle {
	return 'type' in item
}
export default function TasksList({ items, ...props }: TasksListProps) {
	const rowCount = useMemo(() => items.length, [items])

	return <ul className={st.list} {...props}>
		<AutoSizer>
			{({ height, width }) => (
				<List
					height={height}
					width={width}
					rowHeight={({ index }) => {
						const item = items[index]

						return isTitle(item) && item.type === 'date' ? 64 : 32
					}}
					rowRenderer={({ key, index, style }) => {
						const item = items[index]

						return isTitle(item)
							? <TaskListTitle key={key} style={style} item={item} />
							: <TaskListItem key={key} style={style} item={item} />
					}}
					rowCount={rowCount}
					noRowsRenderer={() => <Empty />}
				/>
			)}
		</AutoSizer>
	</ul>
}