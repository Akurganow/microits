import Head from 'next/head'
import { BLOCKS, MARKS, Document } from '@contentful/rich-text-types'
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer'
import ContentfulImage from 'components/ContentfulImage'
import st from './styles.module.css'

interface BlogPostProps {
    slug: string
    title: string
    body: Document
    image?: {
        url: string
        description: string
    }
    recommendedPosts: {
		slug: string
		title: string
	}[]
}

const contentRendererOptions: Options = {
	renderMark: {
		[MARKS.BOLD]: (text) => <strong>{text}</strong>,
	},
	renderNode: {
		[BLOCKS.EMBEDDED_ASSET]: ({ data }) => (
			<ContentfulImage
				preview={false}
				src={data.target.fields.file.url}
				alt={data.target.fields.description}
				className={st.contentImage}
			/>
		),
	},
}

export default function BlogPost({ body, title, image, recommendedPosts }: BlogPostProps) {
	const content = documentToReactComponents(body, contentRendererOptions)
	const recommended = recommendedPosts.filter((post) => post.slug)

	return <>
		<Head>
			<title>{title} | Alexenda</title>
		</Head>

		<div>
			<h1>{title}</h1>
			{image && <ContentfulImage
				preview={false}
				src={image.url}
				alt={image.description}
				className={st.mainImage}
			/>}
			<div>{content}</div>
			{recommended.length > 0 && <div>
				<h2>Recommended Posts</h2>
				<ul>
					{recommended.map(({ slug, title }) =>
						<li key={slug}>
							<a href={`/blog/${slug}`}>{title}</a>
						</li>
					)}
				</ul>
			</div>}
		</div>
	</>
}