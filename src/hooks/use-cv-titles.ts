import { type CvTitle, cvTitlesSchema } from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

export function useCvTitles() {
	return useLocalStorage<CvTitle[]>("kb_cv_titles", cvTitlesSchema, []);
}
