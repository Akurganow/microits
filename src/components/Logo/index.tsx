import { useCallback } from 'react'
import Image from 'next/image'
import { getUsers } from './server'
import st from './styles.module.css'

export default function Logo() {
	const handleClick = useCallback(async () => {
		const users = await getUsers()

		console.log(users)
	}, [])

	return <div className={st.logo} title="Alexenda" onClick={handleClick}>
		<Image src="/logo.png" alt="Alexenda" width={48} height={48} />
	</div>
}