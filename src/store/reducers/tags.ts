import { TagsState } from 'types/tags'
import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { addTag, editTag, removeTag } from 'store/actions/tags'

const createReducer = (initialState: TagsState) => reducerWithInitialState(initialState)
	.case(addTag, (state, tag) => ({
		...state,
		tags: [...state.tags, { ...tag, id: tag.id }],
	}))
	.case(removeTag, (state, id) => ({
		...state,
		tags: state.tags.filter((tag) => tag.id !== id),
	}))
	.case(editTag, (state, tag) => {
		const storedTag = state.tags.find((t) => t.id === tag.id)

		return storedTag ? {
			...state,
			tags: state.tags.map((t) => {
				if (t.id === tag.id) {
					return tag
				}

				return t
			}),
		} : {
			...state,
			tags: [...state.tags, tag],
		}
	})

export default createReducer