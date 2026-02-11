import { type Header, headerSchema } from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

const defaultProfile: Header = {
	name: "",
	title: "",
	email: "",
	phone: "",
	location: "",
	linkedin: "",
	github: "",
};

export function useProfile() {
	return useLocalStorage<Header>("user_profile", headerSchema, defaultProfile);
}
