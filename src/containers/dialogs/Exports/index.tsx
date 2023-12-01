import { Button, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { selectedDialog } from 'store/selectors/dialogs'
import { useCallback, useMemo } from 'react'
import { closeDialog } from 'store/actions/dialogs'
import { DownloadOutlined } from '@ant-design/icons'
import { selectedTasks } from 'store/selectors/tasks'
import { downloadArrayAsCSV } from 'utils/files'

export default function Exports() {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const isDialogOpened = useSelector(selectedDialog('export'))
	const tasks = useSelector(selectedTasks)
	const fileName = useMemo(() => `Alexenda-tasks-${new Date().toISOString()}`, [])

	const handleClose = useCallback(() => {
		dispatch(closeDialog('export'))
	}, [dispatch])

	const handleDownload = useCallback(() => {
		downloadArrayAsCSV(tasks, fileName)
	}, [fileName, tasks])
    
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
		<Button onClick={handleDownload}>
			<DownloadOutlined /> {t('downloadTasks')}
		</Button>
	</Modal>
}