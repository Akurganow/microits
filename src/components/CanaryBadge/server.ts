'use server'
import { get } from '@vercel/edge-config'
import { CanaryConfig, CanaryStatus } from 'components/CanaryBadge/types'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/constants'

export async function getCanaryStatus(): Promise<CanaryStatus | null> {
	const session = await getServerSession(authOptions)

	if (!session?.user?.email) {
		return null
	}

	const edgeConfig = await get<CanaryConfig>('canary')

	if (edgeConfig?.privateBeta?.emails?.includes(session.user.email)) {
		return CanaryStatus.privateBeta
	}

	if (edgeConfig?.publicBeta?.emails?.includes(session.user.email)) {
		return CanaryStatus.publicBeta
	}

	return null
}