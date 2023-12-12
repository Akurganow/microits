import { TagsState } from 'types/tags'
import { addTag, editTag, removeTag } from 'store/actions/tags'
import { createReducer } from '@reduxjs/toolkit'

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
)

export default tagsReducer