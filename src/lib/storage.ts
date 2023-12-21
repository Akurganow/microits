import type { Storage } from 'redux-persist'

export const createNoopStorage = (): Storage => ({
	getItem: () => Promise.resolve(null),
	setItem: () => Promise.resolve(),
	removeItem: () => Promise.resolve(),
})