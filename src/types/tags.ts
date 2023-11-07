import { Color } from 'antd/es/color-picker'

export interface Tag {
    id: string;
    name: string;
    color: string;
    showStats: boolean;
}

export interface TagForm extends Omit<Tag, 'id' | 'color'> {
    color: Color | string;
}

export type TagsState = {
    tags: Tag[]
}