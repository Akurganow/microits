import { NextResponse } from 'next/server'

export const config = {
	matcher: '/welcome',
}

export async function middleware() {
	return NextResponse.json({ message: 'Welcome to Vercel Edge!' })
}