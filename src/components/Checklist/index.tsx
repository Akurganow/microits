import { useState, KeyboardEvent, FC } from 'react'
import { Checkbox, Input, Button, List, Typography, Flex } from 'antd'
import { useDispatch } from 'react-redux'
import { addChecklistItem, removeChecklistItem, updateChecklistItem } from 'store/actions/tasks'
import { Task } from 'types/tasks'
import { DeleteOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { grey } from '@ant-design/colors'

export type CheckListItem = {
    id: number;
    title: string;
    completed: boolean;
};

type CheckListProps = {
    task: Task
}

const CheckList: FC<CheckListProps> = ({ task }) => {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const [editingItemId, setEditingItemId] = useState<number | null>(null)
	const [tempTitle, setTempTitle] = useState<string>('')

	const handleCheck = (item: CheckListItem) => {
		dispatch(updateChecklistItem({
			taskId: task.id,
			item: { ...item, completed: !item.completed }
		}))
	}

	const startEditing = (item: CheckListItem) => {
		setEditingItemId(item.id)
		setTempTitle(item.title)
	}

	const submitEdit = (item: CheckListItem) => {
		dispatch(updateChecklistItem({
			taskId: task.id,
			item: { ...item, title: tempTitle }
		}))
		setEditingItemId(null)
	}

	const cancelEdit = () => {
		setEditingItemId(null)
	}

	const handleKeyDown = (e: KeyboardEvent, item: CheckListItem) => {
		switch (e.key) {
		case 'Enter': {
			submitEdit(item)
			break
		}
		case 'Escape': {
			cancelEdit()
			break
		}
		}
	}

	const addNewItem = () => {
		dispatch(addChecklistItem(task.id))
	}

	const removeItem = (item: CheckListItem) => {
		dispatch(removeChecklistItem({ taskId: task.id, itemId: item.id }))
	}

	return (
		<>
			{task.checkList && task.checkList.length > 0 && <List
				dataSource={task.checkList}
				renderItem={(item) => (
					<List.Item
						style={{
							textDecoration: item.completed ? 'line-through' : 'none',
							color: item.completed ? grey[0] : 'inherit',
						}}
						actions={[
							<Button
								key={item.id}
								onClick={() => removeItem(item)}
								danger={true}
								ghost={true}
								size="small"
							>
								<DeleteOutlined />
							</Button>,
						]}
					>
						<Flex justify="flex-start" gap="0.5rem" style={{ width: '100%' }}>
							<Checkbox checked={item.completed} onChange={() => handleCheck(item)} />
							{editingItemId === item.id ? (
								<Input
									placeholder={t('checklist.addItem')}
									value={tempTitle}
									onChange={(e) => setTempTitle(e.target.value)}
									onKeyDown={(e) => handleKeyDown(e, item)}
									onBlur={() => setEditingItemId(null)}
									autoFocus
								/>
							) : (
								<Typography.Text
									style={{ color: 'currentcolor' }}
									ellipsis
									onClick={() => startEditing(item)}
								>
									{item.title}
								</Typography.Text>
							)}
						</Flex>
					</List.Item>
				)}
			/>}

			<Button
				type="dashed"
				onClick={addNewItem}
				style={{ width: 'auto', textAlign: 'center' }}
			>
				{t('checklist.addItem')}
			</Button>
		</>
	)
}

export default CheckList
