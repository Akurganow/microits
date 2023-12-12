import { Task, TaskPriority } from 'types/tasks'
import { CSSProperties, HTMLAttributes, useCallback, useMemo } from 'react'
import { blue, grey, orange, red } from '@ant-design/colors'
import { useDispatch, useSelector } from 'react-redux'
import { setSettings } from 'store/actions/settings'
import { selectedSettingValue } from 'store/selectors/settings'
import { Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'

function getItemsByPriority(items: Task[], priority: TaskPriority) {
	return items.filter((item) => item.priority === priority)
}

interface HiddenTasksProps extends HTMLAttributes<HTMLDivElement> {
    items: Task[]
}
export default function HiddenTasks({ items, style, ...props }: HiddenTasksProps) {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const showUnsorted = useSelector(selectedSettingValue('showUnsorted'))
	const extendedStyle = useMemo<CSSProperties>(() => ({
		...style,
		cursor: 'pointer',
		position: 'fixed',
		right: '0.5rem',
		top: 0,
		paddingInlineStart: '1rem',
	}), [style])
	const urgentPriorityItems = useMemo(() => getItemsByPriority(items, TaskPriority.Urgent), [items])
	const highPriorityItems = useMemo(() => getItemsByPriority(items, TaskPriority.High), [items])
	const normalPriorityItems = useMemo(() => getItemsByPriority(items, TaskPriority.Normal), [items])
	const lowPriorityItems = useMemo(() => getItemsByPriority(items, TaskPriority.Low), [items])
	const urgentPriorityPercent = urgentPriorityItems.length / items.length * 100
	const highPriorityPercent = highPriorityItems.length / items.length * 100
	const normalPriorityPercent = normalPriorityItems.length / items.length * 100
	const lowPriorityPercent = lowPriorityItems.length / items.length * 100

	const handleItemClick = useCallback(() => {
		dispatch(setSettings({ showUnsorted: !showUnsorted }))
	}, [dispatch, showUnsorted])

	const commonStyle = {
		width: '0.5rem',
	}

	return <Tooltip title={t(showUnsorted ? 'hideUnsorted' : 'showUnsorted')} placement="left">
		<div style={extendedStyle} {...props} onClick={handleItemClick}>
			<Tooltip title={t('itemsCount.urgent', { count: urgentPriorityItems.length })} color={red.primary} placement="left">
				<div style={{ ...commonStyle, height: `${urgentPriorityPercent}%`, backgroundColor: red.primary }} />
			</Tooltip>
			<Tooltip title={t('itemsCount.high', { count: highPriorityItems.length })} color={orange.primary} placement="left">
				<div style={{ ...commonStyle, height: `${highPriorityPercent}%`, backgroundColor: orange.primary }} />
			</Tooltip>
			<Tooltip title={t('itemsCount.normal', { count: normalPriorityItems.length })} color={blue.primary} placement="left">
				<div style={{ ...commonStyle, height: `${normalPriorityPercent}%`, backgroundColor: blue.primary }} />
			</Tooltip>
			<Tooltip title={t('itemsCount.low', { count: lowPriorityItems.length })} color={grey.primary} placement="left">
				<div style={{ ...commonStyle, height: `${lowPriorityPercent}%`, backgroundColor: grey.primary }} />
			</Tooltip>
		</div>
	</Tooltip>
}