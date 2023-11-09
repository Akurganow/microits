import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Badge, Button, List, Tag, Tooltip, Typography } from 'antd'
import { SyncOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import cn from 'classnames'
import { isEmpty } from '@plq/is'
import { TaskListItemProps } from 'components/TaskListItem/types'
import TaskView from 'containers/dialogs/TaskView'
import { openDialog } from 'store/actions/dialogs'
import { selectedTags } from 'store/selectors/tags'
import { TaskStatus } from 'types/tasks'
import { getDueDateColor, getDueDateText, getPriority } from './helpers'
import * as st from './style.module.css'

export default function TaskListItem({ index, item, className, ...props }: TaskListItemProps) {
	const dispatch = useDispatch()
	const storedTags = useSelector(selectedTags)
	const { t } = useTranslation()
	const priority = useMemo(() => getPriority(item.priority), [item.priority])
	const itemStoredTags = useMemo(() => item.tags && !isEmpty(item.tags)
		? item.tags.map(tagId => storedTags.find(t => t.id === tagId))
		: [], [item.tags, storedTags])
	const visibleTags = useMemo(() => {
		const statsTags = itemStoredTags.filter(t => t?.showStats)

		return [...(statsTags.length > 0 ? statsTags : itemStoredTags)].slice(0, 3)
	}, [itemStoredTags])
	const dialogName = useMemo(() => 'task'+item.id+index, [index, item.id])

	const handleItemClick = () => {
		dispatch(openDialog(dialogName))
	}

	const repeatableTooltipTitle = useMemo(() => {
		if (isEmpty(item.repeatable)) return ''
		const { repeatType, repeatEvery } = item.repeatable
		return t(`repeat.${repeatType}`, { count: repeatEvery })
	}, [item.repeatable, t])

	return <List.Item className={cn(className, st.container, { [st.completed]: item.status === TaskStatus.Done })} {...props} >
		<div className={cn(st.item, st[priority])}>
			<div className={st.priority} />
			<Typography.Text
				className={st.title}
				ellipsis={{ tooltip: item.title }}
				style={{ margin: 0 }}
			>
				<Button type="link" onClick={handleItemClick}>
					<span className={st.titleText}>
						{!isEmpty(item.repeatable) && <Tooltip title={repeatableTooltipTitle}>
							<SyncOutlined />
						</Tooltip>} {item.title}
					</span>
				</Button>
			</Typography.Text>

			<div className={st.schedule}>
				<Tooltip title={getDueDateText(item.dueDate)}>
					{item.dueDate && <Typography.Text
						style={{ color: getDueDateColor(item.dueDate) }}
						className={st.date}
					>
						{dayjs(item.dueDate).format('DD.MM.YYYY')}
					</Typography.Text>}
				</Tooltip>
			</div>

			{visibleTags.length > 0 && <div className={st.tags}>
				{visibleTags.map(tag =>
					<Tag key={tag.id} color={tag.color}>{tag.name}</Tag>
				)}
			</div>}

			<div className={st.badges}>
				<Tooltip title={t('estimation', { estimate: item.estimate, timeSpent: item.timeSpent || 0 })} color="grey">
					<Badge
						showZero
						count={item.estimate}
						color="grey"
						size="small" />
				</Tooltip>
			</div>
		</div>
		<TaskView name={dialogName} item={item} index={index} />
	</List.Item>
}