import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKeysForm } from "./ApiKeysForm";
import { BaseCvForm } from "./BaseCvForm";
import { ExperiencesManager } from "./ExperiencesManager";
import { ProfileForm } from "./ProfileForm";
import { PromptConfigForm } from "./PromptConfigForm";
import { SkillsManager } from "./SkillsManager";
import { TemplateSelector } from "./TemplateSelector";

export function SettingsPage() {
	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="mt-2 text-muted-foreground">
					Configure your profile, skills, and CV generation preferences.
				</p>
			</div>

			<Tabs defaultValue="profile" className="space-y-6">
				<TabsList className="grid w-full grid-cols-7">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="skills">Skills</TabsTrigger>
					<TabsTrigger value="experiences">Experience</TabsTrigger>
					<TabsTrigger value="base-cv">Base CV</TabsTrigger>
					<TabsTrigger value="prompt">Prompt</TabsTrigger>
					<TabsTrigger value="api-keys">API Keys</TabsTrigger>
					<TabsTrigger value="template">Template</TabsTrigger>
				</TabsList>

				<TabsContent value="profile">
					<ProfileForm />
				</TabsContent>

				<TabsContent value="skills">
					<SkillsManager />
				</TabsContent>

				<TabsContent value="experiences">
					<ExperiencesManager />
				</TabsContent>

				<TabsContent value="base-cv">
					<BaseCvForm />
				</TabsContent>

				<TabsContent value="prompt">
					<PromptConfigForm />
				</TabsContent>

				<TabsContent value="api-keys">
					<ApiKeysForm />
				</TabsContent>

				<TabsContent value="template">
					<TemplateSelector />
				</TabsContent>
			</Tabs>
		</div>
	);
}
