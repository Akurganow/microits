'use client'
import { useEffect, useState } from 'react'
import { getCurrentUser } from 'lib/server/user'
import { User } from '@prisma/client'

export default function useUser() {
	const [user, setUser] = useState<null | User>(null)

	useEffect(() => {
		getCurrentUser().then(setUser)
	}, [])
    
	return user
}