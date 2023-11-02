import { Badge, Button, List, Tooltip, Typography } from 'antd'
import st from './style.module.css'
import cn from 'classnames'
import { TaskListItemProps } from 'components/TaskListItem/types'
import { useMemo } from 'react'
import { getDueDateColor, getDueDateText, getPriority } from './helpers'
import dayjs from 'dayjs'
import TaskView from 'containers/dialogs/TaskView'
import { openDialog } from 'store/actions/dialogs'
import { useDispatch } from 'react-redux'
import { TaskStatus } from 'types/tasks'
import { SyncOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

export default function TaskListItem({ item, className, ...props }: TaskListItemProps) {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const priority = useMemo(() => getPriority(item.priority), [item.priority])

	const handleItemClick = () => {
		dispatch(openDialog('task'+item.id))
	}

	const repeatableTooltipTitle = useMemo(() => {
		if (!item.repeatable) return ''
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
						{item.repeatable && <Tooltip title={repeatableTooltipTitle}>
							<SyncOutlined />
						</Tooltip>} {item.title}
					</span>
				</Button>
			</Typography.Text>

			<div className={st.schedule}>
				{item.dueDate && <Typography.Text
					style={{ color: getDueDateColor(item.dueDate) }}
					className={st.date}
				>
					{dayjs(item.dueDate).format('DD.MM.YYYY')}
				</Typography.Text>}
			</div>

			<div className={st.badges}>
				<Tooltip title={getDueDateText(item.dueDate)}>
					<Badge
						showZero
						count={item.estimate}
						color="blue"
						title="Estimation"
						size="small" />
				</Tooltip>
			</div>
		</div>
		<TaskView name={'task'+item.id} task={item} />
	</List.Item>
}