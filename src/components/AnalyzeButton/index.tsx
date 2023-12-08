import 'react-chat-elements/dist/main.css'
import { Button, Form, Input, Modal, Tooltip } from 'antd'
import { FundTwoTone } from '@ant-design/icons'
import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectedOpenAI } from 'store/selectors/settings'
import { selectedTasks } from 'store/selectors/tasks'
import { selectedAllTags } from 'store/selectors/tags'
import { useTranslation } from 'react-i18next'
import { useChat } from 'ai/react'
import { MessageBox } from 'react-chat-elements'

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
			{messages.map(m => (
				<MessageBox
					key={m.id}
					id={m.id}
					focus={false}
					forwarded={false}
					notch={false}
					retracted={false}
					status={m.role === 'user' ? 'sent' : 'received'}
					date={m.createdAt as Date}
					titleColor="rebeccapurple"
					removeButton={false}
					replyButton={false}
					type="text"
					position={m.role === 'user' ? 'right' : 'left'}
					text={m.content}
					title={m.role === 'user' ? t('chat.you') : t('chat.bot')}
				/>
			))}

			<form id="analyzerForm" onSubmit={handleSubmit}>
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