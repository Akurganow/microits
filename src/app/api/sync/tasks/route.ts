import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/constants'
import {
	createManyTasks,
	getLastServerUpdate,
	getServerTasksDiff,
	getUserTasks,
} from 'lib/tasks/server'
import { Task } from 'types/tasks'

export async function GET() {
	const session = await getServerSession(authOptions)

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const tasks = await getUserTasks()

	return NextResponse.json(tasks, { status: 200 })
}

interface RequestBody {
	tasks: Task[]
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
		await createManyTasks(body.tasks)
	} catch (error) {
		console.error('sync:createManyTasks:error', error)

		return NextResponse.json({ error }, { status: 500 })
	}

	try {
		const diff = await getServerTasksDiff(body.lastServerUpdate)
		const lastServerUpdate = await getLastServerUpdate()

		return NextResponse.json({ diff, lastServerUpdate }, { status: 200 })
	} catch (error) {
		console.error('sync:performClientDiff:error', error)

		return NextResponse.json({ error }, { status: 500 })
	}
}