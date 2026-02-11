import { z } from "zod";
import { experienceSchema } from "./experience";
import { skillSchema } from "./skill";

export const headerSchema = z.object({
	name: z.string().min(1, "Name is required"),
	title: z.string().min(1, "Title is required"),
	email: z.string().email("Invalid email"),
	phone: z.string().min(1, "Phone is required"),
	location: z.string().min(1, "Location is required"),
	linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
	github: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const educationSchema = z.object({
	degree: z.string().min(1, "Degree is required"),
	institution: z.string().min(1, "Institution is required"),
	period: z.string().min(1, "Period is required"),
	details: z.array(z.string()).optional(),
});

export const baseCvSchema = z.object({
	header: headerSchema,
	summary: z.string().min(1, "Summary is required").max(500),
	skills: z.array(skillSchema),
	experiences: z.array(experienceSchema),
	education: z.array(educationSchema),
});

export type Header = z.infer<typeof headerSchema>;
export type Education = z.infer<typeof educationSchema>;
export type BaseCV = z.infer<typeof baseCvSchema>;
