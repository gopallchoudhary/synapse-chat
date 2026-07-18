"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createConversation,
	deleteConversation,
	listConversations,
	updateConversation,
} from "../actions/conversation-action";
import { useRouter } from "next/navigation";
import { queryKeys } from "../utils/query-keys";
import { toast } from "sonner";

export function useCreateConversation() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: (title?: string) => createConversation(title),
		onSuccess: (conversation) => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.conversations.all,
			});

			router.push(`/c/${conversation.id}`);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create conversation");
		},
	});
}

export function useConversations() {
	return useQuery({
		queryKey: queryKeys.conversations.all,
		queryFn: () => listConversations(),
	});
}

export function useUpdateConversation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			...data
		}: {
			id: string;
			title?: string;
			isPinned?: boolean;
			isArchived?: boolean;
		}) => updateConversation(id, data),
		onSuccess: (conversation) => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.conversations.all,
			});

			void queryClient.invalidateQueries({
				queryKey: queryKeys.conversations.detail(conversation.id),
			});
		},

		onError: (error: Error) => {
			toast.error(error.message || "Could not update chat");
		},
	});
}

export function useDeleteConversation(activeId?: string) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: (id: string) => deleteConversation(id),
		onSuccess: ({ id }) => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.conversations.all,
			});

			void queryClient.removeQueries({
				queryKey: queryKeys.messages.byConversation(id),
			});

			if (activeId === id) {
				router.push("/");
			}

			toast.success("Chat Deleted");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Chat could not be found");
		},
	});
}
