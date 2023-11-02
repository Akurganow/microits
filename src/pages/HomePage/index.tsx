import { useSelector } from 'react-redux'
import { Flex, Layout } from 'antd'
import { selectedTasksWithoutDate, selectedTasksWithTitles } from 'store/selectors/tasks'
import Header from 'containers/Header'
import TasksList from 'components/TasksList'
import HiddenTasks from 'components/HiddenTasks'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import { selectedSettingValue } from 'store/selectors/settings'

dayjs.extend(calendar)

export default function HomePage() {
	const withTitles = useSelector(selectedTasksWithTitles)
	const withoutDate = useSelector(selectedTasksWithoutDate)
	const showUnsorted = useSelector(selectedSettingValue('showUnsorted'))

	console.log(withoutDate.at(-1))

	return <Layout>
		<Header />
		<Layout.Content style={{ paddingInline: '50px' }}>
			<Flex style={{ paddingInline: '0.5rem', gap: '0.5rem', height: 'calc(100vh - 48px)' }}>
				<TasksList items={withTitles} style={{ width: showUnsorted ? '50vw' : '100vw', height: '100%' }} />
				{showUnsorted && <TasksList items={withoutDate} style={{ width: '50vw', height: '100%' }} />}
				<HiddenTasks items={withoutDate} style={{ width: '0.5rem', height: '100%' }} />
			</Flex>
		</Layout.Content>
	</Layout>
}