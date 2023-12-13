'use server'
import { client } from 'app/contentful'
import { BlogPostEntry } from 'app/blog/types'

export async function getBlogEntries () {
	const entries = await client.getEntries<BlogPostEntry>({
		content_type: 'blogPage',
		limit: 100,
	})

	return entries.items.filter((entry) => entry.fields.slug)
}