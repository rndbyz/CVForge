import { type Education, educationsSchema } from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

export function useEducation() {
	return useLocalStorage<Education[]>("kb_education", educationsSchema, []);
}
