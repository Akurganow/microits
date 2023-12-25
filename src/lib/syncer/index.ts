import localForage from 'localforage'
import { Prisma } from '@prisma/client'
import { prisma } from 'lib/server/prisma'
import { Dispatch, Middleware, UnknownAction, isAction } from 'redux'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { getCurrentUser } from 'lib/server/user'
import { NextRequest, NextResponse } from 'next/server'
import { Diff } from 'types/common'

export type UnknownPayload = { id: string }
export type SyncPayload<T extends UnknownPayload> = {
	diff?: Diff<T>
	lastServerUpdate?: Date
}
export type SyncPayloadScope<T extends UnknownPayload> = Partial<{
	[K in Uncapitalize<Prisma.ModelName>]: SyncPayload<T> | SyncPayload<T>[]
}>

export type SyncConfig<T extends UnknownPayload> = {
	[K in string]: (action: unknown, state: unknown) => SyncPayloadScope<T>
}

type ModelName = 'tag' | 'task'

export class Syncer<S extends object> {
	private publicPath = '/syncer'
	private logStorage: LocalForage
	private config: SyncConfig<UnknownPayload>
	private ignoredActions: string[] = []
    
	constructor(storeName: string, version: number = 1) {
		this.logStorage = localForage.createInstance({
			name: 'syncerLog',
			storeName,
			version
		})
	}

	private isActionIgnored(action: UnknownAction) {
		return isAction(action) && !this.ignoredActions.some(ignoredAction =>
			action.type.includes(ignoredAction)
		)
	}

	public addIgnoredActions(actions: (string | UnknownAction)[]) {
		this.ignoredActions = this.ignoredActions.concat(actions.map(action => isAction(action) ? action.type : action))
		return this
	}

	public addCase<A extends ActionCreatorWithPayload<unknown>>(action: A, handler: (payload: ReturnType<A>['payload'], state: S) => SyncPayloadScope<UnknownPayload>) {
		if (isAction(action)) {
			this.config[action.type] = handler
		}

		return this
	}

	public async clearLog() {
		await this.logStorage.clear()
	}

	public async sync(state: S, scopeName: ModelName) {
		const scopeState = state[scopeName] || state[scopeName + 's']

		if (!scopeState || !scopeState.items) return {}

		const clientDiff: Diff<UnknownPayload> = {
			create: [],
			update: [],
			delete: [],
		}

		const log = await this.getScopeLog(scopeName)

		for (const logItem of log) {
			if (logItem?.diff) {
				const { create, update, delete: deleted } = logItem.diff
				const ids = [...(create || []), ...(update || [])].map(item => item.id).filter(Boolean) as string[]
				const existingItems = scopeState.items.filter((item: { id: string }) => ids.includes(item.id))
				const createdUpdated = [...(create || []), ...(update || [])]
				const created = createdUpdated.filter(item => existingItems.includes(item))
				const updated = createdUpdated.filter(item => !existingItems.includes(item))

				if (created.length > 0) {
					clientDiff.create!.push(...created)
				}
				if (updated.length > 0) {
					clientDiff.update!.push(...updated)
				}
				if (deleted) {
					clientDiff.delete!.push(...deleted)
				}
			}
		}

		const clientDiffPayload = {
			diff: clientDiff,
			lastServerUpdate: scopeState.lastServerUpdate || new Date(0),
		}

		await this.performClientDiff(scopeName, clientDiffPayload)
		await this.clearLog()

		return await this.getServerDiff(scopeName, clientDiffPayload.lastServerUpdate)
	}

	public async initialSync(state: S, scopeName: ModelName) {
		const scopeState = state[scopeName] || state[scopeName + 's']

		if (!scopeState || !scopeState.items) return

		try {
			const response = await fetch(this.publicPath, {
				method: 'POST',
				next: { revalidate: 360 },
				body: JSON.stringify({
					scopeName,
					items: scopeState.items,
					lastServerUpdate: scopeState.lastServerUpdate || new Date(0)
				}),
				headers: {
					'Content-Type': 'application/json',
				}
			})

			return await response.json()
		} catch (error) {
			console.error('startSync:performServerDiff:error', error)
		}

		return {}
	}

	public createReduxMiddleware(): Middleware {
		return (storeApi) => (next: Dispatch) => (action: UnknownAction) => {
			if (this.isActionIgnored(action)) {
				const state = storeApi.getState() as S
				const handler = this.config[action.type]

				if (handler) {
					const payload = handler(action, state)

					if (payload) {
						this.logStorage.setItem(action.type, payload)
					}
				}
			}

			return next(action)
		}
	}

	private async getScopeLog(scopeName: string) {
		const log = await this.logStorage.keys()

		return await Promise.all(log
			.filter(key => key.startsWith(scopeName))
			.map(async (key) => {
				return await this.logStorage.getItem<SyncPayload<UnknownPayload>>(key)
			}))
	}

	private async getLastServerUpdate(scopeName: ModelName) {
		const user = await getCurrentUser()

		if (!user) return

		const db = prisma[scopeName as Prisma.ModelName]

		try {
			console.debug('getLastServerUpdate:start')
			const tasks = await db.findMany({
				where: {
					userId: user.id,
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
				take: 1,
			})

			if (tasks.length === 0) return

			const lastUpdate = Math.max.apply(null, [
				tasks[0].updatedAt,
				tasks[0].deletedAt,
				tasks[0].createdAt,
			]
				.filter(Boolean)
				.map(date => new Date(date!).getTime()))
			console.debug('getLastServerUpdate:end', lastUpdate)
			return lastUpdate ? new Date(lastUpdate) : undefined
		} catch (error) {
			throw new Error(error)
		}
	}

	private async getServerDiff(scopeName: ModelName, lastClientUpdate: Date) {
		'use server'
		const user = await getCurrentUser()

		if (!user) return

		const db = prisma[scopeName as Prisma.ModelName]

		if (!db) return

		const created = await db.findMany({
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
		const updated = await db.findMany({
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
		const deleted = await db.findMany({
			where: {
				AND: [
					{ userId: user.id },
					{ deletedAt: { gt: lastClientUpdate } },
				],
			},
		})
		const lastServerUpdate = await this.getLastServerUpdate(scopeName)

		return {
			create: created,
			update: updated,
			delete: deleted,
			lastServerUpdate,
		}
	}

	private async performClientDiff(scopeName: ModelName, clientDiff: SyncPayload<UnknownPayload>) {
		'use server'
		if (!clientDiff?.diff) return
		const user = await getCurrentUser()

		if (!user) return

		const db = prisma[scopeName]

		if (!db) return

		const { create, update, delete: deleted } = clientDiff.diff

		await Promise.all([
			this.createMany(create, scopeName),
			this.updateMany(update, scopeName),
			this.deleteMany(deleted, scopeName),
		])
	}

	private async createMany(created: Diff<UnknownPayload>['create'], scopeName: ModelName) {
		'use server'
		if (!created || created.length === 0) return

		const db = prisma[scopeName as Prisma.ModelName]

		if (!db) return

		const createdIds = created.map(item => item?.id).filter(Boolean) as string[]
		const existingItems = (await db.findMany({
			where: {
				id: {
					in: createdIds,
				},
			},
			select: {
				id: true,
			},
		})).map((item: { id: string }) => item.id) as string[]

		const updatedItems = created.filter(item => existingItems.includes(item.id))
		const newItems = created.filter(item => !existingItems.includes(item.id))

		if (updatedItems.length > 0) {
			await this.updateMany(updatedItems, scopeName)
		}

		if (newItems.length > 0) {
			try {
				await db.createMany({
					data: newItems,
				})
			} catch (error) {
				throw new Error(error)
			}
		}
	}

	private async updateMany(updated: Diff<UnknownPayload>['update'], scopeName: ModelName) {
		'use server'
		if (!updated || updated.length === 0) return

		const db = prisma[scopeName as Prisma.ModelName]

		if (!db) return

		const updatedIds = updated.map(item => item.id).filter(Boolean) as string[]
		const existingItems = (await db.findMany({
			where: {
				id: {
					in: updatedIds,
				},
			},
			select: {
				id: true,
			},
		})).map((item: { id: string }) => item.id) as string[]

		const updatedItems = updated.filter(item => existingItems.includes(item.id))
		const newItems = updated.filter(item => !existingItems.includes(item.id))

		if (newItems.length > 0) {
			await this.createMany(newItems, scopeName)
		}

		await Promise.all(updatedItems.map(async item => {
			try {
				await db.update({
					where: {
						id: item.id,
					},
					data: item,
				})
			} catch (error) {
				throw new Error(error)
			}
		}))
	}

	private async deleteMany(deleted: Diff<UnknownPayload>['delete'], scopeName: ModelName) {
		'use server'
		if (!deleted || deleted.length === 0) return

		const db = prisma[scopeName as Prisma.ModelName]

		if (!db) return

		try {
			await db.updateMany({
				where: {
					id: {
						in: deleted,
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

	private async handleNextRequest(req: NextRequest) {
		'use server'
		if (req.method !== 'POST') return

		const body = await req.json() as {
			scopeName: ModelName
			lastServerUpdate: Date
			items: UnknownPayload[]
		}
		const response = {}

		const { scopeName, lastServerUpdate, items } = body

		if (!scopeName || !items) return response

		try {
			await this.performClientDiff(scopeName, {
				diff: {
					create: items,
				},
				lastServerUpdate,
			})
		} catch (error) {
			return NextResponse.json({ error }, { status: 500 })
		}

		return response
	}

	public createNextMiddleware() {
		const matcher = [
			this.publicPath,
		]

		return {
			config: { matcher },
			match: (req: NextRequest) => {
				return matcher.includes(req.nextUrl.pathname)
			},
			handler: this.handleNextRequest
		}
	}
}