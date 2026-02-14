import { Github, Globe, Mail, MapPin, Phone } from "lucide-react";
import type { ResolvedCV } from "@/hooks/use-resolved-cv";
import { SKILL_CATEGORIES, SKILL_CATEGORY_LABELS } from "@/lib/schemas";

export function CvPreview({ resolved }: { resolved: ResolvedCV }) {
	const { profile, title, introduction, skills, experiences, education } =
		resolved;

	const hasContent =
		profile.name ||
		title ||
		introduction ||
		skills.length > 0 ||
		experiences.length > 0 ||
		education.length > 0;

	if (!hasContent) {
		return (
			<div className="flex h-full w-full max-w-[800px] items-center justify-center rounded-lg border bg-white p-12 shadow-sm">
				<p className="text-center text-muted-foreground">
					Start building your CV by adding content in the side panel.
				</p>
			</div>
		);
	}

	const skillsByCategory = SKILL_CATEGORIES.map((cat) => ({
		category: SKILL_CATEGORY_LABELS[cat],
		items: skills.filter((s) => s.category === cat),
	})).filter((group) => group.items.length > 0);

	return (
		<div className="w-full max-w-[800px] rounded-lg border bg-white shadow-sm">
			<div className="p-8 text-sm text-gray-800 leading-relaxed">
				{/* Header */}
				{profile.name && (
					<div className="mb-4 border-b pb-4 text-center">
						<h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
						{title && <p className="mt-1 text-base text-gray-600">{title}</p>}
						<div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
							{profile.email && (
								<span className="flex items-center gap-1">
									<Mail className="h-3 w-3" />
									{profile.email}
								</span>
							)}
							{profile.phone && (
								<span className="flex items-center gap-1">
									<Phone className="h-3 w-3" />
									{profile.phone}
								</span>
							)}
							{profile.location && (
								<span className="flex items-center gap-1">
									<MapPin className="h-3 w-3" />
									{profile.location}
								</span>
							)}
							{profile.linkedin && (
								<span className="flex items-center gap-1">
									<Globe className="h-3 w-3" />
									{profile.linkedin}
								</span>
							)}
							{profile.github && (
								<span className="flex items-center gap-1">
									<Github className="h-3 w-3" />
									{profile.github}
								</span>
							)}
						</div>
					</div>
				)}

				{/* Introduction */}
				{introduction && (
					<section className="mb-4">
						<h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">
							Summary
						</h2>
						<p className="text-gray-700">{introduction}</p>
					</section>
				)}

				{/* Skills */}
				{skillsByCategory.length > 0 && (
					<section className="mb-4">
						<h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
							Skills
						</h2>
						<div className="space-y-1">
							{skillsByCategory.map((group) => (
								<div key={group.category} className="flex gap-2">
									<span className="shrink-0 font-semibold text-gray-700">
										{group.category}:
									</span>
									<span className="text-gray-600">
										{group.items.map((s) => s.name).join(", ")}
									</span>
								</div>
							))}
						</div>
					</section>
				)}

				{/* Experiences */}
				{experiences.length > 0 && (
					<section className="mb-4">
						<h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
							Experience
						</h2>
						<div className="space-y-3">
							{experiences.map((exp, i) => (
								<div key={`${exp.company}-${i}`}>
									<div className="flex items-baseline justify-between">
										<div>
											<span className="font-semibold text-gray-900">
												{exp.selectedTitle}
											</span>
											<span className="text-gray-500">
												{" "}
												— {exp.company}
												{exp.location ? `, ${exp.location}` : ""}
											</span>
										</div>
										<span className="shrink-0 text-xs text-gray-400">
											{exp.period}
										</span>
									</div>
									{exp.selectedBullets.length > 0 && (
										<ul className="mt-1 list-disc space-y-0.5 pl-5 text-gray-600">
											{exp.selectedBullets.map((bullet, j) => (
												<li key={bullet}>{bullet}</li>
											))}
										</ul>
									)}
									{exp.tech && exp.tech.length > 0 && (
										<p className="mt-1 text-xs text-gray-400">
											Tech: {exp.tech.join(", ")}
										</p>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				{/* Education */}
				{education.length > 0 && (
					<section>
						<h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
							Education
						</h2>
						<div className="space-y-2">
							{education.map((edu) => (
								<div key={edu.id}>
									<div className="flex items-baseline justify-between">
										<div>
											<span className="font-semibold text-gray-900">
												{edu.degree}
											</span>
											<span className="text-gray-500">
												{" "}
												— {edu.institution}
											</span>
										</div>
										<span className="shrink-0 text-xs text-gray-400">
											{edu.period}
										</span>
									</div>
									{edu.details && edu.details.length > 0 && (
										<ul className="mt-1 list-disc pl-5 text-gray-600">
											{edu.details.map((d) => (
												<li key={d}>{d}</li>
											))}
										</ul>
									)}
								</div>
							))}
						</div>
					</section>
				)}
			</div>
		</div>
	);
}
