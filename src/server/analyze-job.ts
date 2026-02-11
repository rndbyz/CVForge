import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { ANALYSIS_SYSTEM_PROMPT } from "@/lib/prompts/system-prompt";
import { matchResultSchema } from "@/lib/schemas";

const inputSchema = z.object({
	apiKey: z.string().min(1),
	provider: z.enum(["openai", "anthropic"]),
	model: z.string().min(1),
	prompt: z.string().min(1),
});

export const analyzeJob = createServerFn({ method: "POST" })
	.inputValidator(inputSchema)
	.handler(async ({ data }) => {
		const model =
			data.provider === "openai"
				? createOpenAI({ apiKey: data.apiKey })(data.model)
				: createAnthropic({ apiKey: data.apiKey })(data.model);

		const result = await generateObject({
			model,
			schema: matchResultSchema,
			system: ANALYSIS_SYSTEM_PROMPT,
			prompt: data.prompt,
		});

		return result.object;
	});
