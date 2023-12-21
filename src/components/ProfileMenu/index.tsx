import { signOut, useSession } from 'next-auth/react'
import { Button, Dropdown, Image, MenuProps } from 'antd'
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/store'
import { selectedIsSyncing, selectedLastServerUpdate } from 'store/selectors/tasks'
import { setIsTasksSyncing, syncTasksWithServer } from 'store/actions/tasks'
import st from './styles.module.css'
import cn from 'classnames'
import { selectedAutoSync } from 'store/selectors/settings'
import { useFeatureFlag } from 'lib/hooks/featureFlags'
import { LoadingOutlined, LogoutOutlined, SyncOutlined } from '@ant-design/icons'
import { syncTagsWithServer } from 'store/actions/tags'

const imageSize = 32

export default function ProfileMenu() {
	const dispatch = useAppDispatch()
	const { t } = useTranslation()
	const session = useSession()
	const syncFF = useFeatureFlag('sync')
	const autoSync = useAppSelector(selectedAutoSync)
	const lastServerUpdate = useAppSelector(selectedLastServerUpdate)
	const isSyncing = useAppSelector(selectedIsSyncing)
	const image = useMemo(() => session.data?.user?.image ?? '/logo500.png', [session.data?.user?.image])

	const handleSyncWithServer = useCallback(() => {
		if (autoSync) {
			dispatch(syncTasksWithServer({ lastServerUpdate }))
			dispatch(syncTagsWithServer({ lastServerUpdate }))
		} else {
			dispatch(setIsTasksSyncing(false))
		}
	}, [autoSync, dispatch, lastServerUpdate])

	const handleAutoSyncWithServer = useCallback(() => {
		if (!isSyncing) {
			handleSyncWithServer()
		}
	}, [handleSyncWithServer, isSyncing])

	const menuItems = useMemo(() => ([
		(syncFF && {
			key: 'sync',
			label: t('manualSync'),
			icon: isSyncing ? <LoadingOutlined /> : <SyncOutlined />,
			onClick: handleSyncWithServer,
			disabled: !session,
		}),
		{
			type: 'divider',
		},
		{
			key: 'signout',
			label: t('signout'),
			icon: <LogoutOutlined />,
			onClick: () => signOut(),
		},
	].filter(Boolean) as MenuProps['items']), [handleSyncWithServer, isSyncing, session, syncFF, t])
	const menuProps: MenuProps = useMemo(() => ({
		items: menuItems,
	}), [menuItems])
	const classNames = useMemo(() => cn(st.menu, {
		[st.syncing]: isSyncing,
	}), [isSyncing])

	useEffect(() => {
		const timeout = setTimeout(() => {
			handleAutoSyncWithServer()
		}, 60000)

		return () => clearTimeout(timeout)
	}, [lastServerUpdate, dispatch, handleSyncWithServer, handleAutoSyncWithServer])

	const ProfileImage = useMemo(() => (<>
		<svg className={st.loader} width={imageSize} height={imageSize}>
			<circle
				cx={imageSize / 2}
				cy={imageSize / 2}
				r={imageSize / 2 - 2}
				fill="transparent"
			/>
		</svg>

		<Image
			alt=""
			src={image}
			width={imageSize}
			height={imageSize}
			preview={false}
			className={st.image}
		/>
	</>), [image])

	return <Dropdown menu={menuProps}>
		<Button
			shape="circle"
			className={classNames}
			icon={ProfileImage}
		/>
	</Dropdown>
}