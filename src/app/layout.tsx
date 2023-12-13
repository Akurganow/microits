import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import 'app/globals.css'
import { primaryColor } from 'constants/colors'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	metadataBase: new URL('https://alexenda.vercel.app'),
	alternates: {
		canonical: '/',
	},
	title: 'Alexenda',
	description: 'Tiny planner for your daily tasks',
	openGraph: {
		type: 'website',
		url: 'https://alexenda.vercel.app',
		siteName: 'Alexenda',
		locale: 'en',
		images: [
			{
				url: '/logo.svg',
				width: 429,
				height: 429,
				alt: 'Alexenda',
			},
		],
	}
}

export default function RootLayout({
	children,
}: {
  children: ReactNode
}) {
	return (
		<html lang="en" data-color-mode="light">
			<head>
				<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
				<link rel="manifest" href="/site.webmanifest"/>
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color={primaryColor}/>
				<meta name="msapplication-TileColor" content={primaryColor}/>
				<meta name="theme-color" content="#ffffff"/>
			</head>
			<body className={inter.className} suppressHydrationWarning={true}>
				{children}
				<div id="dialog"></div>
				<SpeedInsights/>
				<Analytics/>
			</body>
		</html>
	)
}