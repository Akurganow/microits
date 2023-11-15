import { Dayjs } from 'dayjs'

export enum TaskStatus {
    Init = 'initial',
    Open = 'open',
    InProgress = 'inProgress',
    Done = 'done',
}

export enum TaskPriority {
    Urgent,
    High,
    Normal,
    Low,
}

export type CheckListItem = {
    id: number
    title: string
    completed: boolean
}

export type TaskRepeatable = {
    repeatType: 'day' | 'week' | 'month' | 'year'
    repeatEvery: number
    repeatIndex: number
} | null

export type Task = {
    id: number
    title: string
    repeatable: TaskRepeatable
    estimate: number
    timeSpent?: number
    date?: string
    time?: string
    dueDate?: string
    tags: string[]
    status: TaskStatus
    priority: TaskPriority
    checkList: CheckListItem[]
    repeatStatuses?: TaskStatus[]
}

export type TaskFormValues = Omit<Task, 'id' | 'date' | 'time' | 'dueDate'> & {
    date?: Dayjs
    time?: Dayjs
    dueDate?: Dayjs
}

export type TasksState = {
    tasks: Task[]
}