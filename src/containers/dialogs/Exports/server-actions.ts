'use server'
import { ChatGPTAPI } from 'chatgpt'
import { SYSTEM_MESSAGE } from 'containers/dialogs/Exports/constants'

type Params = {
	message: string,
	apiKey: string,
	userId: string,
}

export async function getTasksAnalysis(params: Params) {
	const { message, apiKey, userId } = params

	const api = new ChatGPTAPI({
		apiKey,
		completionParams: {
			model: 'gpt-4',
			user: userId,
			max_tokens: 4000,
		},
		systemMessage: SYSTEM_MESSAGE,
	})

	return await api.sendMessage(message, {
		timeoutMs: 2 * 60 * 1000,
		onProgress: (partialResponse) => {
			console.log(partialResponse.delta)
		}
	})
}