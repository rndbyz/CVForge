import { z } from "zod";

export const skillSchema = z.object({
	name: z.string().min(1, "Skill name is required"),
	level: z.union([
		z.literal(1),
		z.literal(2),
		z.literal(3),
		z.literal(4),
		z.literal(5),
	]),
	years: z.number().min(0).max(50),
	priority: z.number().min(1).max(10),
});

export type Skill = z.infer<typeof skillSchema>;
