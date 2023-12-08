import { client } from 'app/contentful'
import { Asset, EntrySkeletonType, EntryFieldTypes } from 'contentful'
import BlogPost from 'components/BlogPost'

type BlogPostFields = {
	title: EntryFieldTypes.Text
	body: EntryFieldTypes.RichText
	slug: EntryFieldTypes.Text
	image: Asset
	recommendedPosts: EntrySkeletonType<BlogPostFields>[]
}

interface BlogPostEntry extends EntrySkeletonType<BlogPostFields> {}

export default async function Page({ params }: { params: { slug: string } }) {
	const entries = await client.getEntries<BlogPostEntry>({
		content_type: 'blogPage',
		limit: 1,
		'fields.slug[in]': [params.slug],
	})
	const entry = entries.items[0].fields
	const img = entry.image as Asset

	return <BlogPost
		slug={entry.slug}
		title={entry.title}
		body={entry.body}
		image={img.fields.file ? {
			url: (img.fields.file.url) as string,
			description: img.fields.description as string,
		} : undefined}
		recommendedPosts={(entry.recommendedPosts as BlogPostFields['recommendedPosts']).map((post) => ({
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