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
