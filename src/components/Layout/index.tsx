'use client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { persistor, store } from 'src/store'
import i18n from 'src/i18n'
import { I18nextProvider } from 'react-i18next'
import { ConfigProvider } from 'antd'
import { SessionProvider } from 'next-auth/react'

const theme = {
	components: {
		Layout: {
			headerBg: '#fff',
			bodyBg: '#fff',
			headerHeight: 48,
		},
	},
	token: {
		colorPrimary: '#663399',
		colorInfo: '#663399',
		colorLink: '#663399',
	}
}

type LayoutProps = {
	children: React.ReactNode,
}

export default function Layout({ children }: LayoutProps) {
	const { i18n: i18nInst, ready } = useTranslation()

	useEffect(() => {
		if (ready) {
			dayjs.locale(i18nInst.resolvedLanguage)
		}
	}, [i18nInst.resolvedLanguage, ready])

	return <>
		<SessionProvider>
			<I18nextProvider i18n={i18n} defaultNS={'translation'}>
				<Provider store={store}>
					<PersistGate persistor={persistor}>
						<ConfigProvider theme={theme}>
							{children}
						</ConfigProvider>
					</PersistGate>
				</Provider>
			</I18nextProvider>
		</SessionProvider>
	</>
}