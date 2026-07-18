import { createOpenAI } from "@ai-sdk/openai";

export const DEFAULT_CHAT_MODEL = "gpt-4o-mini";

const openrouterClient = createOpenAI({
	apiKey: process.env.OPENROUTER_API_KEY,
	baseURL: process.env.OPENROUTER_BASE_URL,
});

export function getChatModel(modelId: string | null) {
	return openrouterClient(modelId ?? DEFAULT_CHAT_MODEL);
}
