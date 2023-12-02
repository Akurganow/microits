import { HTMLAttributes, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { List, Tag, Typography } from 'antd'
import { ListTitle } from 'components/TasksList'
import cn from 'classnames'
import st from './styles.module.css'
import { isEmpty } from '@plq/is'
import { selectedTasksByDate } from 'store/selectors/tasks'
import { selectedStatsTags } from 'store/selectors/tags'
import { grey } from '@ant-design/colors'
import { useTranslation } from 'react-i18next'

interface TaskListTitleProps extends HTMLAttributes<HTMLDivElement> {
    item: ListTitle
	index: number
}

function Stats ({ date }: { date: string }) {
	const { t } = useTranslation()
	const tasksByDate = useSelector(selectedTasksByDate(date))
	const statsTags = useSelector(selectedStatsTags)
	const estimateSum = useMemo(() => tasksByDate.reduce((acc, t) => acc + (t?.estimate || 0), 0), [tasksByDate])
	const stats = useMemo(() => {
		const stats = statsTags.map(tag => {
			const tasks = tasksByDate.filter(t => t?.tags.includes(tag.id))

			return {
				...tag,
				count: tasks.length,
				estimate: tasks.reduce((acc, t) => acc + (t?.estimate || 0), 0),
			}
		})

		return stats.filter(s => s.count > 0)
	}, [statsTags, tasksByDate])

	return <Typography.Text className={st.stats} type="secondary">
		{
			stats.map(tag =>
				<Tag color={tag.color} key={tag.id}>
					{tag.name} {tag.estimate}
				</Tag>
			)
		}
		<Tag color={grey.primary}>{t('estimateSum')} {estimateSum}</Tag>
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
			{isDate && <Stats date={item.date as string} />}
		</Typography.Title>
	</List.Item>
}