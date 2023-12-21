'use client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { I18nextProvider, useTranslation } from 'react-i18next'
import * as React from 'react'
import { PropsWithChildren, useEffect, useRef } from 'react'
import { getPersistedStore } from 'src/store'
import i18n from 'src/i18n'
import { SessionProvider } from 'next-auth/react'
import StyledComponentsRegistry from 'components/AntdRegistry'
import { ConfigProvider } from 'antd'
import { theme } from 'lib/theme'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import { FeatureFlagsProvider } from 'lib/hooks/featureFlags'

dayjs.extend(calendar)

function Providers({ children }: PropsWithChildren) {
	const { i18n: i18nInst, ready } = useTranslation()
	const storeRef = useRef<ReturnType<typeof getPersistedStore>>()

	if (!storeRef.current) {
		storeRef.current = getPersistedStore()
	}

	useEffect(() => {
		if (ready) {
			dayjs.locale(i18nInst.resolvedLanguage)
		}
	}, [i18nInst.resolvedLanguage, ready])

	return <StyledComponentsRegistry>
		<ConfigProvider theme={theme}>
			<I18nextProvider i18n={i18n} defaultNS='translation'>
				<SessionProvider>
					<FeatureFlagsProvider>
						<Provider store={storeRef.current?.store}>
							<PersistGate persistor={storeRef.current?.persistor}>
								{children}
							</PersistGate>
						</Provider>
					</FeatureFlagsProvider>
				</SessionProvider>
			</I18nextProvider>
		</ConfigProvider>
	</StyledComponentsRegistry>
}


export default Providers