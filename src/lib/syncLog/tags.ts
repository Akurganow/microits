import { createSyncConfig } from 'lib/syncLog/createSyncConfig'
import { addTag, editTag, removeTag } from 'store/actions/tags'
import type { Tag } from 'types/tags'

const config = createSyncConfig<Tag>(builder => builder
	.case(addTag, ({ payload }) => ({
		created: payload
	}))
	.case(editTag, ({ payload }) => ({
		updated: payload
	}))
	.case(removeTag, ({ payload }) => ({
		deleted: payload
	}))
)

export default config