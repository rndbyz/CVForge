import { z } from "zod";
import {
	profileStorageSchema,
	cvTitlesSchema,
	introductionsSchema,
	skillSchema,
	experiencesSchema,
	educationsSchema,
	certificationsSchema,
	savedCvsSchema,
} from "./schemas";

const STORAGE_KEYS = {
	profile: "user_profile",
	cvTitles: "kb_cv_titles",
	introductions: "kb_introductions",
	skills: "base_skills",
	experiences: "kb_experiences",
	education: "kb_education",
	certifications: "kb_certifications",
	savedCvs: "saved_cvs",
} as const;

const exportSchema = z.object({
	_version: z.literal(1),
	_exportedAt: z.string(),
	profile: profileStorageSchema.optional(),
	cvTitles: cvTitlesSchema.optional(),
	introductions: introductionsSchema.optional(),
	skills: z.array(skillSchema).optional(),
	experiences: experiencesSchema.optional(),
	education: educationsSchema.optional(),
	certifications: certificationsSchema.optional(),
	savedCvs: savedCvsSchema.optional(),
});

export type ExportData = z.infer<typeof exportSchema>;

export function exportAllData(): ExportData {
	const data: ExportData = {
		_version: 1,
		_exportedAt: new Date().toISOString(),
	};

	for (const [field, key] of Object.entries(STORAGE_KEYS)) {
		try {
			const raw = localStorage.getItem(key);
			if (raw) {
				data[field as keyof typeof STORAGE_KEYS] = JSON.parse(raw);
			}
		} catch {
			// skip corrupted entries
		}
	}

	return data;
}

export function downloadExport(data: ExportData) {
	const json = JSON.stringify(data, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `cvforge-export-${new Date().toISOString().slice(0, 10)}.json`;
	a.click();
	URL.revokeObjectURL(url);
}

export function importAllData(data: unknown): { success: boolean; error?: string } {
	const result = exportSchema.safeParse(data);
	if (!result.success) {
		return { success: false, error: "Invalid file format" };
	}

	const parsed = result.data;

	for (const [field, key] of Object.entries(STORAGE_KEYS)) {
		const value = parsed[field as keyof typeof STORAGE_KEYS];
		if (value !== undefined) {
			localStorage.setItem(key, JSON.stringify(value));
		}
	}

	return { success: true };
}

export function readJsonFile(file: File): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				resolve(JSON.parse(reader.result as string));
			} catch {
				reject(new Error("Invalid JSON file"));
			}
		};
		reader.onerror = () => reject(new Error("Failed to read file"));
		reader.readAsText(file);
	});
}
