import { type TemplateVariant, templateVariantSchema } from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

export function useTemplateVariant() {
	return useLocalStorage<TemplateVariant>(
		"template_variant",
		templateVariantSchema,
		"modern",
	);
}
