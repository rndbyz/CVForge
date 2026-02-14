import { z } from "zod";

export const introductionSchema = z.object({
	id: z.string(),
	label: z.string().min(1, "Label is required"),
	text: z.string().min(1, "Introduction text is required"),
});

export const introductionsSchema = z.array(introductionSchema);

export type Introduction = z.infer<typeof introductionSchema>;
