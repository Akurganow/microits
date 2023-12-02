import { Button, Input, message, Modal, Space } from 'antd'
import Markdown from 'react-markdown'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { selectedDialog } from 'store/selectors/dialogs'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { closeDialog } from 'store/actions/dialogs'
import { ApiTwoTone, FileExcelTwoTone, FundTwoTone, SaveTwoTone } from '@ant-design/icons'
import { selectedTasks } from 'store/selectors/tasks'
import { downloadArrayAsCSV } from 'utils/files'
import { selectedOpenAI } from 'store/selectors/settings'
import { setOpenAIApiKey, setOpenAIUserId } from 'store/actions/settings'

export default function Exports() {
	const dispatch = useDispatch()
	const { t, i18n } = useTranslation()
	const [messageApi, contextHolder] = message.useMessage()
	const isDialogOpened = useSelector(selectedDialog('export'))
	const tasks = useSelector(selectedTasks)
	const { apiKey, userId } = useSelector(selectedOpenAI)
	const fileName = useMemo(() => `Alexenda-tasks-${new Date().toISOString()}`, [])
	const [isAnalyzing, setIsAnalyzing] = useState(false)
	const [apiKeyValue, setAPIKeyValue] = useState(apiKey)
	const [analysis, setAnalysis] = useState('')

	const handleClose = useCallback(() => {
		dispatch(closeDialog('export'))
	}, [dispatch])

	const handleDownload = useCallback(() => {
		downloadArrayAsCSV(tasks, fileName)
	}, [fileName, tasks])

	const handleAPIKeySave = useCallback(() => {
		dispatch(setOpenAIApiKey(apiKeyValue))
		messageApi.success(t('apiKeySaved'))
	}, [apiKeyValue, dispatch, messageApi, t])

	const handleAPIKeyChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setAPIKeyValue(event.target.value)
	}, [])

	const handleAnalyze = useCallback(async () => {
		setIsAnalyzing(true)

		if (!apiKey) {
			messageApi.error(t('apiKeyNotSet'))
			setIsAnalyzing(false)
			return
		}

		const message = `Please analyze next stringified json of tasks array "${JSON.stringify(tasks)}". For answer please use only "${t('currentLanguage')}" language`
		const { translation } = i18n.store.data[i18n.resolvedLanguage || i18n.language]
		console.log('message', { message, length: message.length, apiKey, userId })

		try {
			const resp = await fetch('/api/analyzer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message, apiKey, userId, translation }),
			}).then((r) => r.json())
			console.log('resp', resp.message)
			setAnalysis(resp.message)
			setIsAnalyzing(false)
		} catch (error) {
			messageApi.error(error.message)
			setIsAnalyzing(false)
		}
	}, [apiKey, i18n.language, i18n.resolvedLanguage, i18n.store.data, messageApi, t, tasks, userId])

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
		{contextHolder}
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
					onClick={handleAnalyze}
					loading={isAnalyzing}
				>
					<FundTwoTone /> {t('analyzeTasks')}
				</Button>
				<Button onClick={handleDownload}>
					<FileExcelTwoTone /> {t('downloadTasks')}
				</Button>
			</Space.Compact>
		</Space>

		{analysis && analysis.length > 0 && <Markdown>{analysis}</Markdown>}
	</Modal>
}