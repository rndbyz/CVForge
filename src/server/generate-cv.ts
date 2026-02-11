import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";
import { CV_SYSTEM_PROMPT } from "@/lib/prompts/system-prompt";
import { generatedCvSchema } from "@/lib/schemas";

const inputSchema = z.object({
	apiKey: z.string().min(1),
	provider: z.enum(["openai", "anthropic"]),
	model: z.string().min(1),
	prompt: z.string().min(1),
});

export const generateCV = createServerFn({ method: "POST" })
	.inputValidator(inputSchema)
	.handler(async ({ data }) => {
		const model =
			data.provider === "openai"
				? createOpenAI({ apiKey: data.apiKey })(data.model)
				: createAnthropic({ apiKey: data.apiKey })(data.model);

		const result = await generateObject({
			model,
			schema: generatedCvSchema,
			system: CV_SYSTEM_PROMPT,
			prompt: data.prompt,
		});

		return result.object;
	});
