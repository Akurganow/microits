import { DetailedHTMLProps, HTMLAttributes } from 'react'
import cn from 'classnames'
import * as st from './styles.module.css'
import { Typography } from 'antd'

interface DialogHeaderProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {

}

export default function (props: DialogHeaderProps) {
	return (
		<div className={cn(st.header)}>
			<Typography.Text>{props.children}</Typography.Text>
		</div>
	)
}
