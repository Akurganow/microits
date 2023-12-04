import { Button, Input, message, Modal, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { selectedDialog } from 'store/selectors/dialogs'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { closeDialog } from 'store/actions/dialogs'
import { ApiTwoTone, FileExcelTwoTone, SaveTwoTone } from '@ant-design/icons'
import { selectedTasks } from 'store/selectors/tasks'
import { downloadArrayAsJSON } from 'utils/files'
import { selectedOpenAI } from 'store/selectors/settings'
import { setOpenAIApiKey, setOpenAIUserId } from 'store/actions/settings'
import { importTasks } from 'store/actions/tasks'

export default function Exports() {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const [messageApi] = message.useMessage()
	const isDialogOpened = useSelector(selectedDialog('export'))
	const tasks = useSelector(selectedTasks)
	const { apiKey, userId } = useSelector(selectedOpenAI)
	const fileName = useMemo(() => `Alexenda-tasks-${new Date().toISOString()}`, [])
	const [apiKeyValue, setAPIKeyValue] = useState(apiKey)

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

	const handleAPIKeySave = useCallback(async () => {
		dispatch(setOpenAIApiKey(apiKeyValue))
		messageApi.success(t('apiKeySaved'))
	}, [apiKeyValue, dispatch, messageApi, t])

	const handleAPIKeyChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setAPIKeyValue(event.target.value)
	}, [])

	useEffect(() => {
		if (!userId) {
			dispatch(setOpenAIUserId())
		}
	}, [dispatch, userId])
    
	return <Modal
		width="60vw"
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
				<Input
					name="apiKey"
					onChange={handleAPIKeyChange}
					placeholder={t('apiKey')}
					prefix={<ApiTwoTone />}
					value={apiKeyValue}
					onPressEnter={handleAPIKeySave}
				/>
				<Button onClick={handleAPIKeySave}>
					<SaveTwoTone />
				</Button>
			</Space.Compact>

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