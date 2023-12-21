import Providers from 'components/Providers'
import { PropsWithChildren } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: {
		template: '%s | Alexenda Blog',
		default: 'Alexenda Blog',
		absolute: 'Alexenda Blog',
	},
}

export default function BlogLayout({ children }: PropsWithChildren) {
	return (
		<Providers>
			<main className="blog-container">
				{children}
			</main>
		</Providers>
	)
}