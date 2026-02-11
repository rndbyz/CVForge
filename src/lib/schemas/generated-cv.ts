import { z } from "zod";

export const generatedCvSchema = z.object({
	header: z.object({
		name: z.string(),
		title: z.string(),
		email: z.string(),
		phone: z.string(),
		location: z.string(),
		linkedin: z.string().optional(),
		github: z.string().optional(),
	}),
	summary: z.string(),
	skills: z.array(
		z.object({
			category: z.string(),
			items: z.array(z.string()),
		}),
	),
	experiences: z.array(
		z.object({
			title: z.string(),
			company: z.string(),
			location: z.string().optional(),
			period: z.string(),
			achievements: z.array(z.string().max(120)).max(5),
			tech: z.array(z.string()).optional(),
		}),
	),
	education: z.array(
		z.object({
			degree: z.string(),
			institution: z.string(),
			period: z.string(),
			details: z.array(z.string()).optional(),
		}),
	),
});

export type GeneratedCV = z.infer<typeof generatedCvSchema>;
