import { client } from 'app/contentful'
import { Asset } from 'contentful'
import BlogPost from 'components/BlogPost'
import { BlogPostEntry, BlogPostFields } from 'app/blog/types'
import { ResolvingMetadata } from 'next'

type Params = {
	slug: string
}

type Props = {
	params: Params
}

export default async function Page({ params }: Props) {
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

export const dynamicParams = true

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata) {
	const entries = await client.getEntries<BlogPostEntry>({
		content_type: 'blogPage',
		limit: 1,
		'fields.slug[in]': [params.slug],
	})
	const entry = entries.items[0].fields

	const parentMetadata = await parent
	console.log('parent', parentMetadata)

	return {
		title: entry.title,
	}
}

export async function generateStaticParams() {
	const entries = await client.getEntries<BlogPostEntry>({
		content_type: 'blogPage',
		limit: 1000,
	})
	const slugs = entries.items.map((entry) => ({
		slug: entry.fields.slug,
		title: entry.fields.title,
	}))

	return slugs.map(({ slug, title }) => ({ params: { slug, title } }))
}