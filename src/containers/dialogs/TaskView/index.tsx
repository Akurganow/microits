import { Task } from 'types/tasks'
import { useCallback } from 'react'
import { Button, Modal, ModalProps } from 'antd'
import { closeDialog } from 'store/actions/dialogs'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { selectedDialog } from 'store/selectors/dialogs'

interface TaskViewProperties extends ModalProps {
    task: Task
	name: string
}

export default function TaskView({ task, name, ...props }: TaskViewProperties) {
	const dispatch = useDispatch()
	const isDialogOpened = useSelector(selectedDialog(name))
	const { t } = useTranslation()

	const handleClose = useCallback(() => {
		dispatch(closeDialog(name))
	}, [dispatch, name])

	return <Modal
		width="75vw"
		open={isDialogOpened}
		title={`#${task.id}`}
		onCancel={handleClose}
		footer={() => <>
			<Button type="primary" htmlType="submit" form={'task-form'+task.id}>{t('save')}</Button>
			<Button onClick={handleClose}>{t('close')}</Button>
		</>}
		{...props}
	>
		<div>{t('title')}: {task.title}</div>
		<div>{t('dueDate')}: {task.dueDate}</div>
		<div>{t('estimate')}: {task.estimate}</div>
		<div>{t('timeSpent')}: {task.timeSpent}</div>
		<div>{t('priority')}: {task.priority}</div>
		<div>{t('date')}: {task.date}</div>
		<div>{t('time')}: {task.time}</div>
		{task.repeatable ? <div>{t('repeatable')}:
			{t(`repeat.${task.repeatable.repeatType}`, { count: task.repeatable.repeatEvery })}
		</div> : <div>
			{t('status')}: {task.status}
		</div>}
		{task.checkList.length > 0 && <div>{t('checkList')}:
			<ul>{task.checkList.map(checkListItem => {
				return <li key={checkListItem.id}>{checkListItem.title}</li>
			})}</ul>
		</div>}
		{task.tags.length > 0 && <div>{t('tags')}:
			<ul>{task.tags.map(tag => {
				return <li key={tag}>{tag}</li>
			})}</ul>
		</div>}
	</Modal>
}
