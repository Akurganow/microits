import OpenAI from 'openai'
import { OpenAIStream } from 'ai'
import { systemMessage } from './constants'
import { json2csv } from 'json-2-csv'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: NextRequest) {
	const { tasks, tags, locale, userId } = await req.json()

	const systemMessageContent: string = systemMessage[locale.split(/[-_]/i)[0]] || systemMessage.en
	const tasksMessageContent: string = tasks ? `Here the serialized into csv list of tasks "${json2csv(tasks)}"` : 'I have no tasks yet'
	const tagsMessageContent: string = tags ? `Here the serialized into csv list of tags "${json2csv(tags)}"` : 'I have no tags yet'

	const response = await openai.chat.completions.create({
		stream: true,
		model: 'gpt-4-1106-preview',
		messages: [
			{ role: 'system', content: systemMessageContent },
			{ role: 'user', content: tasksMessageContent },
			{ role: 'user', content: tagsMessageContent },
		],
		user: userId as string,
	})

	const stream = OpenAIStream(response)

	return new NextResponse(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'X-Content-Type-Options': 'nosniff'
		}
	})
}
