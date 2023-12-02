'use client'
import { AnyAction, Store } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk'
import { persistStore } from 'redux-persist'
import { rootReducer, initialState } from './reducers'
import { RootState } from './types'

const thunk: ThunkMiddleware<RootState, AnyAction> = thunkMiddleware
const store = configureStore({
	reducer: rootReducer,
	preloadedState: initialState,
	middleware: [thunk],
	devTools: true,
})
const persistor = persistStore(store as unknown as Store)

export { store, persistor }