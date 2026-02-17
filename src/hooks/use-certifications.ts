import { certificationsSchema, type Certification } from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

export function useCertifications() {
	return useLocalStorage<Certification[]>(
		"kb_certifications",
		certificationsSchema,
		[],
	);
}
