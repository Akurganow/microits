import { Button, Card, Form, Input, Modal, Tooltip } from 'antd'
import { FundTwoTone } from '@ant-design/icons'
import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectedOpenAI } from 'store/selectors/settings'
import { selectedTasks } from 'store/selectors/tasks'
import { selectedAllTags } from 'store/selectors/tags'
import { useTranslation } from 'react-i18next'
import { useChat } from 'ai/react'
import st from './styles.module.css'
import cn from 'classnames'
import Markdown from 'react-markdown'

export default function AnalyzeButton() {
	const { t, i18n } = useTranslation()
	const locale = useMemo(() => i18n.resolvedLanguage || i18n.language,[i18n.language, i18n.resolvedLanguage])
	const { userId } = useSelector(selectedOpenAI)
	const tasks = useSelector(selectedTasks)
	const tags = useSelector(selectedAllTags)
	const [isAnalyseModalOpened, setIsAnalyseModalOpened] = useState(false)
	const { messages, handleInputChange, handleSubmit, input, isLoading } = useChat({
		api: '/api/analyze',
		body: {
			locale,
			userId,
			tasks,
			tags,
		},
		initialInput: '',
		onResponse: res => {
			console.info('AnalyzeButton.onResponse', res)
		},
		onFinish: message => {
			console.info('AnalyzeButton.onFinish', message)
		},
		onError: error => {
			console.error(error)
		}
	})

	const handleOpenAnalysis = useCallback(() => {
		setIsAnalyseModalOpened(true)
	}, [])
    
	return <>
		<Modal
			width="40%"
			open={isAnalyseModalOpened}
			onCancel={() => setIsAnalyseModalOpened(false)}
			title={t('analysisModalTitle')}
			footer={null}
		>
			<div className={st.messages}>
				{messages.map(m => (
					<Card
						key={m.id}
						size="small"
						className={cn(st.message, {
							[st.user]: m.role === 'user',
							[st.bot]: m.role !== 'user',
						})}
					>
						<Markdown>{m.content}</Markdown>
					</Card>
				))}
			</div>

			<form id="analyzerForm" onSubmit={handleSubmit} className={st.form}>
				<Form.Item>
					<Input value={input} onChange={handleInputChange} />
				</Form.Item>

				<Button type="primary" htmlType="submit">
					{t('analyzer.send')}
				</Button>
			</form>
		</Modal>

		<Tooltip title={t('analyzeTooltip')}>
			<Button
				ghost
				type="primary"
				size="middle"
				onClick={handleOpenAnalysis}
				loading={isLoading}
				icon={<FundTwoTone/>}
			>
				{t('startAnalyze')}
			</Button>
		</Tooltip>
	</>
}