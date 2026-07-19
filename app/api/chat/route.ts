import {
	loadChatMessages,
	saveChatMessages,
} from "@/features/ai/actions/chat-store";
import { getChatModel } from "@/features/ai/utils/model";
import { webSearchTool } from "@/features/ai/tools/web-search-tool";
import { requireUser } from "@/features/auth/actions/require-user";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
	convertToModelMessages,
	createIdGenerator,
	createUIMessageStreamResponse,
	streamText,
	toUIMessageStream,
	type UIMessage,
} from "ai";

export async function POST(req: Request) {
	await auth.protect();

	// get message, conversation id and optional web search flag from the client
	const body = await req.json();
	const { message, id, webSearch = false }: { message: UIMessage; id: string; webSearch?: boolean } = body;

	console.log("[chat/route.ts] webSearch flag:", webSearch, "body keys:", Object.keys(body));

	if (!message || !id) {
		return new Response("Missing message or conversation id", { status: 400 });
	}

	const user = await requireUser();

	const conversation = await prisma.conversation.findFirst({
		where: {
			id,
			userId: user.id,
		},
	});

	if (!conversation) {
		return new Response("Conversation not found", { status: 404 });
	}

	// get the previous messages
	const previousMessages = await loadChatMessages(id);

	// check if the current message is already saved in previous messages or not
	const alreadySaved = previousMessages.some(
		(storedMessage) => storedMessage.id === message.id,
	);

	// save if it is not already saved
	if (!alreadySaved) {
		await saveChatMessages(id, [message]);
	}

	const messages = alreadySaved
		? previousMessages
		: [...previousMessages, message];

	const tools = webSearch ? { webSearch: webSearchTool } : undefined;

	const result = streamText({
		model: getChatModel(conversation.model),
		system: conversation.systemPrompt ?? "You are a helpful chat assistant",
		messages: await convertToModelMessages(messages, { tools }),
		// Conditionally enable web search tool when the user opts in per-message.
		// maxSteps: 3 lets the model call the tool and then generate its response
		// in a single request while keeping token usage minimal.
		// toolChoice: "required" forces the model to actually call the search tool
		// instead of declining with "I don't have real-time data."
		...(webSearch
			? {
					tools,
					maxSteps: 3,
					toolChoice: "required" as const,
				}
			: {}),
	});

	return createUIMessageStreamResponse({
		stream: toUIMessageStream({
			stream: result.stream,
			tools,
			originalMessages: messages,
			generateMessageId: createIdGenerator({ prefix: "msg", size: 16 }),
			onEnd: async ({ messages: finalMessages }) => {
				try {
					await saveChatMessages(id, finalMessages, { updateTitle: false });
				} catch (error) {
					console.error(error);
				}
			},
		}),
	});
}
