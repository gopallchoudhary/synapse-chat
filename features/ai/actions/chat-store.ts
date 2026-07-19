"use server";

import { prisma } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";
import { isTextUIPart, type UIMessage } from "ai";

/** Extracts plain text from an AI SDK `UIMessage` by joining all text parts. */
function getMessageText(message: UIMessage) {
	return message.parts
		.filter(isTextUIPart)
		.map((part) => part.text)
		.join("");
}

function toUIMessageParts(
	parts: Prisma.JsonValue | null,
	content: string,
): UIMessage["parts"] {
	const stored = parts as UIMessage["parts"] | null;

	if (Array.isArray(stored) && stored.length > 0) {
		return stored;
	}

	return [{ type: "text", text: content }];
}

export async function loadChatMessages(
	conversationId: string,
): Promise<UIMessage[]> {
	const rows = await prisma.message.findMany({
		where: {
			conversationId,
		},
		orderBy: {
			createdAt: "asc",
		},
	});

	return rows.map((row) => {
		const roleMap: Record<string, UIMessage["role"]> = {
			USER: "user",
			ASSISTANT: "assistant",
			SYSTEM: "system",
			TOOL: "assistant",
		};
		return {
			id: row.id,
			role: roleMap[row.role] ?? "user",
			parts: toUIMessageParts(row.parts, row.content),
		};
	});
}

type SaveChatMessagesOptions = {
	updateTitle?: boolean;
};

// save chat messages...

export async function saveChatMessages(
	conversationId: string,
	messages: UIMessage[],
	options: SaveChatMessagesOptions = {},
) {
	const { updateTitle = true } = options;

	for (const message of messages) {
		if (message.role === "system") continue;

		const content = getMessageText(message);
		const roleMap: Record<string, "USER" | "ASSISTANT" | "TOOL"> = {
			user: "USER",
			assistant: "ASSISTANT",
			tool: "TOOL",
		};
		const role = roleMap[message.role] ?? "USER";

		await prisma.message.upsert({
			where: { id: message.id },
			create: {
				id: message.id,
				conversationId,
				role,
				status: "COMPLETE",
				content,
				parts: message.parts as Prisma.InputJsonValue,
			},
			update: {
				content,
				parts: message.parts as Prisma.InputJsonValue,
				status: "COMPLETE",
			},
		});
	}

	const conversation = await prisma.conversation.findFirstOrThrow({
		where: {
			id: conversationId,
		},
		select: {
			title: true,
		},
	});

	const firstUser = messages.find((message) => message.role === "user");
	const firstUserText = firstUser ? getMessageText(firstUser).trim() : "";

	await prisma.conversation.update({
		where: {
			id: conversationId,
		},
		data: {
			lastMessageAt: new Date(),
			title:
				updateTitle && conversation.title === "New Chat" && firstUserText
					? firstUserText.slice(0, 48)
					: conversation.title,
		},
	});
}
