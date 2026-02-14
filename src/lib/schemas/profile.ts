import { z } from "zod";

export const profileSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email"),
	phone: z.string().min(1, "Phone is required"),
	location: z.string().min(1, "Location is required"),
	linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
	github: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const profileStorageSchema = z.object({
	name: z.string(),
	email: z.string(),
	phone: z.string(),
	location: z.string(),
	linkedin: z.string().optional().or(z.literal("")),
	github: z.string().optional().or(z.literal("")),
});

export type Profile = z.infer<typeof profileSchema>;
