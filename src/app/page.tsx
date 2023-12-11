import 'modern-css-reset'
import 'react-virtualized/styles.css'
import HomePage from 'src/components/HomePage'
import Layout from 'components/Layout'
import Dialogs from 'src/components/dialogs'

export default async function Page() {
	return <Layout>
		<Dialogs />
		<HomePage />
	</Layout>
}
