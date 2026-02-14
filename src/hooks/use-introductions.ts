import { type Introduction, introductionsSchema } from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

export function useIntroductions() {
	return useLocalStorage<Introduction[]>(
		"kb_introductions",
		introductionsSchema,
		[],
	);
}
