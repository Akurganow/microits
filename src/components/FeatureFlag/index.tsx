import { PropsWithChildren, ReactNode } from 'react'
import { useFeatureFlag } from 'lib/hooks/featureFlags'

type FeatureFlagProps = {
    name: string
    fallback?: ReactNode
}

export default function FeatureFlag({ children, name, fallback }: PropsWithChildren<FeatureFlagProps>) {
	const flag = useFeatureFlag(name)

	return flag ? children : fallback ?? null
}