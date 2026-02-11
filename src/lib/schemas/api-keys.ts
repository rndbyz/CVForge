import { z } from "zod";

export const apiKeysSchema = z.object({
	openai: z.string(),
	anthropic: z.string(),
	provider: z.enum(["openai", "anthropic"]),
	model: z.string(),
});

export type ApiKeys = z.infer<typeof apiKeysSchema>;

export const defaultApiKeys: ApiKeys = {
	openai: "",
	anthropic: "",
	provider: "openai",
	model: "gpt-4o",
};
