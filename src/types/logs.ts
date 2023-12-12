import { Action } from 'redux'

export interface Log {
    id: string
    action: Action
    createdAt: number
}

export type LogsState = {
    logs: Log[]
    lastServerUpdate: number
}