import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Layout, Tooltip } from 'antd'
import Logo from 'components/Logo'
import { openDialog } from 'store/actions/dialogs'
import { TAGS_MODAL_NAME } from 'store/constants/tags'
import st from './styles.module.css'
import AnalyzeButton from 'components/AnalyzeButton'
import LoginButton from 'components/LoginButton'
import { useAppDispatch } from 'src/store'
import FeatureFlag from 'components/FeatureFlag'

export default function Header() {
	const dispatch = useAppDispatch()

	const { t } = useTranslation()
	
	const handleOpenDialog = useCallback((name: string) => () => {
		dispatch(openDialog(name))
	}, [dispatch])

	return <>
		<Layout.Header className={st.header}>
			<Flex justify="space-between" align="center">
				<Logo />

				<Flex align="flex-start" gap="small" wrap="wrap" style={{ padding: '8px 0' }}>
					<FeatureFlag name="dev">
						<AnalyzeButton />
					</FeatureFlag>

					<FeatureFlag name="export">
						<Button size="middle" onClick={handleOpenDialog('export')}>
							{t('export')}
						</Button>
					</FeatureFlag>

					<FeatureFlag name="settings">
						<Button size="middle" onClick={handleOpenDialog('settings')}>
							{t('settings')}
						</Button>
					</FeatureFlag>

					<Button size="middle" onClick={handleOpenDialog(TAGS_MODAL_NAME)}>
						{t('tags')}
					</Button>

					<Tooltip title={t('addNewTask')}>
						<Button type="primary" size="middle" onClick={handleOpenDialog('new-task')}>
							{t('add')}
						</Button>
					</Tooltip>

					<FeatureFlag name="auth">
						<LoginButton />
					</FeatureFlag>
				</Flex>
			</Flex>
		</Layout.Header>
	</>
}
