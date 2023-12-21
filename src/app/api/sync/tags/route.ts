import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/constants'
import { createTag, getLastServerUpdate, getServerTagsDiff, getUserTags } from 'lib/tags/server'
import { Tag } from 'types/tags'

export async function GET() {
	const session = await getServerSession(authOptions)

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const tags = await getUserTags()

	return NextResponse.json(tags, { status: 200 })
}

interface RequestBody {
	tags: Tag[]
	lastServerUpdate: Date
}

export async function POST(request: NextRequest) {
	const session = await getServerSession(authOptions)

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await request.json() as RequestBody
	console.info('sync:body', body)

	try {
		await Promise.all(body.tags.map(async (tag) =>
			await createTag(tag)
		))
	} catch (error) {
		console.error('sync:createManyTags:error', error)

		return NextResponse.json({ error }, { status: 500 })
	}

	try {
		const diff = await getServerTagsDiff(body.lastServerUpdate)
		const lastServerUpdate = await getLastServerUpdate()

		return NextResponse.json({ diff, lastServerUpdate }, { status: 200 })
	} catch (error) {
		console.error('sync:performClientDiff:error', error)

		return NextResponse.json({ error }, { status: 500 })
	}
}