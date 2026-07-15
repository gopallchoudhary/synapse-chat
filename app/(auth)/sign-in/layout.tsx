import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<div className="w-full max-w-md">{children}</div>
		</main>
	);
};

export default AuthLayout;