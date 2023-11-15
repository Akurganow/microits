import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useMemo } from 'react'
import { Modal } from 'antd'
import { closeDialog } from 'store/actions/dialogs'
import TaskForm from 'components/TaskForm'
import { Task, TaskFormValues, TaskPriority, TaskStatus } from 'types/tasks'
import { addTask } from 'store/actions/tasks'
import { useTranslation } from 'react-i18next'
import { selectedDialog } from 'store/selectors/dialogs'
import { isEmpty } from '@plq/is'

export default function NewTask() {
	const dispatch = useDispatch()
	const isDialogOpened = useSelector(selectedDialog('new-task'))
	const { t } = useTranslation()
	const initialForm = useMemo(() => ({
		title: '',
		estimate: 1,
		timeSpent: 0,
		tags: [],
		status: TaskStatus.Init,
		priority: TaskPriority.Normal,
		checkList: [],
	} as TaskFormValues), [])

	const handleFormSubmit = useCallback((values: Task) => {
		const checkList = values.checkList.map((checkListItem, index) => ({
			title: checkListItem,
			id: index,
			completed: false,
		}))
		values.repeatable = isEmpty(values.repeatable) ? null : {
			...values.repeatable,
			repeatIndex: 0,
		}
		dispatch(addTask({ ...initialForm, ...values, checkList } as unknown as Task))
		dispatch(closeDialog('new-task'))
	}, [dispatch, initialForm])

	const handleClose = useCallback(() => {
		dispatch(closeDialog('new-task'))
	}, [dispatch])

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
