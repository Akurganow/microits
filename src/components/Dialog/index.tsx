import { MouseEvent as ReactMouseEvent, DetailedHTMLProps, HTMLAttributes, useEffect, useRef } from 'react'
import cn from 'classnames'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectedDialog } from 'store/selectors/dialogs'
import { closeDialog } from 'store/actions/dialogs'
import * as st from './styles.module.css'

export interface DialogProperties extends DetailedHTMLProps<HTMLAttributes<HTMLDialogElement>, HTMLDialogElement> {
	name: string
	isOpen?: boolean
	isClickOutsideClose?: boolean
	onCloseComplete?: () => void
}

export default function Dialog({
	name,
	isClickOutsideClose = true,
	isOpen = false,
	onCloseComplete,
	className,
	children,
	...properties
}: DialogProperties) {
	const dispatch = useDispatch()
	const container = document.querySelector('#dialog')
	const dialog = useRef<HTMLDialogElement>(null)
	const isOpenStored = useSelector(selectedDialog(name))
	const isOpenCurrent = isOpen || isOpenStored

	useEffect(() => {
		if (dialog.current?.open === isOpenCurrent) return

		if (isOpenCurrent) {
			dialog.current?.showModal()
		} else {
			dialog.current?.close()
			onCloseComplete?.()
		}
	}, [isOpenCurrent, onCloseComplete])

	if (!container) return null

	const handleMouseDownDialog = (event: ReactMouseEvent<HTMLDialogElement, MouseEvent>) => {
		const target = event.target as HTMLElement

		if (!isClickOutsideClose) return

		if (dialog.current === target) {
			dispatch(closeDialog(name))
			onCloseComplete?.()
		}
	}

	const element = (
		<dialog
			ref={dialog}
			className={cn(st.dialog, className)}
			onMouseDown={handleMouseDownDialog}
			{...properties}
		>
			{children}
		</dialog>
	)

	return isOpenCurrent ? createPortal(element, container) : null
}

export { default as DialogHeader } from './components/Header'
export { default as DialogBody } from './components/Body'
export { default as DialogFooter } from './components/Footer'