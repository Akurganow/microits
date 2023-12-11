import { signOut, useSession } from 'next-auth/react'
import { Button, Dropdown, Image, MenuProps } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProfileMenu() {
	const { t } = useTranslation()
	const session = useSession()
	const image = useMemo(() => session.data?.user?.image ?? '/logo500.png', [session.data?.user?.image])
	const menuItems: MenuProps['items'] = useMemo(() => ([
		{
			type: 'divider',
		},
		{
			key: 'signout',
			label: t('signout'),
			onClick: () => signOut(),
		},
	]), [t])
	const menuProps: MenuProps = useMemo(() => ({
		items: menuItems,
	}), [menuItems])

	return <Dropdown menu={menuProps}>
		<Button
			shape="circle"
			style={{ padding: 0, border: 'none' }}
			icon={<Image
				alt=""
				src={image}
				width={32}
				height={32}
				preview={false}
				style={{
					cursor: 'pointer',
					borderRadius: '50%',
				}}
			/>}
		/>
	</Dropdown>
}