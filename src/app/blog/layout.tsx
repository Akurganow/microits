import Providers from 'src/components/Providers'

export default function BlogLayout({
	children,
}: {
    children: React.ReactNode
}) {
	return (
		<main className="blog-container">
			<Providers>
				{children}
			</Providers>
		</main>
	)
}