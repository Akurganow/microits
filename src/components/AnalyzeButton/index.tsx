import Markdown from 'react-markdown'
import { Button, message, Modal, Tooltip } from 'antd'
import { FundTwoTone } from '@ant-design/icons'
import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectedOpenAI } from 'store/selectors/settings'
import { selectedTasks } from 'store/selectors/tasks'
import { selectedAllTags } from 'store/selectors/tags'
import { blue, green } from '@ant-design/colors'
import { useTranslation } from 'react-i18next'
import { json2csv } from 'json-2-csv'

export default function AnalyzeButton() {
	const { t, i18n } = useTranslation()
	const translation = useMemo(() => i18n.store.data[i18n.resolvedLanguage || i18n.language].translation, [i18n.language, i18n.resolvedLanguage, i18n.store.data])
	const [messageApi, contextHolder] = message.useMessage()
	const { apiKey, userId } = useSelector(selectedOpenAI)
	const tasks = useSelector(selectedTasks)
	const tags = useSelector(selectedAllTags)
	const [isAnalyzing, setIsAnalyzing] = useState(false)
	const [analysis, setAnalysis] = useState('')
	const [isAnalyseModalOpened, setIsAnalyseModalOpened] = useState(false)
	const analysisReady = !isAnalyzing && analysis && analysis.length > 0
	const analyseMessage = useMemo(() => t('analyzerMessage', { tasks: json2csv(tasks), tags: json2csv(tags), format: 'CSV' }), [t, tasks, tags])
	const analyseButtonColor = useMemo(() => analysisReady ? green.primary : blue.primary, [analysisReady])

	const handleOpenAnalysis = useCallback(() => {
		setIsAnalyseModalOpened(true)
	}, [])

	const handleStartAnalysis = useCallback(async () => {
		if (!apiKey) {
			messageApi.error(t('apiKeyNotSet'))
			return
		}

		setIsAnalyzing(true)

		try {
			const resp = await fetch('/api/analyzer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					message: analyseMessage,
					systemMessage: t('analyzerSystemMessage', { translation }), apiKey, userId }),
			}).then((r) => r.json())

			setAnalysis(resp.message)
			messageApi.success(t('analysisReady'))
			setIsAnalyzing(false)
		} catch (error) {
			messageApi.error(error.message)
			setIsAnalyzing(false)
		}
	}, [analyseMessage, apiKey, messageApi, t, translation, userId])

	const handleRestartAnalysis = useCallback(() => {
		setIsAnalyseModalOpened(false)
		setAnalysis('')
		handleStartAnalysis()
	}, [handleStartAnalysis])
    
	return <>
		{contextHolder}

		<Modal
			open={isAnalyseModalOpened}
			onCancel={() => setIsAnalyseModalOpened(false)}
			onOk={handleRestartAnalysis}
			title={t('analysisModalTitle')}
			okText={t('restartAnalyze')}
		>
			<Markdown>{analysis}</Markdown>
		</Modal>

		<Tooltip title={t('analyzeTooltip')}>
			<Button
				ghost
				type="primary"
				size="middle"
				style={{
					borderColor: analyseButtonColor,
					color: analyseButtonColor,
				}}
				onClick={analysisReady ? handleOpenAnalysis : handleStartAnalysis}
				loading={isAnalyzing}
				icon={<FundTwoTone twoToneColor={analyseButtonColor} />}
			>
				{analysisReady
					? t('openAnalysis')
					: isAnalyzing
						? t('analyzeInProgress')
						: t('startAnalyze')}
			</Button>
		</Tooltip>
	</>
}