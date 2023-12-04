import NewTask from 'containers/dialogs/NewTask'
import Tags from 'containers/dialogs/Tags'
import Exports from 'containers/dialogs/Exports'
import Settings from 'containers/dialogs/Settings'

export default function Dialogs() {
	return <>
		<NewTask />
		<Tags />
		<Exports />
		<Settings />
	</>
}
