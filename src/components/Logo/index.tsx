import st from './styles.module.css'
import Image from 'next/image'

export default function Logo() {
	return <div className={st.logo} title="Alexenda">
		<Image src="/logo.png" alt="Alexenda" width={48} height={48} />
	</div>
}