import { Task, TaskFormValues, TaskPriority, TaskStatus } from 'types/tasks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	Button,
	Checkbox, Col,
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	ModalProps,
	Select,
	Switch,
	TimePicker
} from 'antd'
import { updateTask } from 'store/actions/tasks'
import { selectedDialog } from 'store/selectors/dialogs'
import { closeDialog } from 'store/actions/dialogs'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { isEmpty } from '@plq/is'
import * as st from './styles.module.css'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

import frLocale from 'antd/es/date-picker/locale/fr_FR'
import esLocale from 'antd/es/date-picker/locale/es_ES'
import ruLocale from 'antd/es/date-picker/locale/ru_RU'
import enLocale from 'antd/es/date-picker/locale/en_US'
import { selectedTags } from 'store/selectors/tasks'

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

function valuesToTask(values: TaskFormValues, task: Task): Task {
	const checkList = values.checkList?.map((checkListItem, index) => {
		const itemChecklist = task.checkList[index]

		return {
			...itemChecklist,
			...checkListItem,
		}
	})

	return {
		...task,
		...values,
		checkList,
		dueDate: values.dueDate?.toISOString(),
		date: values.date?.toISOString(),
		time: values.time?.toISOString(),
	}
}

export default function TaskView({ item, name, index, ...props }: TaskViewProperties) {
	const dispatch = useDispatch()
	const isDialogOpened = useSelector(selectedDialog(name))
	const { t, i18n } = useTranslation()
	const locale = useMemo(() => locales[i18n.resolvedLanguage.split('-')[0]], [i18n.resolvedLanguage])
	const initialValues: TaskFormValues = useMemo(() => ({
		...item,
		dueDate: isEmpty(item.dueDate) ? undefined : dayjs(item.dueDate),
		date: isEmpty(item.date) ? undefined : dayjs(item.date),
		time: isEmpty(item.time) ? undefined : dayjs(item.time),
	}), [item])
	const tags = useSelector(selectedTags)
	const tagsOptions = tags.map((tag) => ({ label: tag, value: tag }))

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

	const handleSubmit = useCallback((values: TaskFormValues) => {
		dispatch(updateTask(valuesToTask(values, item)))
		dispatch(closeDialog(name))
	}, [dispatch, item, name])

	return <Modal
		getContainer="#dialog"
		destroyOnClose={true}
		width="75vw"
		open={isDialogOpened}
		title={`#${item.id}`}
		onCancel={handleClose}
		footer={() => <>
			<Button type="primary" htmlType="submit" form={'task-form'+item.id+index}>{t('save')}</Button>
			<Button onClick={handleClose}>{t('close')}</Button>
		</>}
		{...props}
	>
		<Form<TaskFormValues>
			form={form}
			name={'task-form'+item.id+index}
			onFinish={handleSubmit}
			labelCol={{ span: 6 }}
			wrapperCol={{ span: 18 }}
			preserve={false}
		>
			<Form.Item<TaskFormValues> name="title" label={t('title')} className={st.formItem}>
				<Input bordered={false} />
			</Form.Item>

			<Form.Item<TaskFormValues> name="estimate" label={t('estimate')} className={st.formItem}>
				<InputNumber bordered={false} min={1} />
			</Form.Item>

			<Form.Item<TaskFormValues> name="timeSpent" label={t('timeSpent')} className={st.formItem}>
				<InputNumber bordered={false} min={0} />
			</Form.Item>

			<Form.Item<TaskFormValues> name="dueDate" label={t('dueDate')} className={st.formItem}>
				<DatePicker bordered={false} locale={locale} format="LL" />
			</Form.Item>

			<Form.Item<TaskFormValues> name="date" label={t('date')} className={st.formItem}>
				<DatePicker bordered={false} locale={locale} format="LL" />
			</Form.Item>

			<Form.Item<TaskFormValues> name="time" label={t('time')} className={st.formItem}>
				<TimePicker bordered={false} locale={locale} format="LT" />
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

			{!isRepeatable && <Form.Item<TaskFormValues> name="status" label={t('status')} className={st.formItem}>
				<Select bordered={false}>
					<Select.Option value={TaskStatus.Init}>{t('statusType.init')}</Select.Option>
					<Select.Option value={TaskStatus.Open}>{t('statusType.open')}</Select.Option>
					<Select.Option value={TaskStatus.InProgress}>{t('statusType.inProgress')}</Select.Option>
					<Select.Option value={TaskStatus.Done}>{t('statusType.done')}</Select.Option>
				</Select>
			</Form.Item>}

			<Form.Item<Task> name="priority" label={t('priority')} className={st.formItem}>
				<Select bordered={false}>
					<Select.Option value={TaskPriority.Urgent}>{t('priorityType.urgent')}</Select.Option>
					<Select.Option value={TaskPriority.High}>{t('priorityType.high')}</Select.Option>
					<Select.Option value={TaskPriority.Normal}>{t('priorityType.normal')}</Select.Option>
					<Select.Option value={TaskPriority.Low}>{t('priorityType.low')}</Select.Option>
				</Select>
			</Form.Item>

			<Form.Item<Task> name="tags" label={t('tags')} className={st.formItem}>
				<Select bordered={false} mode="tags" options={tagsOptions} />
			</Form.Item>

			{item.checkList && <Col offset={6} span={18}>
				{item.checkList.map((checkListItem, index) => (
					<Form.Item<Task>
						key={item.id + checkListItem.id}
						valuePropName="checked"
						name={['checkList', index, 'completed']}
						className={st.formItem}
					>
						<Checkbox>{checkListItem.title}</Checkbox>
					</Form.Item>
				))}
			</Col>}
		</Form>
	</Modal>
}
