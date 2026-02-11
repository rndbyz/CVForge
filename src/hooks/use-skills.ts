import { z } from "zod";
import { type Skill, skillSchema } from "@/lib/schemas";
import { useLocalStorage } from "./use-local-storage";

const skillsArraySchema = z.array(skillSchema);

export function useSkills() {
	return useLocalStorage<Skill[]>("base_skills", skillsArraySchema, []);
}
