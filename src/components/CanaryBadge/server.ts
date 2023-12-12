'use server'
import { get } from '@vercel/edge-config'
import { BetaEmails, CanaryStatus } from 'components/CanaryBadge/types'
import { DEFAULT_CANARY_STATUS } from 'components/CanaryBadge/contants'

export async function getUserCanaryStatus(email: string): Promise<CanaryStatus> {
	const betaEmails = await get<BetaEmails>('privateBetaEmails')

	if (betaEmails?.includes(email)) {
		return CanaryStatus.privateBeta
	}

	return DEFAULT_CANARY_STATUS
}