import { getBlogEntries } from 'app/blog/server'
import ContentfulImage from 'components/ContentfulImage'
import { Asset } from 'contentful'
import Link from 'next/link'
import st from './styles.module.css'

export default async function Page() {
	const posts = await getBlogEntries()

	return <div>
		{posts.map((post) => {
			const postImage = post.fields.image as Asset | undefined
			const image = postImage?.fields.file
				? {
					url: postImage.fields.file.url as string,
					description: postImage.fields.description as string,
				}
				: undefined
			return <div key={String(post.fields.slug)}>
				<Link href={`/blog/${post.fields.slug}`}>
					<h2>{String(post.fields.title)}</h2>
				</Link>
				{post.fields.description && <p>{String(post.fields.description)}</p>}
				{image && <ContentfulImage
					preview={false}
					src={image.url}
					alt={image.description}
					className={st.mainImage}
				/>}
			</div>
		})}
	</div>
}