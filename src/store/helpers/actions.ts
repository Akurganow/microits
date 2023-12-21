import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { AsyncThunk,
	AsyncThunkOptions,
	AsyncThunkPayloadCreator,
	PrepareAction,
	PayloadActionCreator,
} from '@reduxjs/toolkit'
import { AsyncThunkConfig } from '@reduxjs/toolkit/src/createAsyncThunk'

export interface ActionCreatorFactory {
	<P = void, T extends string = string>(type: T): PayloadActionCreator<P, T>

	<P = void, T extends string = string>(type: T, prepareAction: PrepareAction<P>): PayloadActionCreator<P, T>
}

export interface ThunkCreatorFactory {
	<R = void, P = unknown, T extends string = string>(type: T, payloadCreator: AsyncThunkPayloadCreator<R, P>): AsyncThunk<R, P, AsyncThunkConfig>

	<R = void, P = unknown, T extends string = string>(type: T, payloadCreator: AsyncThunkPayloadCreator<R, P>, options: AsyncThunkOptions<P, AsyncThunkConfig>): AsyncThunk<R, P, AsyncThunkConfig>
}

export function actionCreatorFactory(storeKey: string): ActionCreatorFactory {
	return (type: string) => createAction(`${storeKey}/${type}`)
}

export function thunkCreatorFactory(storeKey: string): ThunkCreatorFactory {
	return function <R, P>(type: string, payloadCreator: AsyncThunkPayloadCreator<R, P>, options?: AsyncThunkOptions<unknown, AsyncThunkConfig>) {
		return createAsyncThunk<R, P>(`${storeKey}/${type}`, payloadCreator, options)
	}
}