import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCanaryStatus } from 'components/CanaryBadge/server'
import { useTranslation } from 'react-i18next'
import { Tag } from 'antd'
import { CanaryStatus } from 'components/CanaryBadge/types'
import { BugOutlined } from '@ant-design/icons'

const badgeColors = {
	[CanaryStatus.publicBeta]: 'warning',
	[CanaryStatus.privateBeta]: 'error',
}

export default function CanaryBadge() {
	const { t } = useTranslation()
	const [canaryStatus, setCanaryStatus] = useState<CanaryStatus | null>(null)
	const badgeColor = useMemo(() => canaryStatus ? badgeColors[canaryStatus] : undefined, [canaryStatus])

	const handleCanaryStatus = useCallback(async () => {
		const status = await getCanaryStatus()

		setCanaryStatus(status)
	}, [])

	useEffect(() => {
		handleCanaryStatus()
	}, [handleCanaryStatus])

	return canaryStatus ? <Tag icon={<BugOutlined />} color={badgeColor}>{t(canaryStatus)}</Tag> : null
}