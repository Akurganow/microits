'use server'
import { ChatGPTAPI } from 'chatgpt'
import { createSystemMessage } from 'containers/dialogs/Exports/constants'
import { ResourceKey } from 'i18next'

type Params = {
	message: string,
	apiKey: string,
	userId: string,
}

export async function getTasksAnalysis(params: Params, translation: ResourceKey) {
	const { message, apiKey, userId } = params

	const api = new ChatGPTAPI({
		apiKey,
		completionParams: {
			model: 'gpt-4',
			user: userId,
		},
		systemMessage: createSystemMessage(translation),
	})

	return await api.sendMessage(message, {
		timeoutMs: 5 * 60 * 1000,
		onProgress: (partialResponse) => {
			console.log(partialResponse.delta)
		}
	})
}