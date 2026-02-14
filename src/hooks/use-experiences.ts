import { type Experience, experiencesSchema } from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

export function useExperiences() {
	return useLocalStorage<Experience[]>("kb_experiences", experiencesSchema, []);
}
