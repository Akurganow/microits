'use server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type User = {
    name: string
    email: string
}

export async function addUser({ name, email }: User) {
	const user = await prisma.user.create({
		data: {
			name,
			email,
		},
	})
	return user
}

export async function getUsers() {
	const users = await prisma.user.findMany()
	return users
}
