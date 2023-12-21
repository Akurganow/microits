import { Flex, Timeline } from 'antd'
import Link from 'next/link'
import ContentfulImage from 'components/ContentfulImage'
import st from './styles.module.css'
import { getBlogPosts } from 'app/blog/server'
import type { BlogPostEntry } from 'app/blog/types'
import type { Asset, Entry } from 'contentful'
import PostIcon from 'components/PostIcon'
import { primaryColor } from 'lib/theme'

function TimelinePost(post: Entry<BlogPostEntry>) {
	const postImage = (post.fields.image as Asset | undefined)?.fields

	return <Flex
		vertical
		gap="middle"
		className={st.container}
	>
		<Link href={`/blog/${post.fields.slug}`}>
			{post.fields.title as string}
		</Link>
		{postImage?.file && <ContentfulImage
			width={32}
			src={postImage.file.url as string}
			alt={postImage.description as string}
			className={st.image}
		/>}
	</Flex>
}

export default async function Page() {
	const posts  = await getBlogPosts()
	const timelineItems = posts
		.map(post => {
			return {
				color: primaryColor,
				className: st.post,
				dot: <PostIcon name={post.fields.icon} twoToneColor={post.fields.iconColor || primaryColor} />,
				children: <TimelinePost {...post} />
			}
		})

	return <Timeline items={timelineItems} />
}
