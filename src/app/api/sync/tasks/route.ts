import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/constants'
import { getUserTasks, performClientDiff } from 'lib/tasks/server'
import { TaskDiff } from 'types/tasks'

export async function GET() {
	const session = await getServerSession(authOptions)

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const tasks = await getUserTasks()

	return NextResponse.json(tasks, { status: 200 })
}

interface RequestBody {
	diff: TaskDiff
	lastServerUpdate: Date
}

export async function POST(request: NextRequest) {
	const session = await getServerSession(authOptions)

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const body = await request.json() as RequestBody

	try {
		const serverDiff = await performClientDiff(body.diff, body.lastServerUpdate)

		return NextResponse.json(serverDiff, { status: 200 })
	} catch (error) {
		console.error('sync:performClientDiff:error', error)

		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}