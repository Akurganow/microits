'use client'
import { Form, Input, message, Modal } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { selectedDialog } from 'store/selectors/dialogs'
import { useCallback, useEffect, useMemo } from 'react'
import { closeDialog } from 'store/actions/dialogs'
import { setOpenAIUserId, setSettings } from 'store/actions/settings'
import { selectedOpenAI } from 'store/selectors/settings'
import { SettingsState } from 'types/settings'
import { RecursivePartial } from 'types/common'

export default function Settings() {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const [messageApi] = message.useMessage()
	const isDialogOpened = useSelector(selectedDialog('settings'))
	const { apiKey, userId } = useSelector(selectedOpenAI)
	const [form] = Form.useForm()
	const initialValues: RecursivePartial<SettingsState> = useMemo(() => ({
		openAI: {
			apiKey,
		},
	}), [apiKey])

	form.setFieldsValue(initialValues)

	const handleClose = useCallback(() => {
		dispatch(closeDialog('settings'))
	}, [dispatch])

	const handleFormSubmit = useCallback(async (values: typeof initialValues) => {
		dispatch(setSettings(values))
		dispatch(closeDialog('settings'))
		messageApi.success(t('settingsSaved'))
	}, [dispatch, messageApi, t])

	useEffect(() => {
		if (!userId || userId.length === 0) {
			dispatch(setOpenAIUserId())
		}
	}, [dispatch, userId])

	return <Modal
		forceRender
		title="Settings"
		width="50vw"
		open={isDialogOpened}
		okButtonProps={{ htmlType: 'submit', form: 'settings-form' }}
		okText={t('save')}
		onCancel={handleClose}
	>
		<Form
			form={form}
			id="settings-form"
			onFinish={handleFormSubmit}
		>
			<Form.Item
				required
				name={['openAI', 'apiKey']}
				label={t('openAI.apiKey')}
				tooltip={<span>{t('openAI.apiKeyTooltip')} <a target="_blank" href='https://platform.openai.com/api-keys' rel="noreferrer">{t('openAI.apiKeyLink')}</a></span>}
			>
				<Input />
			</Form.Item>
		</Form>
	</Modal>
}