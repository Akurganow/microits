import { RootState } from '../types'
import { createSelector } from 'reselect'
import { storeKey } from 'store/constants/tags'
import { selectedTags as selectedTasksTags } from 'store/selectors/tasks'
import { Tag } from 'types/tags'
import { SettingsState } from 'types/settings'
import memoize from 'lodash/memoize'

const rawTags = (state: RootState) => state[storeKey]

export const selectedTags = createSelector(
	rawTags,
	(state) => state.tags
)

export const selectedAllTags = createSelector(
	selectedTags,
	selectedTasksTags,
	(tags, tasks) => {
		const tasksTags = new Set(tasks)
		const tagsIds = new Set(tags.map((tag) => tag.id))

		return [...new Set([...tagsIds, ...tasksTags])]
	}
)

export const selectedTag = memoize((id: Tag['id']) =>
	(state: SettingsState) => createSelector(
		[
			selectedTags,
			(_state, id) => id,
		],
		(tags, id) => {
			const tag = tags.find((tag) => tag.id === id)

			if (tag) return tag

			return null
		}
	)(state, id))

export const selectedStatsTags = createSelector(
	selectedTags,
	(tags) => tags.filter((tag) => tag.showStats)
)