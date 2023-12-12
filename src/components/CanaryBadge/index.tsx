import { useCallback, useEffect, useMemo, useState } from 'react'
import { getUserCanaryStatus } from 'components/CanaryBadge/server'
import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'
import { CanaryStatus } from 'components/CanaryBadge/types'
import { BugOutlined } from '@ant-design/icons'
import { useSession } from 'next-auth/react'
import { DEFAULT_CANARY_STATUS } from 'components/CanaryBadge/contants'

const badgeColors = {
	[CanaryStatus.publicBeta]: 'warning',
	[CanaryStatus.privateBeta]: 'error',
}

export default function CanaryBadge() {
	const { t } = useTranslation()
	const session = useSession()
	const [canaryStatus, setCanaryStatus] = useState<CanaryStatus>(DEFAULT_CANARY_STATUS)
	const badgeColor = useMemo(() => canaryStatus ? badgeColors[canaryStatus] : undefined, [canaryStatus])

	const handleCanaryStatus = useCallback(async (email: string) => {
		const status = await getUserCanaryStatus(email)

		setCanaryStatus(status)
	}, [])

	useEffect(() => {
		if (session && session.data && session.data.user && session.data.user.email) {
			handleCanaryStatus(session.data.user.email)
		}
	}, [handleCanaryStatus, session])

	return <Tag icon={<BugOutlined />} color={badgeColor}>{t(canaryStatus || CanaryStatus.publicBeta)}</Tag>
}