import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EducationEditor } from "./EducationEditor";
import { ExperienceSelector } from "./ExperienceSelector";
import { IntroductionSelector } from "./IntroductionSelector";
import { ProfileEditor } from "./ProfileEditor";
import { SkillSelector } from "./SkillSelector";
import { TitleSelector } from "./TitleSelector";

export function KnowledgePanel() {
	return (
		<ScrollArea className="h-full">
			<div className="p-4">
				<h2 className="mb-4 text-lg font-semibold">Knowledge Base</h2>
				<Accordion
					type="multiple"
					defaultValue={["profile", "titles", "skills", "experiences"]}
				>
					<AccordionItem value="profile">
						<AccordionTrigger>Profile</AccordionTrigger>
						<AccordionContent>
							<ProfileEditor />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="titles">
						<AccordionTrigger>CV Titles</AccordionTrigger>
						<AccordionContent>
							<TitleSelector />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="introductions">
						<AccordionTrigger>Introductions</AccordionTrigger>
						<AccordionContent>
							<IntroductionSelector />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="skills">
						<AccordionTrigger>Skills</AccordionTrigger>
						<AccordionContent>
							<SkillSelector />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="experiences">
						<AccordionTrigger>Experiences</AccordionTrigger>
						<AccordionContent>
							<ExperienceSelector />
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="education">
						<AccordionTrigger>Education</AccordionTrigger>
						<AccordionContent>
							<EducationEditor />
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</ScrollArea>
	);
}
