import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Layout, Tooltip } from 'antd'
import Logo from 'components/Logo'
import { openDialog } from 'store/actions/dialogs'
import { TAGS_MODAL_NAME } from 'store/constants/tags'
import * as st from './styles.module.css'

export default function Header() {
	const dispatch = useDispatch()
	const { t } = useTranslation()

	const handleOpenDialog = useCallback((name: string) => () => {
		dispatch(openDialog(name))
	}, [dispatch])

	return <Layout.Header className={st.header}>
		<Flex justify="space-between" align="center">
			<Logo />
			<Tooltip title={t('addNewTask')}>
				<Flex align="flex-start" gap="small" wrap="wrap" >
					<Button size="middle" onClick={handleOpenDialog(TAGS_MODAL_NAME)}>
						{t('tags')}
					</Button>
					<Button type="primary" size="middle" onClick={handleOpenDialog('new-task')}>
						{t('add')}
					</Button>
				</Flex>
			</Tooltip>
		</Flex>
	</Layout.Header>
}
