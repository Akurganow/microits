import 'modern-css-reset'
import 'react-virtualized/styles.css'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import i18n from 'src/i18n'
import { I18nextProvider, useTranslation } from 'react-i18next'
import { persistor, store } from 'src/store'
import HomePage from 'pages/HomePage'
import Dialogs from 'containers/dialogs'
import { ConfigProvider } from 'antd'
import { useEffect } from 'react'
import dayjs from 'dayjs'

const theme = {
	components: {
		Layout: {
			headerBg: '#fff',
			bodyBg: '#fff',
			headerHeight: 48,
		},
	},
}

export default function App() {
	const { i18n: i18nInst, ready } = useTranslation()

	useEffect(() => {
		if (ready) {
			dayjs.locale(i18nInst.resolvedLanguage)
		}
	}, [i18nInst.resolvedLanguage, ready])

	return <I18nextProvider i18n={i18n} defaultNS={'translation'}>
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<ConfigProvider theme={theme}>
					<Dialogs />
					<HomePage />
				</ConfigProvider>
			</PersistGate>
		</Provider>
	</I18nextProvider>
}

const container = document.querySelector('#app')
const root = createRoot(container)
root.render(<App />)