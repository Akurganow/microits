import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatGPTAPI } from 'chatgpt'
import { createSystemMessage } from 'containers/dialogs/Exports/constants'

type ResponseData = {
    message: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
) {
	if (req.method === 'POST') {
		const { message, apiKey, userId, translation } = req.body
		const api = new ChatGPTAPI({
			apiKey,
			completionParams: {
				model: 'gpt-4',
				user: userId,
			},
			systemMessage: createSystemMessage(translation),
		})
		const result = await api.sendMessage(message, {
			timeoutMs: 5 * 60 * 1000,
			onProgress: (partialResponse) => {
				console.log(partialResponse.delta)
			}
		})

		console.log(message, apiKey, userId, translation)
		res.status(200).json({ message: result.text })
	} else {
		res.status(200).json({ message: 'Hello from Next.js!' })
	}
}