import { apiKeysSchema, type ApiKeys } from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

const DEFAULT_API_KEYS: ApiKeys = {
	provider: "openai",
	apiKey: "",
};

export function useApiKeys() {
	return useLocalStorage("api_keys", apiKeysSchema, DEFAULT_API_KEYS);
}
