import { z } from "zod";

export const matchResultSchema = z.object({
	overallScore: z.number().min(0).max(100),
	matchedSkills: z.array(
		z.object({
			name: z.string(),
			relevance: z.number().min(0).max(100),
		}),
	),
	missingSkills: z.array(z.string()),
	recommendations: z.array(z.string()),
});

export type MatchResult = z.infer<typeof matchResultSchema>;
