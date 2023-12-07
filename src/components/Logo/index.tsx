import { useCallback } from 'react'
import Image from 'next/image'
import getLogo from './server'
import st from './styles.module.css'
import { useTranslation } from 'react-i18next'

export default function Logo() {
	const { i18n } = useTranslation()
	const locale = i18n.resolvedLanguage || i18n.language
	const handleClick = useCallback(async () => {
		const logo = await getLogo({ locale })

		console.log(logo)
	}, [locale])

	return <div className={st.logo} title="Alexenda" onClick={handleClick}>
		<Image src="/logo.png" alt="Alexenda" width={48} height={48} />
	</div>
}