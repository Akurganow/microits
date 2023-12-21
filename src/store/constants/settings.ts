import type { SettingsState } from 'types/settings'
import { nanoid } from 'nanoid'
export const storeKey = 'settings'
export const initialState: SettingsState = {
	showUnsorted: true,
	autoSync: false,
	openAI: {
		apiKey: '',
		userId: nanoid(),
	},
}
