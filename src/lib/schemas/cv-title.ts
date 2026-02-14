import { z } from "zod";

export const cvTitleSchema = z.object({
	id: z.string(),
	value: z.string().min(1, "Title cannot be empty"),
});

export const cvTitlesSchema = z.array(cvTitleSchema);

export type CvTitle = z.infer<typeof cvTitleSchema>;
