import { DetailedHTMLProps, HTMLAttributes } from 'react'
import cn from 'classnames'
import st from './styles.module.css'

interface DialogFooterProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {

}

export default function (props: DialogFooterProps) {
	return (
		<div className={cn(st.footer)}>
			{props.children}
		</div>
	)
}
