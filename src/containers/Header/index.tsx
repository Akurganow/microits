import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Flex, Layout, Tooltip } from 'antd'
import Logo from 'components/Logo'
import { openDialog } from 'store/actions/dialogs'
import * as st from './styles.module.css'
import { useTranslation } from 'react-i18next'

export default function Header() {
	const dispatch = useDispatch()
	const { t } = useTranslation()

	const handleOpenNewTaskDialog = useCallback(() => {
		dispatch(openDialog('new-task'))
	}, [dispatch])

	return <Layout.Header className={st.header}>
		<Flex justify="space-between" align="center">
			<Logo />
			<Tooltip title={t('addNewTask')}>
				<Button type="primary" size="middle" onClick={handleOpenNewTaskDialog}>
					{t('add')}
				</Button>
			</Tooltip>
		</Flex>
	</Layout.Header>
}
