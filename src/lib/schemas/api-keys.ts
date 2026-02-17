import { z } from "zod";

export const aiProviderSchema = z.enum(["openai", "anthropic"]);

export const apiKeysSchema = z.object({
	provider: aiProviderSchema,
	apiKey: z.string(),
});

export type AiProvider = z.infer<typeof aiProviderSchema>;
export type ApiKeys = z.infer<typeof apiKeysSchema>;
