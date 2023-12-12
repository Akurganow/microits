import { createSelector } from '@reduxjs/toolkit'
import { storeKey } from 'store/constants/logs'
import { RootState } from 'store/types'

const rawLogs = (state: RootState) => state[storeKey]

export const selectedLogs = createSelector(
	rawLogs,
	(logs) => logs
)
