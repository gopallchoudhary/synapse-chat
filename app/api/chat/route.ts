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
	isStepCount,
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

	const currentDate = new Date().toLocaleString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short",
	});

	const webSearchSystemInstruction = webSearch
		? `\n\nToday's current date and time is ${currentDate}.\nCRITICAL INSTRUCTION: Web search is ENABLED for this user message. You MUST call the \`webSearch\` tool first to retrieve information.
- For live sports scores or real-time match updates, craft queries that specifically target live scorecards (e.g. include terms like "espncricinfo live scorecard" or "cricbuzz live score" along with current date/year ${currentDate}) so you retrieve exact runs, overs, and wickets data.
- For historical questions about past years (e.g. 2023, 2024, 2025), search for and provide historical data as requested by the user.
- Summarize the search results accurately and present the exact live score and current match situation to the user.`
		: `\n\nToday's current date and time is ${currentDate}.`;



	const result = streamText({
		model: getChatModel(conversation.model),
		system: (conversation.systemPrompt ?? "You are a helpful chat assistant") + webSearchSystemInstruction,
		messages: await convertToModelMessages(messages, { tools }),

		// Conditionally enable web search tool when the user opts in per-message.
		// stopWhen: isStepCount(3) allows the model to call the tool and then generate
		// its text response in a single request while keeping token usage minimal.
		...(webSearch
			? {
					tools,
					stopWhen: isStepCount(3),
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
