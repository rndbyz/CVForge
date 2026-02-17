import { createContext, useContext } from "react";
import type {
	Certification,
	CvTitle,
	Education,
	Experience,
	Introduction,
	Profile,
	Skill,
	TailoredCV,
} from "@/lib/schemas";

type Setter<T> = (value: T | ((prev: T) => T)) => void;

export type BuilderContextValue = {
	// Knowledge base (shared, auto-persisted)
	profile: Profile;
	setProfile: Setter<Profile>;
	cvTitles: CvTitle[];
	setCvTitles: Setter<CvTitle[]>;
	introductions: Introduction[];
	setIntroductions: Setter<Introduction[]>;
	skills: Skill[];
	setSkills: Setter<Skill[]>;
	experiences: Experience[];
	setExperiences: Setter<Experience[]>;
	education: Education[];
	setEducation: Setter<Education[]>;
	certifications: Certification[];
	setCertifications: Setter<Certification[]>;

	// Current CV working copy (in-memory until save)
	tailored: TailoredCV;
	setTailored: Setter<TailoredCV>;
	cvName: string;
	setCvName: (name: string) => void;

	// Actions
	onSave: () => void;
	onReset: () => void;
	hasUnsavedChanges: boolean;
};

const BuilderContext = createContext<BuilderContextValue | null>(null);

export const BuilderProvider = BuilderContext.Provider;

export function useBuilder() {
	const ctx = useContext(BuilderContext);
	if (!ctx) throw new Error("useBuilder must be used within BuilderProvider");
	return ctx;
}
