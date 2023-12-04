import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Layout, Tooltip } from 'antd'
import Logo from 'components/Logo'
import { openDialog } from 'store/actions/dialogs'
import { TAGS_MODAL_NAME } from 'store/constants/tags'
import st from './styles.module.css'
import DevMode from 'components/DevMode'
import AnalyzeButton from 'components/AnalyzeButton'

export default function Header() {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	
	const handleOpenDialog = useCallback((name: string) => () => {
		dispatch(openDialog(name))
	}, [dispatch])

	return <>
		<Layout.Header className={st.header}>
			<Flex justify="space-between" align="center">
				<Logo />

				<Flex align="flex-start" gap="small" wrap="wrap" style={{ padding: '8px 0' }}>
					<DevMode>
						<AnalyzeButton />
					</DevMode>

					<DevMode>
						<Button size="middle" onClick={handleOpenDialog('export')}>
							{t('export')}
						</Button>
					</DevMode>

					<DevMode>
						<Button size="middle" onClick={handleOpenDialog('settings')}>
							{t('settings')}
						</Button>
					</DevMode>

					<Button size="middle" onClick={handleOpenDialog(TAGS_MODAL_NAME)}>
						{t('tags')}
					</Button>

					<Tooltip title={t('addNewTask')}>
						<Button type="primary" size="middle" onClick={handleOpenDialog('new-task')}>
							{t('add')}
						</Button>
					</Tooltip>
				</Flex>
			</Flex>
		</Layout.Header>
	</>
}
