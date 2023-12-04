'use client'
import { Task, TaskFormValues, TaskPriority, TaskStatus } from 'types/tasks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	Button,
	DatePicker,
	Flex,
	Form,
	Input,
	InputNumber,
	Modal,
	ModalProps,
	Popconfirm,
	Select, Space,
	Switch,
	Tag,
	TimePicker
} from 'antd'
import { addTask, removeTask, updateTask } from 'store/actions/tasks'
import { selectedLastItemId, selectedRepeatableStatus, selectedTaskDate } from 'store/selectors/tasks'
import { selectedAllTags, selectedTags } from 'store/selectors/tags'
import { selectedDialog } from 'store/selectors/dialogs'
import { closeDialog } from 'store/actions/dialogs'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { isEmpty } from '@plq/is'
import st from './styles.module.css'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { valuesToTask } from 'utils/tasks'
import { grey } from '@ant-design/colors'
import frLocale from 'antd/es/date-picker/locale/fr_FR'
import esLocale from 'antd/es/date-picker/locale/es_ES'
import ruLocale from 'antd/es/date-picker/locale/ru_RU'
import enLocale from 'antd/es/date-picker/locale/en_US'
import Checklist from 'components/Checklist'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import dynamic from 'next/dynamic'
import { EditTwoTone } from '@ant-design/icons'
import { CustomTagProps } from 'rc-select/lib/BaseSelect'

const MDEditor = dynamic(
	() => import('@uiw/react-md-editor'),
	{ ssr: false }
)

const Markdown = dynamic(
	() => import('@uiw/react-markdown-preview'),
	{ ssr: false }
)

dayjs.extend(localizedFormat)

const locales = {
	en: enLocale,
	ru: ruLocale,
	es: esLocale,
	fr: frLocale,
}

interface TaskViewProperties extends ModalProps {
    item: Task
	name: string
	index: number
}

export default function TaskView({ item, name, index, ...props }: TaskViewProperties) {
	const dispatch = useDispatch()
	const { t, i18n } = useTranslation()
	const [isDescriptionEditing, setIsDescriptionEditing] = useState(false)
	const isDialogOpened = useSelector(selectedDialog(name))
	const tags = useSelector(selectedAllTags)
	const storedTags = useSelector(selectedTags)
	const lastItemId = useSelector(selectedLastItemId)
	const originalDate = useSelector(selectedTaskDate(item.id))
	const repeatableStatus = useSelector(selectedRepeatableStatus(item.id, item.date?.toString()))
	const status = repeatableStatus ?? item.status
	const tagsOptions = useMemo(() => tags.map((tag) => ({ label: tag.name, value: tag.id })), [tags])
	const locale = useMemo(() => {
		const currentLocale = i18n.resolvedLanguage?.split('-')?.[0] as keyof typeof locales

		return locales[currentLocale] ?? enLocale
	}, [i18n.resolvedLanguage])
	const initialValues: TaskFormValues = useMemo(() => ({
		...item,
		status,
		dueDate: isEmpty(item.dueDate) ? undefined : dayjs(item.dueDate),
		date: isEmpty(item.date) ? undefined : dayjs(item.date),
		time: isEmpty(item.time) ? undefined : dayjs(item.time),
	}), [item, status])

	const [form] = Form.useForm<TaskFormValues>()
	const [isRepeatable, setIsRepeatable] = useState(!isEmpty(initialValues?.repeatable))

	useEffect(() => {
		if (isDialogOpened) {
			form.setFieldsValue(initialValues)
		}
	}, [form, initialValues, isDialogOpened])

	const handleClose = useCallback(() => {
		dispatch(closeDialog(name))
	}, [dispatch, name])

	const handleDelete = useCallback(() => {
		dispatch(removeTask(item.id))
		dispatch(closeDialog(name))
	}, [dispatch, item.id, name])

	const handleSubmit = useCallback(async (values: TaskFormValues) => {
		const status = values.status
		const repeatable = isRepeatable ? values.repeatable : undefined
		const repeatStatuses = [...(item.repeatStatuses || [])]
		const repeatIndex = repeatable ? repeatable.repeatIndex || 0 : 0
		const isFirstRepeat = item.repeatable ? repeatIndex === 0 : false

		if (repeatable) {
			repeatStatuses[repeatIndex] = values.status
			values.status = item.status ?? TaskStatus.Init
			values.repeatStatuses = repeatStatuses
			values.date = dayjs(originalDate)
		}

		if (repeatable && isFirstRepeat && status === TaskStatus.Done) {
			const itemDuplicate = { ...item }
			const nextRepeatDate = values.date?.add(repeatable.repeatEvery, repeatable.repeatType)

			itemDuplicate.id = lastItemId + 1
			itemDuplicate.repeatable = undefined
			itemDuplicate.status = TaskStatus.Done
			itemDuplicate.repeatStatuses = undefined

			dispatch(addTask(itemDuplicate))

			values.date = nextRepeatDate
			repeatStatuses.shift()
			values.repeatStatuses = repeatStatuses
		}

		values.checkList = item.checkList

		dispatch(updateTask(valuesToTask({ ...values, repeatable }, item)))
		dispatch(closeDialog(name))
		setIsDescriptionEditing(false)
	}, [dispatch, isRepeatable, item, lastItemId, name, originalDate])

	const handleApply = useCallback(() => {
		const values = form.getFieldsValue()
		dispatch(updateTask(valuesToTask(values, item)))
		setIsDescriptionEditing(false)
	}, [dispatch, form, item])

	const tagRenderer = useCallback((props: CustomTagProps) => {
		const { label, closable, onClose } = props
		const tag = storedTags.find((tag) => tag.id === label)
		const color = tag ? tag.color : grey.primary

		return <Tag
			color={color}
			closable={closable}
			onClose={onClose}
		>
			{label}
		</Tag>
	}, [storedTags])

	return <Modal
		getContainer="#dialog"
		destroyOnClose={true}
		width="50vw"
		open={isDialogOpened}
		title={`#${item.id}`}
		onCancel={handleClose}
		footer={
			<Flex justify="space-between">
				<Flex justify="end">
					<Popconfirm
						title={t('deleteTaskConfirm', { id: item.id })}
						onConfirm={handleDelete}
						okText={t('yes')}
						cancelText={t('no')}
					>
						<Button danger>{t('delete')}</Button>
					</Popconfirm>
				</Flex>
				<Flex>
					<Button htmlType="submit" type="primary" form={'task-form'+item.id+index}>{t('save')}</Button>
					<Button type="primary" ghost onClick={handleApply}>{t('apply')}</Button>
					<Button onClick={handleClose}>{t('close')}</Button>
				</Flex>
			</Flex>
		}
		{...props}
	>
		<Form<TaskFormValues>
			form={form}
			name={'task-form'+item.id+index}
			onFinish={handleSubmit}
			labelCol={{ span: 7 }}
			wrapperCol={{ span: 16, offset: 1 }}
		>
			<Form.Item<TaskFormValues> name="title" label={t('title')} className={st.formItem}>
				<Input bordered={false} />
			</Form.Item>

			<Form.Item<TaskFormValues> name="description" label={t('description')} className={st.formItem}>
				{isDescriptionEditing
					? <MDEditor
						onKeyDown={event => {
							if (event.key === 'Escape') {
								setIsDescriptionEditing(false)
							}
						}}
					/>
					: <Space>
						<Markdown
							source={item.description}
							style={{ whiteSpace: 'pre-wrap', padding: '4px 11px' }}
						/>
						<Button size="small" onClick={() => setIsDescriptionEditing(true)}>
							<EditTwoTone />
						</Button>
					</Space>
				}
			</Form.Item>

			<Form.Item<TaskFormValues> name="estimate" label={t('estimate')} className={st.formItem}>
				<InputNumber bordered={false} min={0} step={0.25} />
			</Form.Item>

			<Form.Item<TaskFormValues> name="timeSpent" label={t('timeSpent')} className={st.formItem}>
				<InputNumber bordered={false} min={0} step={0.25} />
			</Form.Item>

			<Form.Item<TaskFormValues> name="dueDate" label={t('dueDate')} className={st.formItem}>
				<DatePicker bordered={false} locale={locale} format="LL" />
			</Form.Item>

			<Form.Item<TaskFormValues> name="date" label={t('date')} className={st.formItem}>
				<DatePicker bordered={false} locale={locale} format="LL" />
			</Form.Item>

			<Form.Item<TaskFormValues> name="time" label={t('time')} className={st.formItem}>
				<TimePicker
					bordered={false}
					locale={locale}
					format="HH:mm"
					minuteStep={15}
					hideDisabledOptions={true}
					disabledTime={() => ({ disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 22, 23] })} />
			</Form.Item>

			<Form.Item<TaskFormValues> label={t('repeatTask')} className={st.formItem}>
				<Switch checked={isRepeatable} onChange={setIsRepeatable} />
			</Form.Item>

			{isRepeatable && <>
				<Form.Item<Task> name={['repeatable', 'repeatEvery']} label={t('repeatEvery')} className={st.formItem}>
					<InputNumber bordered={false} min={1} placeholder={t('repeatEvery')} />
				</Form.Item>
				<Form.Item<Task> name={['repeatable', 'repeatType']} label={t('repeatType')} className={st.formItem}>
					<Select bordered={false} placeholder={t('repeatType')}>
						<Select.Option value="day">{t('repeatTypes.day')}</Select.Option>
						<Select.Option value="week">{t('repeatTypes.week')}</Select.Option>
						<Select.Option value="month">{t('repeatTypes.month')}</Select.Option>
						<Select.Option value="year">{t('repeatTypes.year')}</Select.Option>
					</Select>
				</Form.Item>
			</>}

			<Form.Item<TaskFormValues> name="status" label={t('status')} className={st.formItem}>
				<Select bordered={false}>
					<Select.Option value={TaskStatus.Init}>{t('statusType.init')}</Select.Option>
					<Select.Option value={TaskStatus.Open}>{t('statusType.open')}</Select.Option>
					<Select.Option value={TaskStatus.InProgress}>{t('statusType.inProgress')}</Select.Option>
					<Select.Option value={TaskStatus.Done}>{t('statusType.done')}</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item<Task> name="priority" label={t('priority')} className={st.formItem}>
				<Select bordered={false}>
					<Select.Option value={TaskPriority.Urgent}>{t('priorityType.urgent')}</Select.Option>
					<Select.Option value={TaskPriority.High}>{t('priorityType.high')}</Select.Option>
					<Select.Option value={TaskPriority.Normal}>{t('priorityType.normal')}</Select.Option>
					<Select.Option value={TaskPriority.Low}>{t('priorityType.low')}</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item<Task> name="tags" label={t('tags')} className={st.formItem}>
				<Select bordered={false} mode="tags" options={tagsOptions} tagRender={tagRenderer} />
			</Form.Item>
			
			<Form.Item<Task> label={t('checkList')} className={st.formItem}>
				<Checklist task={item} />
			</Form.Item>
		</Form>
	</Modal>
}
