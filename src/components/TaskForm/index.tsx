import { DatePicker, Form, FormProps, Input, InputNumber, Select, TimePicker } from 'antd'
import { Task, TaskPriority } from 'types/tasks'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectedTags } from 'store/selectors/tasks'

interface TaskFormProperties extends FormProps<Task> {}

export default function TaskForm({ initialValues, name, onFinish }: TaskFormProperties) {
	const tags = useSelector(selectedTags)
	const tagsOptions = tags.map((tag) => ({ label: tag, value: tag }))
	const { t } = useTranslation()
	return <Form
		name={name}
		initialValues={initialValues}
		onFinish={onFinish}
		labelCol={{ span: 5 }}
		wrapperCol={{ span: 10 }}
	>
		<Form.Item<Task> name="title" label={t('title')} rules={[{ required: true }]}>
			<Input />
		</Form.Item>

		<Form.Item<Task> name="estimate" label={t('estimate')} rules={[{ required: true }]}>
			<InputNumber min={1} />
		</Form.Item>

		<Form.Item<Task> name="dueDate" label={t('dueDate')}>
			<DatePicker />
		</Form.Item>

		<Form.Item<Task> name="date" label={t('date')}>
			<DatePicker />
		</Form.Item>

		<Form.Item<Task> name="time" label={t('time')}>
			<TimePicker />
		</Form.Item>

		<Form.Item<Task> name={['repeatable', 'repeatType']} label={t('repeatType')}>
			<Select>
				<Select.Option value="day">{t('newTask.repeat.day')}</Select.Option>
				<Select.Option value="week">{t('newTask.repeat.week')}</Select.Option>
				<Select.Option value="month">{t('newTask.repeat.month')}</Select.Option>
				<Select.Option value="year">{t('newTask.repeat.year')}</Select.Option>
			</Select>
		</Form.Item>

		<Form.Item<Task> name={['repeatable', 'repeatEvery']} label={t('repeatEvery')}>
			<InputNumber min={1} />
		</Form.Item>

		<Form.Item<Task> name="tags" label={t('tags')}>
			<Select mode="tags" options={tagsOptions} />
		</Form.Item>

		<Form.Item<Task> name="priority" label={t('priority')}>
			<Select>
				<Select.Option value={TaskPriority.Urgent}>{t('priorityType.urgent')}</Select.Option>
				<Select.Option value={TaskPriority.High}>{t('priorityType.high')}</Select.Option>
				<Select.Option value={TaskPriority.Normal}>{t('priorityType.normal')}</Select.Option>
				<Select.Option value={TaskPriority.Low}>{t('priorityType.low')}</Select.Option>
			</Select>
		</Form.Item>

		<Form.Item<Task> name="checkList" label={t('checkList')}>
			<Select mode="tags" />
		</Form.Item>
	</Form>
}