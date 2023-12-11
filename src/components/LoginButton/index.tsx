import { signIn, useSession } from 'next-auth/react'
import { Button } from 'antd'
import { useMemo } from 'react'
import ProfileMenu from 'components/ProfileMenu'
import { UserOutlined } from '@ant-design/icons'
export default function LoginButton() {
	const session = useSession()
	const isLoading = useMemo(() => session.status === 'loading', [session.status])

	console.log(session)

	if (session.status === 'authenticated') {
		return <ProfileMenu />
	}

	return <>
		<Button
			type="primary"
			ghost
			shape="circle"
			loading={isLoading}
			onClick={() => signIn()}
			icon={<UserOutlined />}
		/>
	</>

}