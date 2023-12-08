import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { systemMessage } from './constants'
import { json2csv } from 'json-2-csv'

export const runtime = 'edge'

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
	const { tasks, tags, locale, userId } = await req.json()
	const response = await openai.chat.completions.create({
		stream: true,
		model: 'gpt-4',
		messages: [
			{
				role: 'system',
				content: `${(systemMessage[locale.split(/[-_]/i)[0]] || systemMessage.en)}
				Here the serialized into csv list of tasks ${json2csv(tasks)}
				Here the serialized into csv list of tags ${json2csv(tags)}`
			},
		],
		user: userId as string,
	})

	const stream = OpenAIStream(response)

	return new StreamingTextResponse(stream)
}
