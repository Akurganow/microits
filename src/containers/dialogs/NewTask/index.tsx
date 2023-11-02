import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { Button, Modal } from 'antd'
import { closeDialog } from 'store/actions/dialogs'
import TaskForm from 'components/TaskForm'
import { Task, TaskFormValues, TaskPriority, TaskStatus } from 'types/tasks'
import { addTask } from 'store/actions/tasks'
import { useTranslation } from 'react-i18next'
import { selectedDialog } from 'store/selectors/dialogs'
import { isEmpty } from '@plq/is'

export default function () {
	const dispatch = useDispatch()
	const isDialogOpened = useSelector(selectedDialog('new-task'))
	const { t } = useTranslation()
	const initialForm: TaskFormValues = {
		title: '',
		estimate: 1,
		timeSpent: 0,
		tags: [],
		status: TaskStatus.Init,
		priority: TaskPriority.Normal,
		checkList: [],
		repeatable: null,
	}

	const handleFormSubmit = useCallback((values: Task) => {
		values.checkList = values.checkList.map((checkListItem, index) => ({
			...checkListItem,
			id: index,
			completed: false,
		}))
		values.repeatable = isEmpty(values.repeatable) ? null : values.repeatable
		dispatch(addTask(values))
		dispatch(closeDialog('new-task'))
	}, [dispatch])

	const handleClose = useCallback(() => {
		dispatch(closeDialog('new-task'))
	}, [dispatch])

	return <Modal
		open={isDialogOpened}
		title={t('addNewTask')}
		onCancel={handleClose}
		footer={() => <>
			<Button type="primary" htmlType="submit" form="new-task-form">{t('save')}</Button>
			<Button onClick={handleClose}>{t('close')}</Button>
		</>}
	>
		<TaskForm initialValues={initialForm} onFinish={handleFormSubmit} name="new-task-form" />
	</Modal>
}
