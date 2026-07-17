import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createMessage,
	deleteMessage,
	listMessages,
	updateMessage,
} from "../actions/messages-action";
import { queryKeys } from "@/features/conversation/utils/query-keys";
import { toast } from "sonner";

export function useMessages(conversationId: string) {
	return useQuery({
		queryKey: queryKeys.messages.byConversation(conversationId ?? "none"),
		queryFn: () => listMessages(conversationId),
		enabled: Boolean(conversationId),
	});
}

export function useCreateMessage(conversationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (content: string) => createMessage(conversationId, content),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.messages.byConversation(conversationId),
			});

			void queryClient.invalidateQueries({
				queryKey: queryKeys.conversations.all,
			});
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to send message");
		},
	});
}

export function useUpdateMessage(conversationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, content }: { id: string; content: string }) =>
			updateMessage(id, content),
		onSuccess: () => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.messages.byConversation(conversationId),
			});
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update message");
		},
	});
}

export function useDeleteMessage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteMessage(id),
		onSuccess: (data) => {
			void queryClient.invalidateQueries({
				queryKey: queryKeys.messages.byConversation(data.conversationId),
			});

			toast.success("Message deleted");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete message");
		},
	});
}
