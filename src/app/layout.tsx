import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Alexenda',
	description: 'Tiny planner for your daily tasks',
}

export default function RootLayout({
	children,
}: {
  children: React.ReactNode
}) {
	return (
		<html lang="en" data-color-mode="light">
			<body className={inter.className}>
				{children}
				<div id="dialog"></div>
			</body>
		</html>
	)
}