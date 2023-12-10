'use client'
import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Badge, List, Tag, Tooltip, Typography } from 'antd'
import { FireOutlined, SyncOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import cn from 'classnames'
import { isEmpty } from '@plq/is'
import { TaskListItemProps } from 'components/TaskListItem/types'
import TaskView from 'containers/dialogs/TaskView'
import { openDialog } from 'store/actions/dialogs'
import { selectedTags } from 'store/selectors/tags'
import { selectedRepeatableStatus } from 'store/selectors/tasks'
import { TaskRepeatable, TaskStatus } from 'types/tasks'
import { getDueDateColor, getDueDateToken, getPriority } from './helpers'
import st from './style.module.css'
import { grey, red } from '@ant-design/colors'

export default function TaskListItem({ index, item, className, ...props }: TaskListItemProps) {
	const dispatch = useDispatch()
	const storedTags = useSelector(selectedTags)
	const { t } = useTranslation()
	const priority = useMemo(() => getPriority(item.priority), [item.priority])
	const itemStoredTags = useMemo(() => item.tags && !isEmpty(item.tags)
		? item.tags.map(tagId => storedTags.find(t => t.id === tagId))
		: [], [item.tags, storedTags])
	const visibleTag = useMemo(() => {
		const statsTags = itemStoredTags.filter(t => t?.showStats)

		return [...(statsTags.length > 0 ? statsTags : itemStoredTags)][0]
	}, [itemStoredTags])
	const dialogName = useMemo(() => 'task'+item.id+index, [index, item.id])
	const repeatableStatus = useSelector(selectedRepeatableStatus(item.id, item.date?.toString()))
	const status = repeatableStatus ?? item.status
	const isCompleted = status === TaskStatus.Done

	const handleItemClick = () => {
		dispatch(openDialog(dialogName))
	}

	const repeatableTooltipTitle = useMemo(() => {
		if (isEmpty(item.repeatable)) return ''

		const { repeatType, repeatEvery } = item.repeatable as TaskRepeatable
		
		return t(`repeat.${repeatType}`, { count: repeatEvery })
	}, [item.repeatable, t])

	return <>
		<List.Item
			onClick={handleItemClick}
			className={cn(className, st.container, { [st.completed]: isCompleted })}
			{...props}
		>
			<div className={cn(st.item, st[priority])}>
				<div className={st.priority} />
				<Typography.Text
					className={st.title}
					ellipsis={{ tooltip: item.title }}
					style={{ margin: 0 }}
				>

					<Typography.Link
						className={st.titleText}
						style={{ color: isCompleted ? grey[0] : undefined }}
					>
						{
							!isEmpty(item.repeatable)
								? <Tooltip title={repeatableTooltipTitle}>
									<SyncOutlined />
								</Tooltip>
								: dayjs(item.dueDate)
									.isAfter(dayjs().subtract(3, 'day'))
								&& <Tooltip title={t(`deadline.${getDueDateToken(item.dueDate)}`)}>
									<FireOutlined style={{ color: red.primary }} />
								</Tooltip>
						} {item.title}
					</Typography.Link>
				</Typography.Text>

				<div className={st.schedule}>
					<Tooltip title={t(`deadline.${getDueDateToken(item.dueDate)}`)}>
						{item.dueDate && <Typography.Text
							style={{ color: getDueDateColor(item.dueDate) }}
							className={st.date}
						>
							{dayjs(item.dueDate).format('DD.MM.YYYY')}
						</Typography.Text>}
					</Tooltip>
				</div>

				{visibleTag && <Tag
					key={visibleTag.id}
					color={visibleTag?.color || grey.primary}
				>
					{visibleTag.name}
				</Tag>}

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
		
		</List.Item>
		<TaskView name={dialogName} item={item} index={index} />
	</>
}