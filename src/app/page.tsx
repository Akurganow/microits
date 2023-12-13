import 'modern-css-reset'
import 'react-virtualized/styles.css'
import HomePage from 'src/components/HomePage'
import Providers from 'src/components/Providers'
import Dialogs from 'src/components/dialogs'

export default async function Page() {
	return <Providers>
		<Dialogs />
		<HomePage />
	</Providers>
}
