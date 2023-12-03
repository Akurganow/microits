interface DevModeProps extends React.PropsWithChildren {}

export default function DevMode({ children }: DevModeProps) {
	const storedDevMode = localStorage.getItem('devMode')

	if (process.env.NODE_ENV === 'development' || storedDevMode) return children

	return null
}