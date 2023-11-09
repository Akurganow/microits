import { useSelector } from 'react-redux'
import { Flex, Layout } from 'antd'
import { selectedExpiredTasks, selectedTasksWithoutDate, selectedTasksWithTitles } from 'store/selectors/tasks'
import Header from 'containers/Header'
import TasksList, { ListTitle } from 'components/TasksList'
import HiddenTasks from 'components/HiddenTasks'
import EmptyHints from 'components/EmptyHints'
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
	const hasNoTasks = useMemo(() => withTitles.length === 0 && !hasExpired && !hasUnsorted, [hasExpired, hasUnsorted, withTitles.length])

	const expiredTitle = useMemo(() => ({
		type: 'date',
		title: t('expired'),
	} as ListTitle), [t])
	const unsortedTitle = useMemo(() => ({
		type: 'date',
		title: t('unsorted'),
	} as ListTitle), [t])

	const finalExpiredTasks = useMemo(() =>
		[...(hasExpired ? [expiredTitle] : []), ...expiredTasks],
	[expiredTasks, expiredTitle, hasExpired])
	const finalUnsortedTasks = useMemo(() =>
		[...(hasExpired && hasUnsorted ? [unsortedTitle] : []), ...withoutDate],
	[hasExpired, hasUnsorted, unsortedTitle, withoutDate])

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
			{
				hasNoTasks
					? <EmptyHints style={containerStyle} />
					: <Flex style={containerStyle}>
						{
							withTitles.length > 0
								? <TasksList items={withTitles} style={sortedStyle}/>
								: <EmptyHints style={sortedStyle}/>
						}
						{
							showUnsorted && (
								hasExpired || hasUnsorted
									? <div style={unsortedStyle}>
										<TasksList items={finalExpiredTasks} />
										<TasksList items={finalUnsortedTasks} />
									</div>
									: <EmptyHints style={unsortedStyle} />
							)
						}
						<HiddenTasks items={withoutDate} style={{ width: '0.5rem', height: '100%' }}/>
					</Flex>
			}
		</Layout.Content>
	</Layout>
}