'use client'
import NewTask from 'components/dialogs/NewTask'
import Tags from 'components/dialogs/Tags'
import Exports from 'components/dialogs/Exports'
import Settings from 'components/dialogs/Settings'

export default function Dialogs() {
	return <>
		<NewTask />
		<Tags />
		<Exports />
		<Settings />
	</>
}
