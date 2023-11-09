import { useSelector } from 'react-redux'
import { Flex, Layout } from 'antd'
import { selectedExpiredTasks, selectedTasksWithoutDate, selectedTasksWithTitles } from 'store/selectors/tasks'
import Header from 'containers/Header'
import TasksList, { ListTitle } from 'components/TasksList'
import HiddenTasks from 'components/HiddenTasks'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import { selectedSettingValue } from 'store/selectors/settings'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

dayjs.extend(calendar)

export default function HomePage() {
	const { t } = useTranslation()
	const withTitles = useSelector(selectedTasksWithTitles)
	const withoutDate = useSelector(selectedTasksWithoutDate)
	const showUnsorted = useSelector(selectedSettingValue('showUnsorted'))
	const expiredTasks = useSelector(selectedExpiredTasks)

	const hasExpired = useMemo(() => expiredTasks.length > 0, [expiredTasks.length])
	const hasUnsorted = useMemo(() => withoutDate.length > 0, [withoutDate.length])

	const expiredTitle = useMemo(() => hasExpired && {
		type: 'date',
		title: t('expired'),
	} as ListTitle, [hasExpired, t])
	const unsortedTitle = useMemo(() => hasExpired && hasUnsorted && {
		type: 'date',
		title: t('unsorted'),
	} as ListTitle, [hasExpired, hasUnsorted, t])

	const finalExpiredTasks = useMemo(() => [expiredTitle, ...expiredTasks], [expiredTasks, expiredTitle])
	const finalUnsortedTasks = useMemo(() => [unsortedTitle, ...withoutDate], [withoutDate, unsortedTitle])

	const containerStyle = useMemo(() => ({
		paddingInline: '0.5rem',
		gap: '0.5rem',
		height: 'calc(100vh - 48px)' }
	), [])
	const sortedStyle = useMemo(() => ({
		width: showUnsorted ? '50vw' : '100vw',
		height: '100%',
	}), [showUnsorted])
	const unsortedStyle = useMemo(() => ({
		width: '50vw',
		height: '100%',
		display: 'grid',
		gridTemplateRows: `${
			hasExpired
				? (expiredTasks.length * 32) + 64
				: 0
		}px ${
			hasUnsorted
				? (withoutDate.length * 32) + 64
				: 0
		}px`,
		gridTemplateColumns: '1fr',
	}), [expiredTasks.length, hasExpired, hasUnsorted, withoutDate.length])

	return <Layout>
		<Header />
		<Layout.Content style={{ paddingInline: '50px' }}>
			<Flex style={containerStyle}>
				<TasksList items={withTitles} style={sortedStyle} />
				{showUnsorted && <div style={unsortedStyle}>
					<TasksList items={finalExpiredTasks} />
					<TasksList items={finalUnsortedTasks} />
				</div>}
				<HiddenTasks items={withoutDate} style={{ width: '0.5rem', height: '100%' }} />
			</Flex>
		</Layout.Content>
	</Layout>
}