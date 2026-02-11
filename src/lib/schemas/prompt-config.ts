import { z } from "zod";

export const promptConfigSchema = z.object({
	targetCountry: z.enum(["FR", "US", "UK", "DE", "OTHER"]),
	seniorityLevel: z.enum(["junior", "mid", "senior", "lead", "principal"]),
	tone: z.enum(["technical", "business", "impact"]),
	atsOptimizationIntensity: z.number().min(1).max(5),
	customInstructions: z.string().max(1000),
});

export type PromptConfig = z.infer<typeof promptConfigSchema>;

export const defaultPromptConfig: PromptConfig = {
	targetCountry: "US",
	seniorityLevel: "mid",
	tone: "technical",
	atsOptimizationIntensity: 3,
	customInstructions: "",
};
