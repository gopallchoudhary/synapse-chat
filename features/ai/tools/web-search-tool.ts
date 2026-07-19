import { tool } from "ai";
import { z } from "zod";
import { env } from "@/env";

export type SearchResult = {
	title: string;
	url: string;
	snippet: string;
};

const webSearchInputSchema = z.object({
	query: z
		.string()
		.describe(
			"A precise search query to retrieve relevant, current information",
		),
});

/**
 * AI SDK v7 tool that performs a web search via Tavily.
 * Returns the top 3 results (title, URL, snippet) to keep token usage minimal.
 *
 * Note: AI SDK v7 uses `inputSchema` instead of the v3/v4 `parameters` key.
 */
export const webSearchTool = tool({
	description:
		"Search the web for up-to-date information. Use this when the user asks about recent events, current data, live prices, news, or anything that may have changed after your training cutoff.",
	inputSchema: webSearchInputSchema,
	execute: async ({ query }) => {
		console.log("[web-search-tool] execute called with query:", query);
		const response = await fetch("https://api.tavily.com/search", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${env.TAVILY_API_KEY}`,
			},
			body: JSON.stringify({
				query,
				max_results: 3,
				include_answer: true,
				include_raw_content: false,
				search_depth: "basic",
			}),
		});

		if (!response.ok) {
			throw new Error(`Tavily search failed: ${response.statusText}`);
		}

		const data = (await response.json()) as {
			results?: Array<{ title: string; url: string; content: string }>;
		};

		const results: SearchResult[] = (data.results ?? []).map((r) => ({
			title: r.title,
			url: r.url,
			snippet: r.content,
		}));

		return results;
	},
});
