import { Button, Input, message, Modal, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { selectedDialog } from 'store/selectors/dialogs'
import { ChangeEvent, useCallback, useMemo } from 'react'
import { closeDialog } from 'store/actions/dialogs'
import { FileExcelTwoTone } from '@ant-design/icons'
import { selectedTasks } from 'store/selectors/tasks'
import { downloadArrayAsJSON } from 'utils/files'
import { importTasks } from 'store/actions/tasks'

export default function Exports() {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const [messageApi] = message.useMessage()
	const isDialogOpened = useSelector(selectedDialog('export'))
	const tasks = useSelector(selectedTasks)
	const fileName = useMemo(() => `Alexenda-tasks-${new Date().toISOString()}`, [])

	const handleClose = useCallback(() => {
		dispatch(closeDialog('export'))
	}, [dispatch])

	const handleDownload = useCallback(() => {
		downloadArrayAsJSON(tasks, fileName)
	}, [fileName, tasks])

	const handleUpload = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files?.length) return

		const fileReader = new FileReader()
		fileReader.readAsText(event.target.files[0], 'UTF-8')
		fileReader.onload = e => {
			const { result } = e.target as FileReader

			if (!result) return

			try {
				const tasks = JSON.parse(result.toString())
				dispatch(importTasks(tasks))
				messageApi.success(t('tasksImported'))
			} catch (error) {
				messageApi.error(error.message)
			}
		}
	}, [dispatch, messageApi, t])
    
	return <Modal
		width="50vw"
		open={isDialogOpened}
		title={t('export')}
		onCancel={handleClose}
		okButtonProps={{}}
		getContainer="#dialog"
		destroyOnClose={true}
		footer={null}
	>
		<Space direction="vertical">
			<Space.Compact>
				<Button
					icon={<FileExcelTwoTone />}
					onClick={handleDownload}
				>
					{t('downloadTasks')}
				</Button>

				<Input
					type="file"
					accept="application/json"
					onChange={handleUpload}
				/>
			</Space.Compact>
		</Space>
	</Modal>
}