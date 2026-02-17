import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocale } from "@/hooks";
import { CertificationEditor } from "./CertificationEditor";
import { EducationEditor } from "./EducationEditor";
import { ExperienceSelector } from "./ExperienceSelector";
import { IntroductionSelector } from "./IntroductionSelector";
import { ProfileEditor } from "./ProfileEditor";
import { SkillSelector } from "./SkillSelector";
import { TitleSelector } from "./TitleSelector";

export function KnowledgePanel() {
	const [, , t] = useLocale();

	return (
		<ScrollArea className="h-full">
			<div className="p-4">
				<h2 className="mb-4 text-lg font-semibold">{t("knowledgeBase")}</h2>
				<Accordion
					type="multiple"
					defaultValue={["profile", "titles", "skills", "experiences"]}
				>
					<AccordionItem value="profile">
						<AccordionTrigger>{t("profile")}</AccordionTrigger>
						<AccordionContent>
							<ProfileEditor />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="titles">
						<AccordionTrigger>{t("cvTitles")}</AccordionTrigger>
						<AccordionContent>
							<TitleSelector />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="introductions">
						<AccordionTrigger>{t("introductions")}</AccordionTrigger>
						<AccordionContent>
							<IntroductionSelector />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="skills">
						<AccordionTrigger>{t("skills")}</AccordionTrigger>
						<AccordionContent>
							<SkillSelector />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="experiences">
						<AccordionTrigger>{t("experiences")}</AccordionTrigger>
						<AccordionContent>
							<ExperienceSelector />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="education">
						<AccordionTrigger>{t("education")}</AccordionTrigger>
						<AccordionContent>
							<EducationEditor />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="certifications">
						<AccordionTrigger>{t("certifications")}</AccordionTrigger>
						<AccordionContent>
							<CertificationEditor />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</ScrollArea>
	);
}
