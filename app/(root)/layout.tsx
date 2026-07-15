import { onBoardUser } from "@/features/auth/actions/onboard";
import { auth } from "@clerk/nextjs/server";
import React from "react";

export default async function RootGroupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	await auth.protect();
	await onBoardUser();
	return <div>{children}</div>;
}
