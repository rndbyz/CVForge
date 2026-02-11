import { type ApiKeys, apiKeysSchema, defaultApiKeys } from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

export function useApiKeys() {
	return useLocalStorage<ApiKeys>("api_keys", apiKeysSchema, defaultApiKeys);
}
