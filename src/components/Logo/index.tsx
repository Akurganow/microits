import Image from 'next/image'
import st from './styles.module.css'
import { useTranslation } from 'react-i18next'
import { Flex } from 'antd'

const logoSize = 32

export default function Logo() {
	const { t } = useTranslation()

	return <Flex className={st.logo} style={{ height: logoSize }} title="Alexenda">
		<Image src="/logo.svg" alt={t('appName')} width={logoSize} height={logoSize} />
	</Flex>
}