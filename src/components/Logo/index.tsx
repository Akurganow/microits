import Image from 'next/image'
import st from './styles.module.css'
import { useTranslation } from 'react-i18next'

export default function Logo() {
	const { t } = useTranslation()

	return <div className={st.logo} title="Alexenda">
		<Image src="/logo.png" alt={t('appName')} width={48} height={48} />
	</div>
}