This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: features/conversation/components/app-sidebar.tsx, features/messages/actions/messages-action.ts, features/conversation/components/chat-composer.tsx, features/conversation/actions/conversation-action.ts, features/ai/actions/chat-store.ts, features/conversation/hooks/use-conversation.ts, features/conversation/components/conversation-veiw.tsx, app/api/chat/route.ts, features/messages/hooks/use-messages.ts, prisma/schema.prisma, prisma/migrations/20260715081938_complete_schema_design/migration.sql, package.json, app/layout.tsx, README.md, features/conversation/components/chat-messages.tsx, public/next.svg, public/globe.svg, features/auth/actions/onboard.ts, app/(root)/c/[id]/page.tsx, proxy.ts, features/conversation/components/chat-empty.tsx, tsconfig.json, prisma/migrations/20260715075517_user_model/migration.sql, lib/db.ts, hooks/use-mobile.ts, env.ts, components.json, .gitignore, features/conversation/components/chat-shell.tsx, eslint.config.mjs, app/(root)/layout.tsx, prisma.config.ts, public/file.svg, public/window.svg, features/auth/actions/require-user.ts, features/ai/utils/model.ts, app/(root)/page.tsx, features/home/actions/start-new-chat.ts, AGENTS.md, features/conversation/utils/query-keys.ts, app/(auth)/sign-in/layout.tsx, lib/utils.ts, prisma/migrations/20260715073137_init_test/migration.sql, next.config.ts, public/vercel.svg, prisma/migrations/migration_lock.toml, app/(auth)/sign-in/[[...sign-in]]/page.tsx, postcss.config.mjs, prisma/migrations/20260716004559_message_update/migration.sql, CLAUDE.md
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app/
  (auth)/
    sign-in/
      [[...sign-in]]/
        page.tsx
      layout.tsx
  (root)/
    c/
      [id]/
        page.tsx
    layout.tsx
    page.tsx
  api/
    chat/
      route.ts
  layout.tsx
features/
  ai/
    actions/
      chat-store.ts
    utils/
      model.ts
  auth/
    actions/
      onboard.ts
      require-user.ts
  conversation/
    actions/
      conversation-action.ts
    components/
      app-sidebar.tsx
      chat-composer.tsx
      chat-empty.tsx
      chat-messages.tsx
      chat-shell.tsx
      conversation-veiw.tsx
    hooks/
      use-conversation.ts
    utils/
      query-keys.ts
  home/
    actions/
      start-new-chat.ts
  messages/
    actions/
      messages-action.ts
    hooks/
      use-messages.ts
hooks/
  use-mobile.ts
lib/
  db.ts
  utils.ts
prisma/
  migrations/
    20260715073137_init_test/
      migration.sql
    20260715075517_user_model/
      migration.sql
    20260715081938_complete_schema_design/
      migration.sql
    20260716004559_message_update/
      migration.sql
    migration_lock.toml
  schema.prisma
public/
  file.svg
  globe.svg
  next.svg
  vercel.svg
  window.svg
.gitignore
AGENTS.md
CLAUDE.md
components.json
env.ts
eslint.config.mjs
next.config.ts
package.json
postcss.config.mjs
prisma.config.ts
proxy.ts
README.md
tsconfig.json
```

# Files

## File: app/(auth)/sign-in/[[...sign-in]]/page.tsx
````typescript
import { SignIn } from "@clerk/nextjs";

export default function Page() {
	return <SignIn forceRedirectUrl={"/"} />;
}
````

## File: app/(auth)/sign-in/layout.tsx
````typescript
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<div className="w-full max-w-md">{children}</div>
		</main>
	);
};

export default AuthLayout;
````

## File: app/(root)/c/[id]/page.tsx
````typescript
import { loadChatMessages } from "@/features/ai/actions/chat-store";
import { getConversation } from "@/features/conversation/actions/conversation-action";
import { ConversationView } from "@/features/conversation/components/conversation-veiw";
import { notFound } from "next/navigation";


type ConversationPageProps = {
	params: Promise<{ id: string }>;
};

/**
 * Conversation page — loads messages and renders the chat UI for a given ID.
 */
const page = async ({ params }: ConversationPageProps) => {
	const { id } = await params;

	try {
		await getConversation(id);
	} catch (error) {
		notFound();
	}

	const initialMessages = await loadChatMessages(id);

	return (
		<ConversationView
			key={id}
			conversationId={id}
			initialMessages={initialMessages}
		/>
		
	);
};

export default page;
````

## File: app/(root)/layout.tsx
````typescript
import { onBoardUser } from "@/features/auth/actions/onboard";
import { ChatShell } from "@/features/conversation/components/chat-shell";
import { auth } from "@clerk/nextjs/server";
import React from "react";


async function RootGroupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	await auth.protect();
	await onBoardUser();
	return (
		<ChatShell>
			{children}
		</ChatShell>
	)
}


export default RootGroupLayout
````

## File: app/(root)/page.tsx
````typescript
import { startNewChat } from "@/features/home/actions/start-new-chat";
import { redirect } from "next/navigation";
import React from "react";

/**
 * Home page — creates a new chat and redirects to `/c/{id}`.
 */
const page = async () => {
	const conversationId = await startNewChat();

	redirect(`/c/${conversationId}`);
};

export default page;
````

## File: app/api/chat/route.ts
````typescript
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
````

## File: app/layout.tsx
````typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/providers/query-provider";
import { ClientThemeProvider } from "@/components/providers/client-theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider } from "@clerk/nextjs";

const spaceGroteskHeading = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				geistSans.variable,
				geistMono.variable,
				"font-sans",
				inter.variable,
				spaceGroteskHeading.variable,
			)}
			suppressHydrationWarning
		>
			<body className="min-h-full flex flex-col">
				<ClerkProvider>
					<QueryProvider>
						<ClientThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange
						>
							<TooltipProvider>{children}</TooltipProvider>
						</ClientThemeProvider>
					</QueryProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
````

## File: features/ai/actions/chat-store.ts
````typescript
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

	return rows.map((row) => ({
		id: row.id,
		role: row.role === "ASSISTANT" ? "assistant" : "user",
		parts: toUIMessageParts(row.parts, row.content),
	}));
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
		const role = message.role === "assistant" ? "ASSISTANT" : "USER";

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
````

## File: features/ai/utils/model.ts
````typescript
import { env } from "@/env";
import { createOpenAI } from "@ai-sdk/openai";

export const DEFAULT_CHAT_MODEL = "gpt-4o-mini";

const openrouterClient = createOpenAI({
	apiKey: env.OPENROUTER_API_KEY,
	baseURL: env.OPENROUTER_BASE_URL,
});

export function getChatModel(modelId: string | null) {
	return openrouterClient(modelId ?? DEFAULT_CHAT_MODEL);
}
````

## File: features/auth/actions/onboard.ts
````typescript
import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";



export async function onBoardUser() {
    const clerkUser = await currentUser()
    if (!clerkUser) {
        throw new Error("Clerk user not found")
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? null

    return await prisma.user.upsert({
        where: {
            clerkId: clerkUser.id
        },
        create: {
            email,
            clerkId: clerkUser.id,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl
        },
        update: {
            email,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            imageUrl: clerkUser.imageUrl
        }
    })
}
````

## File: features/auth/actions/require-user.ts
````typescript
"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function requireUser() {
	const { userId } = await auth.protect();

	const user = await prisma.user.findUnique({
		where: {
			clerkId: userId,
		},
	});
	if (!user) {
		throw new Error("User not found. Complete Onboarding first.");
	}

	return user;
}
````

## File: features/conversation/actions/conversation-action.ts
````typescript
"use server";
import { requireUser } from "@/features/auth/actions/require-user";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ConversationListItem = {
	id: string;
	title: string;
	isPinned: boolean;
	isArchived: boolean;
	lastMessageAt: Date;
	createdAt: Date;
	updatedAt: Date;
};

async function assertOwnConversation(conversationId: string, userId: string) {
	const conversation = await prisma.conversation.findFirst({
		where: {
			id: conversationId,
			userId: userId,
		},
	});
	if (!conversation) {
		throw new Error("Conversation not found");
	}
	return conversation;
}

export async function getConversation(conversationId: string) {
    const user = await requireUser();
    return assertOwnConversation(conversationId, user.id)
}

export async function listConversations(): Promise<ConversationListItem[]> {
	const user = await requireUser();

	return await prisma.conversation.findMany({
		where: {
			userId: user.id,
			isArchived: false,
		},
		orderBy: [{ isPinned: "desc" }, { lastMessageAt: "desc" }],
		select: {
			id: true,
			title: true,
			isPinned: true,
			isArchived: true,
			lastMessageAt: true,
			createdAt: true,
			updatedAt: true,
		},
	});
}

export async function createConversation(title: string = "New Chat") {
	const user = await requireUser();

	return await prisma.conversation.create({
		data: {
			userId: user.id,
			title: title.trim() || "New Chat",
		},
	});
}

export async function updateConversation(
	conversationId: string,
	data: { title?: string; isPinned?: boolean; isArchived?: boolean },
) {
	const user = await requireUser();
	await assertOwnConversation(conversationId, user.id);

	const converasation = await prisma.conversation.update({
		where: {
			id: conversationId,
		},
		data: {
			...(data.title !== undefined
				? { title: data.title.trim() || "New Chat" }
				: {}),
			...(data.isPinned !== undefined ? { isPinned: data.isPinned } : {}),
			...(data.isArchived !== undefined ? { isArchived: data.isArchived } : {}),
		},
	});

	revalidatePath("/");
	revalidatePath(`/c/${converasation.id}`);
	return converasation;
}

export async function deleteConversation(conversationId: string) {
	const user = await requireUser();
	await assertOwnConversation(conversationId, user.id);

	await prisma.conversation.delete({
		where: {
			id: conversationId,
		},
	});

	revalidatePath("/");

	return { id: conversationId };
}
````

## File: features/conversation/components/app-sidebar.tsx
````typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	MoreHorizontalIcon,
	PencilIcon,
	PinIcon,
	PinOffIcon,
	PlusIcon,
	Trash2Icon,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useConversations,
	useDeleteConversation,
	useUpdateConversation,
} from "@/features/conversation/hooks/use-conversation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";

type Conversation = NonNullable<
	ReturnType<typeof useConversations>["data"]
>[number];

/**
 * Main application sidebar — logo, new chat, conversation list, theme toggle, and account.
 */
export function AppSidebar() {
	const pathname = usePathname();
	const { data: conversations, isLoading } = useConversations();

	// Get the active conversation id from the pathname (e.g. /c/123)
	// pathname.split("/")[2] is the third part of the pathname (the conversation id)
	//  firstparam = / , secondparam = c , thirdparam = 123
	const activeId = pathname.startsWith("/c/")
		? pathname.split("/")[2]
		: undefined;

	return (
		<Sidebar collapsible="icon" variant="inset">
			<SidebarHeader className="gap-2">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="font-semibold tracking-tight"
							asChild
						>
							<Link href="/">
								<span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm text-primary-foreground">
									C
								</span>
								<span>ChaiGPT</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton tooltip="New chat" asChild>
							<Link href="/">
								<PlusIcon />
								<span>New chat</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Chats</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<ChatList
								conversations={conversations}
								isLoading={isLoading}
								activeId={activeId}
							/>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarFooterMenu />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

/** Renders the conversation list with loading skeletons or an empty-state message. */
function ChatList({
	conversations,
	isLoading,
	activeId,
}: {
	conversations: Conversation[] | undefined;
	isLoading: boolean;
	activeId: string | undefined;
}) {
	if (isLoading) {
		return (
			<>
				{Array.from({ length: 5 }).map((_, index) => (
					<SidebarMenuItem key={index}>
						<Skeleton className="h-8 w-full" />
					</SidebarMenuItem>
				))}
			</>
		);
	}

	if (!conversations?.length) {
		return (
			<p className="px-2 py-1.5 text-xs text-muted-foreground">No chats yet</p>
		);
	}

	return (
		<>
			{conversations.map((conversation) => (
				<ChatItem
					key={conversation.id}
					conversation={conversation}
					isActive={activeId === conversation.id}
				/>
			))}
		</>
	);
}

/** Single sidebar row for a conversation with rename, pin, and delete actions. */
function ChatItem({
	conversation,
	isActive,
}: {
	conversation: Conversation;
	isActive: boolean;
}) {
	const updateConversation = useUpdateConversation();
	const deleteConversation = useDeleteConversation(
		isActive ? conversation.id : undefined,
	);

	/** Prompts the user to rename the conversation and persists the new title. */
	function handleRename() {
		const next = window.prompt("Rename chat", conversation.title);
		if (!next || next.trim() === conversation.title) return;
		updateConversation.mutate({ id: conversation.id, title: next });
	}

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				isActive={isActive}
				tooltip={conversation.title}
				asChild
				className={cn(isActive && "font-medium")}
			>
				<Link href={`/c/${conversation.id}`}>
					<span className="truncate">{conversation.title}</span>
				</Link>
			</SidebarMenuButton>

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<SidebarMenuAction
						showOnHover
						className="data-popup-open:bg-sidebar-accent"
					>
						<MoreHorizontalIcon />
						<span className="sr-only">Chat actions</span>
					</SidebarMenuAction>
				</DropdownMenuTrigger>
				<DropdownMenuContent side="right" align="start">
					<DropdownMenuItem onClick={handleRename}>
						<PencilIcon />
						Rename
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() =>
							updateConversation.mutate({
								id: conversation.id,
								isPinned: !conversation.isPinned,
							})
						}
					>
						{conversation.isPinned ? <PinOffIcon /> : <PinIcon />}
						{conversation.isPinned ? "Unpin" : "Pin"}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						onClick={() => deleteConversation.mutate(conversation.id)}
					>
						<Trash2Icon />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	);
}

/** Footer menu with theme toggle and Clerk user account button. */
function SidebarFooterMenu() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<div className="flex items-center gap-2 px-1 py-1.5">
					<ModeToggle />
					<span className="truncate text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
						Theme
					</span>
				</div>
			</SidebarMenuItem>
			<SidebarMenuItem>
				<div className="flex items-center gap-2 px-1 py-1.5">
					<UserButton
						appearance={{
							elements: {
								avatarBox: "size-8",
							},
						}}
					/>
					<span className="truncate text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
						Account
					</span>
				</div>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
````

## File: features/conversation/components/chat-composer.tsx
````typescript
"use client";

import * as React from "react";
import { ArrowUpIcon } from "lucide-react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type ChatComposerProps = {
	onSend: (content: string) => Promise<void> | void;
	isSending?: boolean;
	placeholder?: string;
	className?: string;
	autoFocus?: boolean;
};

/**
 * Message input form with send button. Enter sends; Shift+Enter inserts a newline.
 */
export function ChatComposer({
	onSend,
	isSending = false,
	placeholder = "Message ChaiGPT…",
	className,
	autoFocus = false,
}: ChatComposerProps) {
	const [value, setValue] = React.useState("");
	const textareaRef = React.useRef<HTMLTextAreaElement>(null);

	React.useEffect(() => {
		if (autoFocus) {
			textareaRef.current?.focus();
		}
	}, [autoFocus]);

	/** Submits the current message when the form is submitted or Enter is pressed. */
	async function handleSubmit(event?: React.FormEvent) {
		event?.preventDefault();
		const content = value.trim();
		if (!content || isSending) return;

		setValue("");
		await onSend(content);
		textareaRef.current?.focus();
	}

	/** Handles keyboard shortcuts — Enter to send, Shift+Enter for a new line. */
	function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			void handleSubmit();
		}
	}

	const canSend = value.trim().length > 0 && !isSending;

	return (
		<form
			onSubmit={(event) => void handleSubmit(event)}
			className={cn("mx-auto w-full max-w-3xl px-4 pb-4 md:px-6", className)}
		>
			<InputGroup className="h-auto min-h-14 rounded-3xl border-border/80 bg-background shadow-sm dark:bg-input/40">
				<InputGroupTextarea
					ref={textareaRef}
					value={value}
					onChange={(event) => setValue(event.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={isSending}
					rows={1}
					className="max-h-48 min-h-12 py-3.5 pl-4 text-[15px] leading-relaxed"
				/>
				<InputGroupAddon align="inline-end" className="pr-2 pb-2 self-end">
					<InputGroupButton
						type="submit"
						size="icon-sm"
						variant="default"
						disabled={!canSend}
						className="size-9 rounded-full"
						aria-label="Send message"
					>
						{isSending ? <Spinner /> : <ArrowUpIcon />}
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
			<p className="mt-2 text-center text-xs text-muted-foreground">
				ChaiGPT can make mistakes. Check important info.
			</p>
		</form>
	);
}
````

## File: features/conversation/components/chat-empty.tsx
````typescript
import { MessageSquareIcon } from "lucide-react";

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

/** Empty-state placeholder shown before the first message is sent. */
export function ChatEmpty() {
	return (
		<div className="flex flex-1 items-center justify-center px-4">
			<Empty className="border-0">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<MessageSquareIcon />
					</EmptyMedia>
					<EmptyTitle className="text-2xl tracking-tight">
						How can I help you today?
					</EmptyTitle>
					<EmptyDescription>
						Ask anything — replies stream in real time.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	);
}
````

## File: features/conversation/components/chat-messages.tsx
````typescript
"use client";

import { isTextUIPart, type UIMessage } from "ai";
import type { ChatStatus } from "ai";

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

/** Extracts plain text from a `UIMessage` by joining all text parts. */
function getMessageText(message: UIMessage) {
	return message.parts
		.filter(isTextUIPart)
		.map((part) => part.text)
		.join("");
}

type ChatMessagesProps = {
	messages: UIMessage[];
	status: ChatStatus;
};

/**
 * Renders the conversation message list with markdown responses and a loading indicator.
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
````

## File: features/conversation/components/chat-shell.tsx
````typescript
"use client";

import { AppSidebar } from "@/features/conversation/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

/**
 * App shell with collapsible sidebar and main content area for chat views.
 */
export function ChatShell({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="min-h-svh overflow-hidden">
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
````

## File: features/conversation/components/conversation-veiw.tsx
````typescript
"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport, type UIMessage } from "ai";
import React, { useMemo } from "react";
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

	const transport = useMemo(
		() =>
			new DefaultChatTransport({
				api: "/api/chat",
				prepareSendMessagesRequest: ({ id, messages }) => ({
					body: {
						id,
						message: messages.at(-1),
					},
				}),
			}),
		[],
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
					void sendMessage({ text });
				}}
				isSending={status !== "ready"}
				autoFocus
			/>
		</div>
	);
};
````

## File: features/conversation/hooks/use-conversation.ts
````typescript
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
````

## File: features/conversation/utils/query-keys.ts
````typescript
export const queryKeys = {
    conversations: {
        all: ["conversations"] as const,
        detail: (id: string) => ["conversations", id] as const,
    },
    messages: {
        byConversation: (conversationId: string) =>
            ["messages", conversationId] as const,
    },
};
````

## File: features/home/actions/start-new-chat.ts
````typescript
import { requireUser } from "@/features/auth/actions/require-user";
import { prisma } from "@/lib/db";

export async function startNewChat() {
	const user = await requireUser();

	const conversation = await prisma.conversation.create({
		data: {
			userId: user.id,
			title: "New Chat",
		},
	});

    return conversation.id
}
````

## File: features/messages/actions/messages-action.ts
````typescript
"use server";
import { requireUser } from "@/features/auth/actions/require-user";
import { prisma } from "@/lib/db";
import { MessageRole } from "@/lib/generated/prisma/browser";
import { revalidatePath } from "next/cache";

export type MessageItem = {
	id: string;
	conversationId: string;
	role: MessageRole;
	status: "PENDING" | "COMPLETE" | "ERROR";
	content: string;
	createdAt: Date;
	updatedAt: Date;
};

async function assertOwnConversation(conversationId: string, userId: string) {
	const conversation = await prisma.conversation.findFirst({
		where: {
			id: conversationId,
			userId: userId,
		},
	});

	if (!conversation) {
		throw new Error("Conversation not found");
	}
	return conversation;
}

export async function listMessages(
	conversationId: string,
): Promise<MessageItem[]> {
	const user = await requireUser();
	await assertOwnConversation(conversationId, user.id);
	return await prisma.message.findMany({
		where: { conversationId },
		orderBy: { createdAt: "asc" },
		select: {
			id: true,
			conversationId: true,
			role: true,
			status: true,
			content: true,
			createdAt: true,
			updatedAt: true,
		},
	});
}

export async function createMessage(conversationId: string, content: string) {
	const user = await requireUser();
	const conversation = await assertOwnConversation(conversationId, user.id);

	const trimmed = content.trim();
	if (!trimmed) {
		throw new Error("Message cannot be empty");
	}

	const message = await prisma.message.create({
		data: {
			conversationId,
			role: "USER",
			status: "COMPLETE",
			content: trimmed,
		},
	});

	const shouldRename =
		conversation.title === "New Chat" || conversation.title.trim() === "";

	await prisma.conversation.update({
		where: {
			id: conversationId,
		},
		data: {
			lastMessageAt: new Date(),
			...(shouldRename
				? {
						title: trimmed.length > 48 ? `${trimmed.slice(0, 48)}...` : trimmed,
					}
				: {}),
		},
	});

	revalidatePath("/");
	revalidatePath(`/c/${conversationId}`);
	return message;
}

export async function updateMessage(messageId: string, content: string) {
	const user = await requireUser();
	const trimmed = content.trim();

	if (!trimmed) {
		throw new Error("Content not found");
	}

	const existingMessage = await prisma.message.findUnique({
		where: {
			id: messageId,
		},
		include: {
			conversation: true,
		},
	});

	if (!existingMessage || existingMessage.conversation.userId !== user.id) {
		throw new Error("Message not found");
	}

	const message = await prisma.message.update({
		where: {
			id: messageId,
		},
		data: {
			content: trimmed,
		},
	});

	revalidatePath(`/c/${existingMessage.conversationId}`);
	return message;
}

export async function deleteMessage(messageId: string) {
	const user = await requireUser();
	const existingMessage = await prisma.message.findUnique({
		where: {
			id: messageId,
		},
		include: {
			conversation: true,
		},
	});

	if (!existingMessage || existingMessage.conversation.userId !== user.id) {
		throw new Error("Message not found");
	}

	await prisma.message.delete({
		where: {
			id: messageId,
		},
	});

	revalidatePath(`/c/${existingMessage.conversationId}`);
	return { id: messageId, conversationId: existingMessage.conversationId };
}
````

## File: features/messages/hooks/use-messages.ts
````typescript
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
````

## File: hooks/use-mobile.ts
````typescript
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
````

## File: lib/db.ts
````typescript
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'
import { env } from '@/env';


const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

function createPrismaClient() {
    const url = env.DATABASE_URL
    if (!url) {
        throw new Error('DATABASE_URL is not set')
    }

    const adapter = new PrismaPg({connectionString: url})

    return new PrismaClient({adapter})
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
````

## File: lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
````

## File: prisma/migrations/20260715073137_init_test/migration.sql
````sql
-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);
````

## File: prisma/migrations/20260715075517_user_model/migration.sql
````sql
/*
  Warnings:

  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Test";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
````

## File: prisma/migrations/20260715081938_complete_schema_design/migration.sql
````sql
-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM', 'TOOL');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'COMPLETE', 'ERROR');

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Chat',
    "model" TEXT,
    "systemPrompt" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'COMPLETE',
    "content" TEXT NOT NULL,
    "parts" JSONB NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_userId_lastMessageAt_idx" ON "Conversation"("userId", "lastMessageAt" DESC);

-- CreateIndex
CREATE INDEX "Conversation_userId_isPinned_lastMessageAt_idx" ON "Conversation"("userId", "isPinned", "lastMessageAt" DESC);

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
````

## File: prisma/migrations/20260716004559_message_update/migration.sql
````sql
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "parts" DROP NOT NULL;
````

## File: prisma/migrations/migration_lock.toml
````toml
# Please do not edit this file manually
# It should be added in your version-control system (e.g., Git)
provider = "postgresql"
````

## File: prisma/schema.prisma
````prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Get a free hosted Postgres database in seconds: `npx create-db`

generator client {
  provider = "prisma-client"
  output   = "../lib/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(uuid())
  clerkId   String   @unique
  email     String?  @unique
  firstName String?
  lastName  String?
  imageUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  conversations Conversation[]
}

model Conversation {
  id            String   @id @default(cuid())
  userId        String
  title         String   @default("New Chat")
  model         String? // e.g. openai/gpt-4.1 — per-thread model override
  systemPrompt  String?  @db.Text
  isPinned      Boolean  @default(false)
  isArchived    Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  lastMessageAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  messages Message[]

  @@index([userId, lastMessageAt(sort: Desc)])
  @@index([userId, isPinned, lastMessageAt(sort: Desc)])
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
  TOOL
}

enum MessageStatus {
  PENDING // created before streaming finishes
  COMPLETE
  ERROR
}

model Message {
  id             String        @id @default(cuid())
  conversationId String
  role           MessageRole
  status         MessageStatus @default(COMPLETE)
  content        String        @db.Text
  parts          Json? // 
  metadata       Json?

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([conversationId, createdAt(sort: Desc)])
}
````

## File: public/file.svg
````xml
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
````

## File: public/globe.svg
````xml
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
````

## File: public/next.svg
````xml
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
````

## File: public/vercel.svg
````xml
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
````

## File: public/window.svg
````xml
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
````

## File: .gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

/lib/generated/prisma
````

## File: AGENTS.md
````markdown
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
````

## File: CLAUDE.md
````markdown
@AGENTS.md
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "inverted-translucent",
  "menuAccent": "subtle",
  "registries": {}
}
````

## File: env.ts
````typescript
import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.url(),
	NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	CLERK_SECRET_KEY: z.string(),
	OPENROUTER_API_KEY: z.string(),
	OPENROUTER_BASE_URL: z.url().default("https://openrouter.ai/api/v1"),
});

function createEnvSchema(env: NodeJS.ProcessEnv) {
	const safeParseResult = envSchema.safeParse(env);
	if (!safeParseResult.success) {
		throw new Error(safeParseResult.error.message);
	}

	return safeParseResult.data
}


export const env = createEnvSchema(process.env)
````

## File: eslint.config.mjs
````javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
````

## File: next.config.ts
````typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
````

## File: package.json
````json
{
  "name": "synapse-chat",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@ai-sdk/openai": "^4.0.16",
    "@ai-sdk/react": "^4.0.34",
    "@base-ui/react": "^1.6.0",
    "@clerk/nextjs": "^7.5.18",
    "@prisma/adapter-pg": "^7.8.0",
    "@prisma/client": "^7.8.0",
    "@shadcn/react": "^0.2.1",
    "@streamdown/cjk": "^1.0.3",
    "@streamdown/code": "^1.1.1",
    "@streamdown/math": "^1.0.2",
    "@streamdown/mermaid": "^1.0.2",
    "@tanstack/react-query": "^5.101.2",
    "ai": "^7.0.30",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.4.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^1.24.0",
    "next": "16.2.10",
    "next-themes": "^0.4.6",
    "prisma": "^7.8.0",
    "radix-ui": "^1.6.2",
    "react": "19.2.4",
    "react-day-picker": "^10.0.1",
    "react-dom": "19.2.4",
    "react-resizable-panels": "^4.12.2",
    "recharts": "3.8.0",
    "shadcn": "^4.13.0",
    "sonner": "^2.0.7",
    "streamdown": "^2.5.0",
    "swr": "2.3.0",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0",
    "use-stick-to-bottom": "^1.1.6",
    "vaul": "^1.1.2",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.10",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "ignoreScripts": [
    "sharp",
    "unrs-resolver"
  ],
  "trustedDependencies": [
    "sharp",
    "unrs-resolver"
  ]
}
````

## File: postcss.config.mjs
````javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
````

## File: prisma.config.ts
````typescript
// This file was generated by Prisma, and assumes you have installed the following:
// npm install --save-dev prisma dotenv
import "dotenv/config";
import { defineConfig } from "prisma/config";
import { env } from "./env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env['DATABASE_URL'],
  },
});
````

## File: proxy.ts
````typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)"]);

/** Clerk authentication middleware; protects all routes except sign-in. */
export default clerkMiddleware(async (auth, req) => {
	if (!isPublicRoute(req)) {
		await auth.protect();
	}
});

/** Next.js middleware matcher — runs on app routes, API routes, and Clerk endpoints. */
export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
		// Always run for Clerk-specific frontend API routes
		"/__clerk/(.*)",
	],
};
````

## File: README.md
````markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
````
