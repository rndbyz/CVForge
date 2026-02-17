import { z } from "zod";

export const selectedExperienceSchema = z.object({
	experienceId: z.string(),
	selectedTitle: z.string(),
	selectedBullets: z.array(z.string()),
});

export const tailoredCvSchema = z.object({
	id: z.string(),
	name: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	titleId: z.string().optional(),
	introductionId: z.string().optional(),
	selectedSkillNames: z.array(z.string()),
	experiences: z.array(selectedExperienceSchema),
	educationIds: z.array(z.string()),
	certificationIds: z.array(z.string()).optional(),
	jobDescription: z.string().optional(),
});

export const savedCvsSchema = z.array(tailoredCvSchema);

export type SelectedExperience = z.infer<typeof selectedExperienceSchema>;
export type TailoredCV = z.infer<typeof tailoredCvSchema>;
export type SavedCvs = z.infer<typeof savedCvsSchema>;
