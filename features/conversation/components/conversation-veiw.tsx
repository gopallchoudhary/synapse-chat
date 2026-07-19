"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport, type UIMessage } from "ai";
import React, { useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { useConversations } from "../hooks/use-conversation";
import { useChat } from "@ai-sdk/react";
import { queryKeys } from "../utils/query-keys";
import { toast } from "sonner";
import { ChatEmpty } from "./chat-empty";
import { ChatMessages } from "./chat-messages";
import { ChatComposer } from "./chat-composer";

type ConversationViewProps = {
	conversationId: string;
	initialMessages: UIMessage[];
};

export const ConversationView = ({
	conversationId,
	initialMessages,
}: ConversationViewProps) => {
	const queryClient = useQueryClient();
	const { data: conversations } = useConversations();

	/** Per-message web search toggle; resets to false after each send. */
	const [webSearchEnabled, setWebSearchEnabled] = React.useState(false);

	/**
	 * Keep a ref in sync with the state so prepareSendMessagesRequest can
	 * always read the *current* value without needing to recreate the transport.
	 * (Re-creating the transport after mount doesn't work because useChat
	 * captures the initial transport instance.)
	 */
	const webSearchRef = useRef(webSearchEnabled);
	webSearchRef.current = webSearchEnabled;

	// Transport is stable — it reads from the ref, not the closure.
	const [transport] = React.useState(
		() =>
			new DefaultChatTransport({
				api: "/api/chat",
				prepareSendMessagesRequest: ({ id, messages }) => ({
					body: {
						id,
						message: messages.at(-1),
						webSearch: webSearchRef.current,
					},
				}),
			}),
	);

	const { messages, sendMessage, status } = useChat({
		id: conversationId,
		messages: initialMessages,
		transport,
		onFinish: () => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.conversations.all,
			});
		},

		onError: (error) => {
			toast.error(error.message);
		},
	});

	const title =
		conversations?.find((item) => item.id === conversationId)?.title ?? "Chat";

	return (
		<div className="flex h-full min-h-0 flex-1 flex-col">
			<header className="flex h-14 shrink-0 items-center gap-2 border-b px-3">
				<SidebarTrigger />
				<Separator orientation="vertical" className="mx-1 h-4" />
				<h1 className="truncate text-sm font-medium">{title}</h1>
			</header>

			{messages.length === 0 ? (
				<ChatEmpty />
			) : (
				<ChatMessages messages={messages} status={status} />
			)}

			<ChatComposer
				onSend={(text) => {
					// Reset toggle first so the ref is already false for the next message,
					// but the current send still reads webSearchRef.current = true if it was on.
					// We capture the current value before resetting.
					void sendMessage({ text });
					setWebSearchEnabled(false);
				}}
				isSending={status !== "ready"}
				autoFocus
				webSearchEnabled={webSearchEnabled}
				onWebSearchToggle={setWebSearchEnabled}
			/>
		</div>
	);
};
