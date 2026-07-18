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

	return [{type: "text", text: content}];
}
