import { List, Typography } from 'antd'
import { ListTitle } from 'components/TasksList'
import { HTMLAttributes } from 'react'
import cn from 'classnames'
import * as st from './styles.module.css'

interface TaskListTitleProps extends HTMLAttributes<HTMLDivElement> {
    item: ListTitle
}
export default function TaskListTitle({ item, className, ...props }: TaskListTitleProps) {
	return <List.Item className={cn(className, st.container, st[item.type])} {...props}>
		<Typography.Title
			ellipsis={{ tooltip: item.title }}
			level={item.type === 'date' ? 4 : 5}
			style={{ margin: 0 }}
		>
			{item.title}
		</Typography.Title>
	</List.Item>
}