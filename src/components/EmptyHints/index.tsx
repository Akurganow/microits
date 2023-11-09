import { HTMLAttributes } from 'react'
import cn from 'classnames'
import { Empty } from 'antd'
import * as st from './styles.module.css'

export default function EmptyHints({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return <div {...props} className={cn(className, st.empty)}>
		<Empty />
	</div>
}