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

export async function getBlogPosts() {
	return (await getBlogEntries())
		.filter(post => post.fields.slug && post.fields.title && post.fields.date)
		.sort((a, b) => new Date(b.fields.date).getTime() - new Date(a.fields.date).getTime())
}