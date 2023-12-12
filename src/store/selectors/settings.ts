import { storeKey } from 'store/constants/settings'
import { RootState } from 'store/types'
import { createSelector } from '@reduxjs/toolkit'
import { SettingsState, SettingsKey, SettingsValue } from 'types/settings'

const rawSettings = (state: RootState) => state[storeKey]

export const selectedOpenAI = createSelector(
	rawSettings,
	(settings) => settings.openAI
)

export const selectedSettingValue = (key: SettingsKey) =>
	(state: SettingsState) => createSelector(
		[
			rawSettings,
			(_state, key) => key,
		],
		(settings, key) =>
			settings[key] as SettingsValue<SettingsKey>
	)(state, key)