import {
	loadChatMessages,
	saveChatMessages,
} from "@/features/ai/actions/chat-store";
import { getChatModel } from "@/features/ai/utils/model";
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

	// get message and conversation if from the user
	const { message, id }: { message: UIMessage; id: string } = await req.json();

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

	const result = streamText({
		model: getChatModel(conversation.model),
		system: conversation.systemPrompt ?? "You are a helpful chat assistant",
		messages: await convertToModelMessages(messages),
	});

	result.consumeStream();

	return createUIMessageStreamResponse({
		stream: toUIMessageStream({
			stream: result.stream,
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
