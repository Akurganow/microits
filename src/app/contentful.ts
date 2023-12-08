import { createClient } from 'contentful'

export const client = createClient({
	space: process.env.CF_SPACE_ID as string,
	accessToken: process.env.CF_DELIVERY_ACCESS_TOKEN as string,
})
export const previewClient = createClient({
	space: process.env.CF_SPACE_ID as string,
	accessToken: process.env.CF_DELIVERY_PREVIEW_TOKEN as string,
	host: 'preview.contentful.com',
})
