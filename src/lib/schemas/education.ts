import { z } from "zod";

export const educationSchema = z.object({
	id: z.string(),
	degree: z.string().min(1, "Degree is required"),
	institution: z.string().min(1, "Institution is required"),
	period: z.string().min(1, "Period is required"),
	details: z.array(z.string()).optional(),
});

export const educationsSchema = z.array(educationSchema);

export type Education = z.infer<typeof educationSchema>;
