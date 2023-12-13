import { client } from 'app/contentful'
import { Asset } from 'contentful'
import BlogPost from 'components/BlogPost'
import { BlogPostEntry, BlogPostFields } from 'app/blog/types'

export default async function Page({ params }: { params: { slug: string } }) {
	const entries = await client.getEntries<BlogPostEntry>({
		content_type: 'blogPage',
		limit: 1,
		'fields.slug[in]': [params.slug],
	})
	const entry = entries.items[0].fields
	const img = entry.image as Asset | undefined

	return <BlogPost
		slug={entry.slug}
		title={entry.title}
		body={entry.body}
		image={img && img.fields.file ? {
			url: (img.fields.file.url) as string,
			description: img.fields.description as string,
		} : undefined}
		recommendedPosts={(entry.recommendedPosts as BlogPostFields['recommendedPosts'])?.map((post) => ({
			slug: post.fields.slug as unknown as string,
			title: post.fields.title as unknown as string,
		}))}
	/>
}

export async function generateStaticParams() {
	const entries = await client.getEntries<BlogPostEntry>({
		content_type: 'blogPage',
		limit: 1000,
	})
	const slugs = entries.items.map((entry) => entry.fields.slug)

	return slugs.map((slug) => ({ params: { slug } }))
}