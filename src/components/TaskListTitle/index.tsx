import { HTMLAttributes, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { List, Tag, Typography } from 'antd'
import { ListTitle } from 'components/TasksList'
import cn from 'classnames'
import * as st from './styles.module.css'
import { isEmpty } from '@plq/is'
import { selectedTasksByDate } from 'store/selectors/tasks'
import { selectedStatsTags } from 'store/selectors/tags'

interface TaskListTitleProps extends HTMLAttributes<HTMLDivElement> {
    item: ListTitle
}

function Stats ({ date }: { date: string }) {
	const tasksByDate = useSelector(selectedTasksByDate(date))
	const statsTags = useSelector(selectedStatsTags)
	const stats = useMemo(() => {
		const stats = statsTags.map(tag => {
			const tasks = tasksByDate.filter(t => t.tags.includes(tag.id))

			return {
				...tag,
				count: tasks.length,
				estimate: tasks.reduce((acc, t) => acc + t.estimate, 0),
			}
		})

		return stats.filter(s => s.count > 0)
	}, [statsTags, tasksByDate])

	return <Typography.Text className={st.stats} type="secondary">
		{
			stats.map(tag =>
				<span key={tag.id}>
					<Tag color={tag.color}>
						{tag.name} {tag.estimate}
					</Tag>
				</span>
			)
		}
	</Typography.Text>
}

export default function TaskListTitle({ item, className, ...props }: TaskListTitleProps) {
	const isDate = useMemo(() => item.type === 'date' && !isEmpty(item.date), [item.date, item.type])

	return <List.Item className={cn(className, st.container, st[item.type])} {...props}>
		<Typography.Title
			ellipsis={{ tooltip: item.title }}
			level={isDate ? 4 : 5}
			style={{ margin: 0 }}
		>
			{item.title}
			{isDate && <Stats date={item.date} />}
		</Typography.Title>
	</List.Item>
}