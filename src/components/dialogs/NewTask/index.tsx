'use client'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'
import { Modal } from 'antd'
import { closeDialog } from 'store/actions/dialogs'
import TaskForm from 'components/TaskForm'
import { NewTaskValues, Task, TaskPriority, TaskStatus } from 'types/tasks'
import { addTask, setNewTask } from 'store/actions/tasks'
import { useTranslation } from 'react-i18next'
import { selectedDialog } from 'store/selectors/dialogs'
import { selectedNewTask } from 'store/selectors/tasks'
import dayjs from 'dayjs'
import { isEmpty } from '@plq/is'
import { nanoid } from 'nanoid'

function valuesToTask(values: NewTaskValues, initialForm: NewTaskValues): Task {
	const isRepeatable = !isEmpty(values?.repeatable)
	const isRepeatableChanged = isRepeatable !== !isEmpty(initialForm?.repeatable)
	const repeatable = !isRepeatable ? undefined : {
		...values.repeatable,
		repeatIndex: isRepeatableChanged ? 0 : initialForm?.repeatable?.repeatIndex,
	} as Task['repeatable']

	return {
		...values,
		repeatable,
		date: values?.date ? dayjs(values.date).toString() : undefined,
		dueDate: values?.dueDate ? dayjs(values.dueDate).toString() : undefined,
		checklist: values?.checklist?.map((checkListItem, index) => ({
			title: checkListItem,
			id: index,
			completed: false,
		})),
		status: values?.status || TaskStatus.Init,
	} as Task
}

export default function NewTask() {
	const dispatch = useDispatch()
	const isDialogOpened = useSelector(selectedDialog('new-task'))
	const newTask = useSelector(selectedNewTask)
	const { t } = useTranslation()
	const initialForm = useMemo(() => ({
		title: newTask?.title || '',
		description: newTask?.description || '',
		estimate: newTask?.estimate || 0,
		timeSpent: newTask?.timeSpent || 0,
		tags: newTask?.tags || [],
		status: newTask?.status || TaskStatus.Init,
		priority: newTask?.priority || TaskPriority.Normal,
		checklist: newTask?.checklist || [],
		repeatable: newTask?.repeatable,
		date: newTask?.date ? dayjs(newTask.date) : undefined,
		dueDate: newTask?.dueDate ? dayjs(newTask.dueDate) : undefined,
	} as NewTaskValues), [newTask])

	const handleClose = useCallback(() => {
		dispatch(closeDialog('new-task'))
		dispatch(setNewTask(null))
	}, [dispatch])

	const handleFormSubmit = useCallback((values: NewTaskValues) => {
		const checklist = values?.checklist.map((checkListItem, index) => ({
			title: checkListItem,
			id: index,
			completed: false,
		}))
		values.repeatable = !values?.repeatable ? undefined : {
			...values.repeatable,
			repeatIndex: 0,
		} as Task['repeatable']
		const newTask = valuesToTask(values, initialForm)
		dispatch(addTask({ ...newTask, checklist, id: nanoid() } as unknown as Task))
		handleClose()
	}, [dispatch, handleClose, initialForm])


	return <Modal
		width="60vw"
		open={isDialogOpened}
		title={t('addNewTask')}
		onCancel={handleClose}
		okButtonProps={{ form: 'new-task-form', htmlType: 'submit' }}
		okText={t('save')}
		cancelButtonProps={{ onClick: handleClose }}
		cancelText={t('close')}
		getContainer="#dialog"
		destroyOnClose={true}
	>
		<TaskForm initialValues={initialForm} onFinish={handleFormSubmit} name="new-task-form" />
	</Modal>
}
