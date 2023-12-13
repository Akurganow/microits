import { Flex, Timeline } from 'antd'
import Link from 'next/link'
import { getBlogEntries } from 'app/blog/server'
import ContentfulImage from 'components/ContentfulImage'
import st from './styles.module.css'
import type { BlogPostEntry } from 'app/blog/types'
import type { Asset, Entry } from 'contentful'
import PostIcon from 'components/PostIcon'
import { primaryColor } from 'constants/colors'

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
	const posts = await getBlogEntries()

	const timelineItems = posts
		.filter(post => post.fields.slug && post.fields.title && post.fields.date)
		.sort((a, b) => new Date(b.fields.date).getTime() - new Date(a.fields.date).getTime())
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