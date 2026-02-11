import {
	defaultPromptConfig,
	type PromptConfig,
	promptConfigSchema,
} from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

export function usePromptConfig() {
	return useLocalStorage<PromptConfig>(
		"prompt_config",
		promptConfigSchema,
		defaultPromptConfig,
	);
}
