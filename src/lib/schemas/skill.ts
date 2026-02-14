import { z } from "zod";

export const SKILL_CATEGORIES = [
	"language",
	"framework",
	"database",
	"tool",
	"cloud",
	"testing",
	"ai",
	"soft",
	"other",
] as const;

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
	language: "Language",
	framework: "Framework / Library",
	database: "Database",
	tool: "Tool",
	cloud: "Cloud / DevOps",
	testing: "Testing",
	ai: "AI",
	soft: "Soft Skill",
	other: "Other",
};

export const skillCategorySchema = z.enum(SKILL_CATEGORIES);

export type SkillCategory = z.infer<typeof skillCategorySchema>;

export const skillSchema = z.object({
	name: z.string().min(1, "Skill name is required"),
	category: skillCategorySchema,
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
