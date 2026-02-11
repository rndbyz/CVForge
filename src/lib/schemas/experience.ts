import { z } from "zod";

export const experienceSchema = z.object({
	title: z.string().min(1, "Job title is required"),
	company: z.string().min(1, "Company is required"),
	location: z.string().optional(),
	period: z.string().min(1, "Period is required"),
	achievements: z
		.array(z.string().max(120, "Achievement must be 120 characters or less"))
		.min(1, "At least one achievement is required")
		.max(5, "Maximum 5 achievements"),
	tech: z.array(z.string()).optional(),
});

export type Experience = z.infer<typeof experienceSchema>;
