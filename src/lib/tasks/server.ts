'use server'
import { prisma, PrismaModels } from 'lib/server/prisma'
import { Prisma } from '@prisma/client'
import { getCurrentUser } from 'lib/server/user'
import type { Task, TaskDiff, TaskRepeatable } from 'types/tasks'
import { RecursiveNullToOptional, RecursivePartial } from 'types/common'

type ClientTask = RecursivePartial<Omit<Task, 'id'>> & Pick<Task, 'id'>

function serverTaskToClientTask(task: Awaited<ReturnType<typeof getUserServerTasks>>[number]): Task {
	return {
		...task,
		repeatable: task.repeatable as TaskRepeatable | undefined,
		checklist: (task.checklist as Task['checklist'])?.map(item => ({
			...item,
		} as Task['checklist'][number])),
		createdAt: task.createdAt?.toString(),
		updatedAt: task.updatedAt?.toString(),
		deletedAt: task.deletedAt?.toString(),
	} as RecursiveNullToOptional<Task>
}

function clientTaskToServerTask(task: ClientTask): Omit<Prisma.TaskCreateInput, 'user'> {
	return {
		...task,
		createdAt: task.createdAt ? new Date(task.createdAt) : undefined,
		updatedAt: task.updatedAt ? new Date(task.updatedAt) : undefined,
		deletedAt: task.deletedAt ? new Date(task.deletedAt) : undefined,
	} as Omit<Prisma.TaskCreateInput, 'user'>
}

export async function createManyTasks(data: Prisma.TaskCreateManyInput[]) {
	const ids: string[] = data.map(task => task.id).filter(Boolean) as string[]
	const existingIds = (await prisma.task.findMany({
		where: {
			id: {
				in: ids as string[],
			},
		},
		select: {
			id: true,
		},
	})).map(task => task.id)

	const updatedTasks = data.filter(task => existingIds.includes(task.id as string))
	const newTasks = data.filter(task => !existingIds.includes(task.id as string))

	if (updatedTasks.length > 0) {
		await updateManyTasks(updatedTasks as ClientTask[])
	}

	try {
		console.debug('createManyTasks: start', data)
		return prisma.task.createMany({
			data: newTasks,
		})
	} catch (error) {
		throw new Error(error)
	}
}

export async function updateManyTasks(tasks: ClientTask[]) {
	console.debug('updateManyTasks:start', tasks)

	for (const task of tasks) {
		if (task.id) {
			try {
				console.debug('updateManyTasks:update', task)
				await prisma.task.update({
					where: { id: task.id },
					data: clientTaskToServerTask(task),
				})
			} catch (error) {
				throw new Error(error)
			}
		}
	}
}

export async function deleteManyTasks(ids: PrismaModels['Task']['id'][]) {
	const where = {
		id: {
			in: ids,
		},
	}

	try {
		console.debug('deleteManyTasks:start', ids)
		return prisma.task.updateMany({
			where,
			data: {
				deletedAt: new Date(),
			},
		})
	} catch (error) {
		throw new Error(error)
	}
}

export async function getUserServerTasks() {
	const user = await getCurrentUser()

	if (!user) return []

	try {
		console.debug('getUserServerTasks:start')
		return prisma.task.findMany({
			where: {
				AND: [
					{ userId: user.id },
					{
						OR: [
							{ deletedAt: null },
							{ deletedAt: undefined },
						]
					},
				],
			},
		})
	} catch (error) {
		throw new Error(error)
	}
}

export async function getServerTasksDiff(lastClientUpdate?: Date): Promise<TaskDiff> {
	const user = await getCurrentUser()
	const diff: TaskDiff = {
		update: [],
		create: [],
		delete: [],
	}

	if (!user) return diff

	if (!lastClientUpdate) {
		return {
			...diff,
			create: await getUserTasks(),
		}
	}

	try {
		console.debug('getServerTasksDiff:start')
		const createdTasks = await prisma.task.findMany({
			where: {
				AND: [
					{ userId: user.id },
					{ createdAt: { gt: lastClientUpdate } },
					{
						OR: [
							{ deletedAt: null },
							{ deletedAt: undefined },
						]
					},
				],
			},
		})
		console.debug('getServerTasksDiff:createdTasks', createdTasks)
		const updatedTasks = await prisma.task.findMany({
			where: {
				AND: [
					{ userId: user.id },
					{ updatedAt: { gt: lastClientUpdate } },
					{
						OR: [
							{ deletedAt: null },
							{ deletedAt: undefined },
						]
					},
				],
			},
		})
		console.debug('getServerTasksDiff:updatedTasks', updatedTasks)
		const deletedTasks = await prisma.task.findMany({
			where: {
				AND: [
					{ userId: user.id },
					{ deletedAt: { gt: lastClientUpdate } },
				],
			},
			select: {
				id: true,
			},
		})
		console.debug('getServerTasksDiff:deletedTasks', deletedTasks)

		diff.create = createdTasks.map(task => serverTaskToClientTask(task))
		diff.update = updatedTasks.map(task => serverTaskToClientTask(task))
		diff.delete = deletedTasks.map(task => task.id)

		return diff
	} catch (error) {
		throw new Error(error)
	}
}

export async function getUserTasks() {
	const serverTasks = await getUserServerTasks()
	console.debug('getUserTasks:serverTasks', serverTasks)
	return serverTasks.map(task => serverTaskToClientTask(task))
}

export async function getLastServerUpdate() {
	const user = await getCurrentUser()

	if (!user) return

	try {
		console.debug('getLastServerUpdate:start')
		const tasks = await prisma.task.findMany({
			where: {
				userId: user.id,
			},
			select: {
				updatedAt: true,
				deletedAt: true,
				createdAt: true,
			},
			orderBy: [
				{ updatedAt: 'desc' },
				{ deletedAt: 'desc' },
				{ createdAt: 'desc' },
			],
			take: 1,
		})

		if (tasks.length === 0) return

		return [
			tasks[0].updatedAt,
			tasks[0].deletedAt,
			tasks[0].createdAt,
		].filter(Boolean).sort()[0] || undefined
	} catch (error) {
		throw new Error(error)
	}
}

export async function performClientDiff(clientDiff: TaskDiff, lastClientUpdate: Date) {
	const user = await getCurrentUser()

	if (!user) return

	const { create, update, delete: deleted } = clientDiff

	if (create.length > 0) {
		console.debug('performClientDiff:create', create)
		await createManyTasks(create.map(task => ({
			...clientTaskToServerTask(task),
			userId: user.id,
		})))
	}

	if (update.length > 0) {
		console.debug('performClientDiff:update', update)
		await updateManyTasks(update)
	}

	if (deleted.length > 0) {
		console.debug('performClientDiff:delete', deleted)
		await deleteManyTasks(deleted)
	}

	const serverDiff = await getServerTasksDiff(lastClientUpdate)
	const newServerUpdate = await getLastServerUpdate()

	return {
		diff: serverDiff,
		lastServerUpdate: newServerUpdate
	}
}