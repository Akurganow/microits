import { UnknownAction } from 'redux'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { RootState } from 'store/types'
import { PartialWithId } from 'types/common'

export type SyncPayload<T extends { id: string }> = {
    created?: T
    updated?: PartialWithId<T>
    deleted?: T['id']
}

export type SyncConfig<T extends { id: string }> = {
    [K in UnknownAction['type']]: (action: UnknownAction, state: RootState) => SyncPayload<T> | SyncPayload<T>[]
}

export interface SyncLog<T extends { id: string }> {
    log: (action: UnknownAction, state: RootState) => void
    isActionHandled: (action: UnknownAction) => boolean
    getLog: () => Promise<SyncPayload<T>[]>
}

export type SyncLogCreatorConfig<T extends { id: string }> = {
    name: string
    config: SyncConfig<T>
}

export interface SyncConfigCreator<T extends { id: string }> {
    config: SyncConfig<T>
    case<A extends ActionCreatorWithPayload<unknown, string>>(action: A, payloadCreator: (action: ReturnType<A>, state: RootState) => SyncPayload<T> | SyncPayload<T>[]): SyncConfigCreator<T>
}