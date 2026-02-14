import { z } from "zod";

export const experienceSchema = z.object({
	id: z.string(),
	company: z.string().min(1, "Company is required"),
	location: z.string().optional(),
	period: z.string().min(1, "Period is required"),
	tech: z.array(z.string()).optional(),
	titles: z
		.array(z.string().min(1))
		.min(1, "At least one title variant is required"),
	bullets: z
		.array(z.string().min(1))
		.min(1, "At least one bullet point is required"),
});

export const experiencesSchema = z.array(experienceSchema);

export type Experience = z.infer<typeof experienceSchema>;
