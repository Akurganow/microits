'use client'
import LogRocket from 'logrocket'
import setupLogRocketReact from 'logrocket-react'
import useUser from 'lib/hooks/user'

export default function LogRocketComponent() {
	const user = useUser()

	if (typeof window !== 'undefined') {
		LogRocket.init('xm5w3t/alexenda')
		setupLogRocketReact(LogRocket)
	}

	if (user && user.email && typeof window !== 'undefined') {
		LogRocket.identify(user.id, {
			name: user.name || user.email,
			email: user.email,
			env: process.env.NODE_ENV,
		})
	}

	return null
}