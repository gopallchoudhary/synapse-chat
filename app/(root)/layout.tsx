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