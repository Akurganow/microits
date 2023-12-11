'use client'
import { AnyAction, combineReducers, Store } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import { persistReducer, persistStore } from 'redux-persist'
import { PersistPartial, RootState } from './types'
import storage from 'redux-persist-indexeddb-storage'
import { initialState as tasksInitialState, storeKey as tasksStoreKey } from 'store/constants/tasks'
import { initialState as settingsInitialState, storeKey as settingsStoreKey } from 'store/constants/settings'
import { initialState as tagsInitialState, storeKey as tagsStoreKey } from 'store/constants/tags'
import { initialState as dialogsInitialState, storeKey as dialogsStoreKey } from 'store/constants/dialogs'
import tasksReducer from 'store/reducers/tasks'
import settingsReducer from 'store/reducers/settings'
import tagsReducer from 'store/reducers/tags'
import dialogsReducer from 'store/reducers/dialogs'

const thunk: ThunkMiddleware<RootState, AnyAction> = thunkMiddleware
export const PERSIST_STORAGE_DB_NAME = 'nanoits'
export const initialState: RootState = {
	[tasksStoreKey]: tasksInitialState as typeof tasksInitialState & PersistPartial,
	[settingsStoreKey]: settingsInitialState as typeof settingsInitialState & PersistPartial,
	[tagsStoreKey]: tagsInitialState as typeof tagsInitialState & PersistPartial,
	[dialogsStoreKey]: dialogsInitialState,
}
type Storage = typeof storage

function createPersistConfig(key: string, storage: Storage) {
	return {
		key: `nanoits/${key}`,
		storage,
	}
}

export const storeStorage = storage(PERSIST_STORAGE_DB_NAME)

export const rootReducer = combineReducers({
	[tasksStoreKey]: persistReducer(
		createPersistConfig(tasksStoreKey, storeStorage),
		tasksReducer(tasksInitialState),
	),
	[settingsStoreKey]: persistReducer(
		createPersistConfig(settingsStoreKey, storeStorage),
		settingsReducer(settingsInitialState),
	),
	[tagsStoreKey]: persistReducer(
		createPersistConfig(tagsStoreKey, storeStorage),
		tagsReducer(tagsInitialState),
	),
	[dialogsStoreKey]: dialogsReducer(dialogsInitialState),
})
const store = configureStore({
	reducer: rootReducer,
	preloadedState: initialState,
	middleware: [thunk],
	devTools: true,
})
const persistor = persistStore(store as unknown as Store)

export { store, persistor }