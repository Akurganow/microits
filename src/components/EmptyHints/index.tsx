import { HTMLAttributes, useCallback, useMemo } from 'react'
import cn from 'classnames'
import hints, { Localized } from './hints'
import st from './styles.module.css'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { Button, Typography } from 'antd'
import { getRandomItem } from 'utils/array'
import { useDispatch } from 'react-redux'
import { openDialog } from 'store/actions/dialogs'
import { setNewTask } from 'store/actions/tasks'

function getLocalizedItem<T extends Localized<unknown>>(item: T, lang: string): T[keyof T] {
	return item[lang] || item.en
}

const imageSize = 300

export default function EmptyHints({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	const dispatch = useDispatch()
	const { i18n } = useTranslation()
	const lang = useMemo(() => i18n.language, [i18n.language])
	const hint = useMemo(() => getRandomItem(hints), [])
	const hintImage = useMemo(() => getRandomItem(hint.images), [hint])
	const hintText = useMemo(() => getLocalizedItem(hint.text, lang), [hint.text, lang])
	const hintButton = useMemo(() => getLocalizedItem(hint.button, lang), [hint.button, lang])
	const hintFields = useMemo(() => getLocalizedItem(hint.fields, lang), [hint.fields, lang])

	const handleButtonClick = useCallback(() => {
		dispatch(setNewTask(hintFields))
		dispatch(openDialog('new-task'))
	}, [dispatch, hintFields])

	return <div {...props} className={cn(className, st.container)}>
		<style>{`:root { --empty-hint-image-width: {${imageSize}px}`}</style>
		<div className={st.empty}>
			<Image
				src={hintImage}
				alt={hintText}
				width={imageSize}
				height={imageSize}
				className={st.image}
			/>

			<Typography.Text className={st.text}>
				{hintText}
			</Typography.Text>

			<Button type="primary" onClick={handleButtonClick} className={st.button}>
				{hintButton}
			</Button>
		</div>
	</div>
}