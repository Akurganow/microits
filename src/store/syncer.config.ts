import { Syncer } from 'lib/syncer'
import { RootState } from 'store/types'

const syncerVersion = 1
const syncer = new Syncer<RootState>('nanoits', syncerVersion)
	.addIgnoredActions([
		'persist',
		'dialogs',
	])

export default syncer