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
		checkList: newTask?.checkList || [],
		repeatable: newTask?.repeatable,
		date: newTask?.date ? dayjs(newTask.date) : undefined,
		dueDate: newTask?.dueDate ? dayjs(newTask.dueDate) : undefined,
	} as NewTaskValues), [newTask])

	const handleClose = useCallback(() => {
		dispatch(closeDialog('new-task'))
		dispatch(setNewTask(null))
	}, [dispatch])

	const handleFormSubmit = useCallback((values: NewTaskValues) => {
		const checkList = values?.checkList.map((checkListItem, index) => ({
			title: checkListItem,
			id: index,
			completed: false,
		}))
		values.repeatable = !values?.repeatable ? undefined : {
			...values.repeatable,
			repeatIndex: 0,
		} as Task['repeatable']
		dispatch(addTask({ ...initialForm, ...values, checkList } as unknown as Task))
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
