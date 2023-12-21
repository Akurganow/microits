'use server'
import { getCurrentUser } from 'lib/server/user'
import { Tag, TagDiff } from 'types/tags'
import { prisma } from 'lib/server/prisma'
import { PartialWithId, RecursiveNullToOptional } from 'types/common'
import { Prisma } from '@prisma/client'

function serverTagToClientTag(tag: Awaited<ReturnType<typeof getUserServerTags>>[number]) {
	return {
		...tag,
		createdAt: tag.createdAt ? tag.createdAt?.getTime() : undefined,
		updatedAt: tag.updatedAt ? tag.updatedAt?.getTime() : undefined,
		deletedAt: tag.deletedAt ? tag.deletedAt?.getTime() : undefined,
	} as RecursiveNullToOptional<Tag>
}

function clientTagToServerTag(tag: PartialWithId<Tag>): Omit<Prisma.TagCreateInput, 'user'> {
	return {
		...tag,
		createdAt: tag.createdAt ? new Date(tag.createdAt) : undefined,
		updatedAt: undefined,
		deletedAt: tag.deletedAt ? new Date(tag.deletedAt) : undefined,
	} as Omit<Prisma.TagCreateInput, 'user'>
}

export async function createTag(data: Tag) {
	const user = await getCurrentUser()

	if (!user) return

	const isTagExists = await prisma.tag.findUnique({
		where: {
			id: data.id,
		},
	})

	if (isTagExists) {
		try {
			return prisma.tag.update({
				where: {
					id: data.id,
				},
				data: clientTagToServerTag(data),
			})
		} catch (error) {
			throw new Error(error)
		}
	} else {
		try {
			console.info('createTag:create:start', data)
			return prisma.tag.create({
				data: {
					...clientTagToServerTag(data),
					userId: user.id,
				},
			})
		} catch (error) {
			throw new Error(error)
		}
	}
}

export async function createManyTags(tags: Tag[]) {
	const user = await getCurrentUser()

	if (!user) return

	const tagsToCreate = tags.map(tag => ({
		...clientTagToServerTag(tag),
		userId: user.id,
	}))

	try {
		console.info('createManyTags:create:start', tagsToCreate)
		return prisma.tag.createMany({
			data: tagsToCreate,
			skipDuplicates: true,
		})
	} catch (error) {
		throw new Error(error)
	}
}

export async function updateManyTags(tags: PartialWithId<Tag>[]) {
	const user = await getCurrentUser()

	if (!user) return

	for (const tag of tags) {
		if (tag) {
			const isTagExists = await prisma.tag.findUnique({
				where: {
					id: tag.id,
				},
			})

			if (!isTagExists) {
				await createTag(tag as Tag)
				continue
			}

			try {
				console.info('updateManyTags:update:start', tag)
				await prisma.tag.update({
					where: {
						id: tag.id,
					},
					data: clientTagToServerTag(tag),
				})
			} catch (error) {
				throw new Error(error)
			}
		}
	}
}

export async function deleteManyTags(ids: string[]) {
	const user = await getCurrentUser()

	if (!user) return

	try {
		console.info('deleteManyTags:delete:start', ids)
		return prisma.tag.updateMany({
			where: {
				id: {
					in: ids,
				},
			},
			data: {
				deletedAt: new Date(),
			},
		})
	} catch (error) {
		throw new Error(error)
	}
}

export async function getUserServerTags() {
	const user = await getCurrentUser()

	if (!user) return []

	return prisma.tag.findMany({
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
}

export async function getUserTags() {
	const serverTags = await getUserServerTags()

	return serverTags.map(tag => serverTagToClientTag(tag))
}

export async function getServerTagsDiff(lastUpdate?: Date) {
	const user = await getCurrentUser()
	const diff: TagDiff = {
		update: [],
		create: [],
		delete: [],
	}

	if (!user) return diff

	if (!lastUpdate) {
		const tags = await getUserServerTags()

		return {
			...diff,
			create: tags,
		} as unknown as TagDiff
	}

	try {
		console.debug('getServerTagsDiff:start')
		const createdTags = await prisma.tag.findMany({
			where: {
				AND: [
					{ userId: user.id },
					{ createdAt: { gt: lastUpdate } },
					{
						OR: [
							{ deletedAt: null },
							{ deletedAt: undefined },
						]
					},
				],
			},
		})
		const updatedTags = await prisma.tag.findMany({
			where: {
				AND: [
					{ userId: user.id },
					{ updatedAt: { gt: lastUpdate } },
					{
						OR: [
							{ deletedAt: null },
							{ deletedAt: undefined },
						]
					},
				],
			},
		})
		const deletedTags = await prisma.tag.findMany({
			where: {
				AND: [
					{ userId: user.id },
					{ deletedAt: { gt: lastUpdate } },
				],
			},
			select: {
				id: true,
			},
		})

		diff.create = createdTags.map(serverTagToClientTag)
		diff.update = updatedTags.map(serverTagToClientTag)
		diff.delete = deletedTags.map(tag => tag.id)

		return diff
	} catch (error) {
		throw new Error(error)
	}
}

export async function getLastServerUpdate() {
	const user = await getCurrentUser()
	if (!user)
		return
	const tag = await prisma.tag.findFirst({
		where: {
			userId: user.id
		},
		select: {
			updatedAt: true,
			deletedAt: true,
			createdAt: true,
		},
		orderBy: [
			{ createdAt: 'desc' },
			{ updatedAt: 'desc' },
			{ deletedAt: 'desc' },
		],
	})

	if (!tag) return

	const { updatedAt, deletedAt, createdAt } = tag
	const lastUpdate = Math.max.apply(null, [
		updatedAt?.getTime() || 0,
		deletedAt?.getTime() || 0,
		createdAt.getTime(),
	])

	return lastUpdate ? new Date(lastUpdate) : undefined
}

export async function performClientDiff(clientDiff: TagDiff, lastServerUpdate: Date) {
	const user = await getCurrentUser()

	if (!user) return

	const { create, update, delete: deleted } = clientDiff

	if (create && create.length > 0) {
		console.debug('performClientDiff:create', create)
		await createManyTags(create.map(tag => ({ ...tag, userId: user.id })))
	}
	if (update && update.length > 0) {
		console.debug('performClientDiff:update', update)
		await updateManyTags(update)
	}
	if (deleted && deleted.length > 0) {
		console.debug('performClientDiff:delete', deleted)
		await deleteManyTags(deleted)
	}
	const serverDiff = await getServerTagsDiff(lastServerUpdate)
	const newServerUpdate = await getLastServerUpdate()
	console.info('performClientDiff:newServerUpdate', newServerUpdate?.toISOString())
	return {
		diff: serverDiff,
		lastServerUpdate: newServerUpdate
	}
}