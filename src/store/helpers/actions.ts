import {
	AsyncThunk,
	AsyncThunkOptions,
	AsyncThunkPayloadCreator,
	createAction,
	createAsyncThunk,
	PrepareAction
} from '@reduxjs/toolkit'
import { PayloadActionCreator } from '@reduxjs/toolkit/src/createAction'
import { AsyncThunkConfig } from '@reduxjs/toolkit/src/createAsyncThunk'

export interface ActionCreatorFactory {
	<P = void, T extends string = string>(type: T): PayloadActionCreator<P, T>

	<P = void, T extends string = string>(type: T, prepareAction: PrepareAction<P>): PayloadActionCreator<P, T>
}

export interface ThunkCreatorFactory {
	<R = void, T extends string = string>(type: T, payloadCreator: AsyncThunkPayloadCreator<R, T>): AsyncThunk<R, T, AsyncThunkConfig>

	<R = void, T extends string = string>(type: T, payloadCreator: AsyncThunkPayloadCreator<R, T>, options: AsyncThunkOptions<T, AsyncThunkConfig>): AsyncThunk<R, T, AsyncThunkConfig>
}

export function actionCreatorFactory(storeKey: string): ActionCreatorFactory {
	return (type: string) => createAction(`${storeKey}/${type}`)
}

export function thunkCreatorFactory(storeKey: string): ThunkCreatorFactory {
	return (type: string, payloadCreator: AsyncThunkPayloadCreator<unknown, string>, options?: AsyncThunkOptions<unknown, AsyncThunkConfig>) => createAsyncThunk(`${storeKey}/${type}`, payloadCreator, options)
}