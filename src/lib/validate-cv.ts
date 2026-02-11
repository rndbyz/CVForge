import { type GeneratedCV, generatedCvSchema } from "@/lib/schemas";

export function validateGeneratedCV(data: unknown): {
	success: boolean;
	data?: GeneratedCV;
	errors?: string[];
} {
	const result = generatedCvSchema.safeParse(data);

	if (result.success) {
		return { success: true, data: result.data };
	}

	const errors = result.error.issues.map(
		(issue) => `${issue.path.join(".")}: ${issue.message}`,
	);

	return { success: false, errors };
}
