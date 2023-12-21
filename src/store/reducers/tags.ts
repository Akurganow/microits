import { Tag, TagDiff, TagsState } from 'types/tags'
import { addTag, editTag, initialSyncTagsWithServer, removeTag, syncTagsWithServer } from 'store/actions/tags'
import { createReducer } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/src/types/types-external'
import { isEmpty } from '@plq/is'

const tagsReducer = (initialState: TagsState) => createReducer(initialState, builder =>
	builder
		.addCase(addTag, (state, action) => {
			state.tags.push(action.payload)
		})
		.addCase(editTag, (state, action) => {
			const tag = state.tags.find(t => t.id === action.payload.id)

			if (tag) {
				Object.assign(tag, action.payload)
			} else {
				state.tags.push(action.payload)
			}
		})
		.addCase(removeTag, (state, action) => {
			state.tags = state.tags.filter(tag => tag.id !== action.payload)
		})
		.addCase(initialSyncTagsWithServer.pending, (state) => {
			state.isSyncing = true
		})
		.addCase(initialSyncTagsWithServer.rejected, (state) => {
			state.isSyncing = false
		})
		.addCase(initialSyncTagsWithServer.fulfilled, performTagsSync)
		.addCase(syncTagsWithServer.pending, (state) => {
			state.isSyncing = true
		})
		.addCase(syncTagsWithServer.rejected, (state) => {
			state.isSyncing = false
		})
		.addCase(syncTagsWithServer.fulfilled, performTagsSync)
)

export default tagsReducer

function performTagsSync(state: WritableDraft<TagsState>, { payload }: { payload?: { diff?: TagDiff, lastServerUpdate?: Date }}) {
	state.isSyncing = false

	console.debug('performTagsSync', payload)
	if (!payload || isEmpty(payload)) return

	const { diff, lastServerUpdate } = payload

	console.debug('performTagsSync', diff, lastServerUpdate)
	if (diff) {
		if (diff.create) {
			console.debug('performTagsSync:diff.create', diff.create)
			const tagsMap = new Map(state.tags.map(tag => [tag.id, tag]))

			for (const tag of diff.create) {
				if (!tagsMap.has(tag.id)) {
					state.tags.push(tag)
				}
			}

			state.tags = Array.from(tagsMap.values())
		}
		if (diff.update) {
			for (const tag of diff.update) {
				const existedTag = state.tags.find(t => t.id === tag.id)

				if (existedTag) {
					Object.assign(existedTag, tag)
				} else {
					state.tags.push(tag as Tag)
				}
			}
		}
		if (diff.delete) {
			console.debug('performTagsSync:diff.delete', diff.delete)
			state.tags = state.tags.filter(tag => !diff.delete!.find(t => t === tag.id))
		}
	}

	if (lastServerUpdate) {
		state.lastServerUpdate = lastServerUpdate.toISOString()
	}
}