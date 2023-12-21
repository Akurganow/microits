'use server'
// import { PrismaClient } from '@prisma/client'
import { createClient } from 'contentful'

// const prisma = new PrismaClient()
//
// type User = {
//     name: string
//     email: string
// }
//
// export async function getUsers() {
// 	const users = await prisma.user.findMany()
// 	return users as User[]
// }

const client = createClient({
	space: process.env.CF_SPACE_ID as string, // ID of a Compose-compatible space to be used \
	accessToken: process.env.CF_DELIVERY_ACCESS_TOKEN as string, // delivery API key for the space \
})

type EmptyHintsParams = {
	locale: string
}

type EmptyHint = {
	contentTypeId: string
	images: string[]
	text: string
	button: string
	fields: {
		title: string
		description: string
		estimate: number
		date: string
		dueDate: string
		tags: string[]
		checklist: string[]
	}
}

export default async function getLogo(params: EmptyHintsParams) {
	const query = {
		locale: params.locale,
	}

	return await client.getEntries<EmptyHint>(query)
}
