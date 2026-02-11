import { type BaseCV, baseCvSchema } from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

const defaultBaseCV: BaseCV = {
	header: {
		name: "",
		title: "",
		email: "",
		phone: "",
		location: "",
		linkedin: "",
		github: "",
	},
	summary: "",
	skills: [],
	experiences: [],
	education: [],
};

export function useBaseCv() {
	return useLocalStorage<BaseCV>("base_cv", baseCvSchema, defaultBaseCV);
}
