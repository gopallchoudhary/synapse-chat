"use client";

import * as React from "react";
import { ArrowUpIcon, GlobeIcon, PlusIcon } from "lucide-react";

import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type ChatComposerProps = {
	onSend: (content: string) => Promise<void> | void;
	isSending?: boolean;
	placeholder?: string;
	className?: string;
	autoFocus?: boolean;
	/** Whether web search is enabled for the next message. */
	webSearchEnabled?: boolean;
	/** Called when the user toggles web search on/off. */
	onWebSearchToggle?: (enabled: boolean) => void;
};

/**
 * Message input form with send button. Enter sends; Shift+Enter inserts a newline.
 * The left "+" button opens a popover to enable per-message web search.
 */
export function ChatComposer({
	onSend,
	isSending = false,
	placeholder = "Message ChaiGPT…",
	className,
	autoFocus = false,
	webSearchEnabled = false,
	onWebSearchToggle,
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
				{/* LEFT: web-search toggle button */}
				<InputGroupAddon align="inline-start" className="pl-2 pb-2 self-end">
					<Popover>
						<PopoverTrigger asChild>
							<InputGroupButton
								type="button"
								size="icon-sm"
								variant="ghost"
								className={cn(
									"size-9 rounded-full transition-colors",
									webSearchEnabled
										? "text-blue-500 hover:text-blue-600"
										: "text-muted-foreground hover:text-foreground",
								)}
								aria-label={
									webSearchEnabled
										? "Web search is on — click to change"
										: "Attachments and tools"
								}
							>
								{webSearchEnabled ? (
									<GlobeIcon className="size-5" />
								) : (
									<PlusIcon className="size-5" />
								)}
							</InputGroupButton>
						</PopoverTrigger>
						<PopoverContent
							side="top"
							align="start"
							sideOffset={8}
							className="w-52 p-1.5"
						>
							{/* Web search toggle row */}
							<button
								type="button"
								onClick={() => onWebSearchToggle?.(!webSearchEnabled)}
								className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							>
								<GlobeIcon
									className={cn(
										"size-4 shrink-0 transition-colors",
										webSearchEnabled
											? "text-blue-500"
											: "text-muted-foreground",
									)}
								/>
								<span className="flex-1 text-left font-medium">Web search</span>
								<Switch
									size="sm"
									checked={webSearchEnabled}
									onCheckedChange={onWebSearchToggle}
									aria-label="Toggle web search"
									// Prevent the button click from also firing the switch
									onClick={(e) => e.stopPropagation()}
								/>
							</button>
						</PopoverContent>
					</Popover>
				</InputGroupAddon>

				{/* CENTER: textarea */}
				<InputGroupTextarea
					ref={textareaRef}
					value={value}
					onChange={(event) => setValue(event.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={isSending}
					rows={1}
					className="max-h-48 min-h-12 py-3.5 pl-2 text-[15px] leading-relaxed"
				/>

				{/* RIGHT: send button */}
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
