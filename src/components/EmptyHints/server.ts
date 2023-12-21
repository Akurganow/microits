'use server'
import { AssetFile, createClient, EntryFields } from 'contentful'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { getRandomItem } from 'lib/array'
import { LocaleCode } from 'contentful/dist/types/types/locale'
import { AssetFields } from 'contentful/dist/types/types/asset'
import { JsonObject } from 'type-fest/source/basic'
import dayjs, { Dayjs } from 'dayjs'
import { NewTaskValues } from 'types/tasks'

const client = createClient({
	space: process.env.CF_SPACE_ID as string,
	accessToken: process.env.CF_DELIVERY_ACCESS_TOKEN as string,
})

type EmptyHintsParams = {
    locale: string
}

export type Hint = {
    image: AssetFile['url']
	imageAlt: AssetFields['description']
	imageDetails: AssetFile['details']
    text: string
    button: string
    fields: NewTaskValues
}

type EmptyHint = {
    contentTypeId: string
	fields: {
		image: EntryFields.AssetLink
		text: EntryFields.RichText
		buttonText: EntryFields.Symbol
		fields: EntryFields.Object<JsonObject>
	}
}

function getDateFromTemplate(template?: string): string {
	if (!template) return dayjs().toString()

	return (template.split('|')
		.reduce((djs, method) => {
			const [methodName, a] = method.split(':')
			const args = a.split(',')

			return djs[methodName](...args)
		}, dayjs()) as Dayjs).toString()
}

export async function getHint(params: EmptyHintsParams): Promise<Hint> {
	const entries = await client.getEntries<EmptyHint, LocaleCode>({ locale: params.locale })
	const entry = entries.items[Math.floor(Math.random() * entries.items.length)]
	const imageEntry = getRandomItem(entry.fields.image as (EntryFields.AssetLink)[])
	const image = imageEntry.fields.file?.url as AssetFile['url']
	const imageAlt = imageEntry.fields.description as AssetFields['description']
	const text = documentToHtmlString(entry.fields.text)
	const imageDetails = imageEntry.fields.file?.details as AssetFile['details']
	const button = entry.fields.buttonText
	const fields = entry.fields.fields as NewTaskValues

	fields.date = getDateFromTemplate(fields.date)
	fields.dueDate = getDateFromTemplate(fields.dueDate)

	return {
		image,
		imageAlt,
		imageDetails,
		text,
		button,
		fields,
	}
}