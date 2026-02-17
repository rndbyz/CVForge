import { useMemo } from "react";
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

export type ResolvedExperience = {
	company: string;
	location?: string;
	period: string;
	tech?: string[];
	selectedTitle: string;
	selectedBullets: string[];
};

export type ResolvedCV = {
	profile: Profile;
	title: string | null;
	introduction: string | null;
	skills: Skill[];
	experiences: ResolvedExperience[];
	education: Education[];
	certifications: Certification[];
};

export function useResolvedCv(
	profile: Profile,
	tailored: TailoredCV,
	cvTitles: CvTitle[],
	introductions: Introduction[],
	allSkills: Skill[],
	allExperiences: Experience[],
	allEducation: Education[],
	allCertifications: Certification[],
): ResolvedCV {
	return useMemo(() => {
		const title =
			cvTitles.find((t) => t.id === tailored.titleId)?.value ?? null;
		const introduction =
			introductions.find((i) => i.id === tailored.introductionId)?.text ?? null;
		const skills = allSkills.filter((s) =>
			tailored.selectedSkillNames.includes(s.name),
		);
		const experiences = tailored.experiences
			.map((sel) => {
				const kb = allExperiences.find((e) => e.id === sel.experienceId);
				if (!kb) return null;
				return {
					company: kb.company,
					location: kb.location,
					period: kb.period,
					tech: kb.tech,
					selectedTitle: sel.selectedTitle,
					selectedBullets: sel.selectedBullets,
				};
			})
			.filter((e): e is ResolvedExperience => e !== null);
		const education = allEducation.filter((e) =>
			tailored.educationIds.includes(e.id),
		);
		const certifications = allCertifications.filter((c) =>
			(tailored.certificationIds ?? []).includes(c.id),
		);
		return { profile, title, introduction, skills, experiences, education, certifications };
	}, [
		profile,
		tailored,
		cvTitles,
		introductions,
		allSkills,
		allExperiences,
		allEducation,
		allCertifications,
	]);
}
