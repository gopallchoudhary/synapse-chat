"use client";

import { isTextUIPart, type UIMessage } from "ai";
import type { ChatStatus } from "ai";
import { ExternalLinkIcon } from "lucide-react";

import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
	Message,
	MessageContent,
	MessageResponse,
} from "@/components/ai-elements/message";
import { Loader } from "@/components/ai-elements/loader";
import type { SearchResult } from "@/features/ai/tools/web-search-tool";

/** Extracts plain text from a `UIMessage` by joining all text parts. */
function getMessageText(message: UIMessage) {
	return message.parts
		.filter(isTextUIPart)
		.map((part) => part.text)
		.join("");
}

/**
 * Extracts web search results from tool UI parts of a message and
 * renders them as a compact Sources section below the AI response.
 *
 * In AI SDK v7, tool parts use `type: "tool-${toolName}"` and the result
 * lives in `.output` when `state === "output-available"`.
 */
function SourcesList({ parts }: { parts: UIMessage["parts"] }) {
	const results: SearchResult[] = (parts as unknown[])
		.filter(
			(p): p is { type: string; state: string; output: unknown } =>
				typeof p === "object" &&
				p !== null &&
				typeof (p as Record<string, unknown>).type === "string" &&
				(p as Record<string, unknown>).type !== "text" &&
				(p as Record<string, unknown>).state === "output-available",
		)
		.flatMap((p) => {
			if (Array.isArray(p.output)) return p.output as SearchResult[];
			if (
				typeof p.output === "object" &&
				p.output !== null &&
				"results" in p.output &&
				Array.isArray((p.output as { results: unknown }).results)
			) {
				return (p.output as { results: SearchResult[] }).results;
			}
			return [];
		});


	if (results.length === 0) return null;

	return (
		<div className="mt-3 border-t pt-3">
			<p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
				Sources
			</p>
			<div className="flex flex-col gap-1.5">
				{results.map((r, i) => (
					<a
						key={i}
						href={r.url}
						target="_blank"
						rel="noopener noreferrer"
						className="group flex items-start gap-2.5 rounded-lg border px-3 py-2 text-xs transition-colors hover:bg-accent"
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={`https://www.google.com/s2/favicons?domain=${new URL(r.url).hostname}&sz=16`}
							alt=""
							className="mt-0.5 size-4 shrink-0 rounded-sm"
						/>
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium group-hover:underline">
								{r.title}
							</p>
							<p className="truncate text-muted-foreground">{r.url}</p>
						</div>
						<ExternalLinkIcon className="mt-0.5 size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
					</a>
				))}
			</div>
		</div>
	);
}

type ChatMessagesProps = {
	messages: UIMessage[];
	status: ChatStatus;
};

/**
 * Renders the conversation message list with markdown responses, a loading
 * indicator, and an inline Sources section when web search was used.
 */
export function ChatMessages({ messages, status }: ChatMessagesProps) {
	const isWaiting = status === "submitted" && messages.at(-1)?.role === "user";

	return (
		<Conversation>
			<ConversationContent className="py-8">
				{messages.map((message) => (
					<Message key={message.id} from={message.role}>
						<MessageContent>
							<MessageResponse>{getMessageText(message)}</MessageResponse>
							{message.role === "assistant" && (
								<SourcesList parts={message.parts} />
							)}
						</MessageContent>
					</Message>
				))}

				{isWaiting ? (
					<Message from="assistant">
						<MessageContent>
							<Loader />
						</MessageContent>
					</Message>
				) : null}
			</ConversationContent>
		</Conversation>
	);
}
