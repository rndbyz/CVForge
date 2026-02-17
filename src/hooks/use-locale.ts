import { z } from "zod";
import { useLocalStorage } from "./use-local-storage";
import { translations, type Locale, type TranslationKey } from "@/lib/i18n";

const localeSchema = z.enum(["en", "fr"]);

export function useLocale(): [Locale, (l: Locale) => void, (key: TranslationKey) => string] {
	const [locale, setLocale] = useLocalStorage<Locale>(
		"app_locale",
		localeSchema,
		"en",
	);

	const t = (key: TranslationKey): string => translations[locale][key];

	return [locale, setLocale, t];
}
