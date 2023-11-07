import { Button, Checkbox, ColorPicker, Flex, Form, Input, List, Modal, Popconfirm } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { selectedDialog } from 'store/selectors/dialogs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { closeDialog } from 'store/actions/dialogs'
import { useTranslation } from 'react-i18next'
import { Tag, TagForm } from 'types/tags'
import { selectedAllTags, selectedTag } from 'store/selectors/tags'
import { COLOR_PRESETS, INITIAL_TAG_FORM, TAGS_MODAL_NAME } from 'store/constants/tags'
import { addTag, editTag, removeTag } from 'store/actions/tags'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import * as st from './styles.module.css'
import { nanoid } from 'nanoid'

interface TagItemProperties {
	id: Tag['id']
}

const TagItem = ({ id }: TagItemProperties) => {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const tag = useSelector(selectedTag(id))
	const isStored = useMemo(() => !!tag, [tag])
	const finalTag = useMemo(() => tag ?? { ...INITIAL_TAG_FORM, name: id, id }, [id, tag])
	const [isEditing, setIsEditing] = useState(false)
	const [form] = Form.useForm<typeof INITIAL_TAG_FORM>()
	const initialValues = useMemo(() => ({
		...finalTag,
	}), [finalTag])

	console.log('isStored', isStored, 'tag', tag, 'finalTag', finalTag)

	const handleDelete = useCallback(() => {
		dispatch(removeTag(finalTag.id))
	}, [dispatch, finalTag.id])

	const handleSaveForm = useCallback((values: TagForm) => {
		const colorValue = values.color
		const color = typeof colorValue === 'string' ? colorValue : colorValue.toHexString()

		dispatch(editTag({
			...values,
			color,
			id: finalTag.id,
		}))
		setIsEditing(false)
	}, [dispatch, finalTag.id])

	const switchEditing = useCallback(() => {
		setIsEditing(!isEditing)
	}, [isEditing])

	useEffect(() => {
		if (isEditing) {
			form.setFieldsValue(initialValues)
		}
	}, [form, initialValues, isEditing])

	return <>
		<List.Item
			actions={[
				isStored ? <Popconfirm
					key="delete"
					title={t('deleteTagConfirm')}
					description={t('deleteTagConfirmDescription')}
					onConfirm={handleDelete}
					okText={t('yes')}
					cancelText={t('no')}
				>
					<Button
						icon={<DeleteOutlined />}
						type="link"
						danger
					/>
				</Popconfirm> : undefined,
				<Button
					key="edit"
					onClick={switchEditing}
					icon={<EditOutlined />}
					type="link"
				/>,
			]}
		>
			<Flex gap="small" align="center">
				<div className={st.color} style={{ backgroundColor: finalTag.color }} /> {finalTag.name}
			</Flex>
		</List.Item>
		{isEditing && <Form<TagForm>
			layout="inline"
			onFinish={handleSaveForm}
			className={st.form}
			form={form}
		>
			<Form.Item<Tag> name="name" label={t('name')}>
				<Input />
			</Form.Item>
			<Form.Item<Tag> name="color" label={t('color')}>
				<ColorPicker
					defaultFormat="rgb"
					presets={COLOR_PRESETS}
				/>
			</Form.Item>
			<Form.Item<Tag> name="showStats" label={t('showStats')} valuePropName="checked">
				<Checkbox />
			</Form.Item>
			<Form.Item>
				<Button htmlType="submit" type="primary">
					{t('save')}
				</Button>
			</Form.Item>
		</Form>}
	</>
}

export default function Tags() {
	const { t } = useTranslation()
	const tags = useSelector(selectedAllTags)
	const isDialogOpened = useSelector(selectedDialog(TAGS_MODAL_NAME))
	const dispatch = useDispatch()

	const handleClose = useCallback(() => {
		dispatch(closeDialog(TAGS_MODAL_NAME))
	}, [dispatch])

	const handleAddTag = useCallback(() => {
		dispatch(addTag({ ...INITIAL_TAG_FORM, name: 'New tag', id: nanoid() }))
	}, [dispatch])

	return <Modal
		open={isDialogOpened}
		getContainer="#dialog"
		destroyOnClose={true}
		width="60vw"
		title="Edit tags"
		onCancel={handleClose}
		footer={null}
	>
		<List>
			{tags.map((tag) => <TagItem key={tag} id={tag} />)}
			<List.Item>
				<Button ghost type="primary" onClick={handleAddTag}>{t('addTag')}</Button>
			</List.Item>
		</List>
	</Modal>
}