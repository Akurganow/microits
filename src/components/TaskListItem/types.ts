import { HTMLAttributes } from 'react'
import { Task } from 'types/tasks'

export interface TaskListItemProps extends HTMLAttributes<HTMLDivElement> {
    item: Task;
    index: number;
}