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

	const response = await openai.chat.completions.create({
		stream: true,
		model: 'gpt-4-1106-preview',
		messages: [
			{
				role: 'system',
				content: (systemMessage[locale.split(/[-_]/i)[0]] || systemMessage.en),
			},
			{
				role: 'user',
				content: `Here the serialized into csv list of tasks ${json2csv(tasks)}`,
			},
			{
				role: 'user',
				content: `Here the serialized into csv list of tags ${json2csv(tags)}`,
			}
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
