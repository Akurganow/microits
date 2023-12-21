'use server'
import { prisma } from 'lib/server/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/constants'

export async function getCurrentUser() {
	const session = await getServerSession(authOptions)

	if (!session || !session.user || !session.user.email) return null

	try {
		return prisma.user.findUnique({
			where: {
				email: session.user.email
			}
		})
	} catch (error) {
		console.error(error)
		return null
	}
}