import { storeKey } from 'store/constants/settings'
import { RootState } from 'store/types'
import { createSelector } from '@reduxjs/toolkit'
import { SettingsState, SettingsKey, SettingsValue } from 'types/settings'

const rawSettings = (state: RootState) => state[storeKey]

const selectedSettings = createSelector(
	rawSettings,
	(settings) => settings
)

export const selectedOpenAI = createSelector(
	selectedSettings,
	(settings) => settings.openAI
)

export const selectedSettingValue = (key: SettingsKey) =>
	(state: SettingsState) => createSelector(
		[
			selectedSettings,
			(_state, key) => key,
		],
		(settings, key) =>
			settings[key] as SettingsValue<SettingsKey>
	)(state, key)