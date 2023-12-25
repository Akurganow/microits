import { NextRequest, NextResponse } from 'next/server'
import syncer from 'store/syncer.config'

const syncMiddleware = syncer.createNextMiddleware()

export const config = syncMiddleware.config

export async function middleware(request: NextRequest) {
	if (syncMiddleware.match(request)) {
		const body = syncMiddleware.handler(request)

		return NextResponse.json(body, { status: 200 })
	}
}