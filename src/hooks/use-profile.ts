import { type Profile, profileStorageSchema } from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

const defaultProfile: Profile = {
	name: "",
	email: "",
	phone: "",
	location: "",
	linkedin: "",
	github: "",
};

export function useProfile() {
	return useLocalStorage<Profile>(
		"user_profile",
		profileStorageSchema,
		defaultProfile,
	);
}
