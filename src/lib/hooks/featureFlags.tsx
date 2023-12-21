import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react'
import {
	FeatureFlags,
	FeatureFlagsPhases,
	getAllFeatureFlags,
	getFeatureFlagsPhaseUsers
} from 'lib/server/featureFlags'
import { useSession } from 'next-auth/react'

export type FeatureFlagsContextType = {
	featureFlags: FeatureFlags
	phases: FeatureFlagsPhases
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType>({
	featureFlags: {},
	phases: {
		development: [],
		canary: [],
	},
})

export const FeatureFlagsProvider: FC<PropsWithChildren> = ({ children }) => {
	const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({})
	const [phases, setPhases] = useState<FeatureFlagsPhases>({
		development: [],
		canary: [],
	})

	useEffect(() => {
		const fetchFeatureFlags = async () => {
			const flags = await getAllFeatureFlags()
			setFeatureFlags(flags)
		}
		const fetchFFPhaseUsers = async () => {
			const phases = await getFeatureFlagsPhaseUsers()

			if (!phases) return

			setPhases(phases as FeatureFlagsPhases)
		}

		fetchFFPhaseUsers()
		fetchFeatureFlags()
	}, [])

	return <FeatureFlagsContext.Provider value={{ featureFlags, phases }}>
		{children}
	</FeatureFlagsContext.Provider>
}

export const useFeatureFlags = () => {
	return useContext(FeatureFlagsContext)
}
export function useFeatureFlag(name: string): boolean {
	const session = useSession()
	const { featureFlags, phases } = useFeatureFlags()
	const ffPhase = featureFlags[name]
	const userEmail = session.data?.user?.email
	const userPhase = useMemo(() => {
		if (!userEmail) return undefined

		if (phases.development.includes(userEmail)) return 'development'
		if (phases.canary.includes(userEmail)) return 'canary'

		return undefined
	}, [userEmail, phases])

	if (!ffPhase) return false

	switch (ffPhase) {
	case 'development': {
		return userPhase === 'development'
	}
	case 'canary': {
		return userPhase === 'development' || userPhase === 'canary'
	}
	case 'production': {
		return true
	}
	}
}