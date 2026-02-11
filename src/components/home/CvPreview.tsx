import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { GeneratedCV } from "@/lib/schemas";

interface CvPreviewProps {
	generatedCv: GeneratedCV;
}

export function CvPreview({ generatedCv }: CvPreviewProps) {
	const { header, summary, skills, experiences, education } = generatedCv;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Generated CV Preview</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Header */}
				<div className="text-center">
					<h2 className="text-2xl font-bold">{header.name}</h2>
					<p className="text-lg text-muted-foreground">{header.title}</p>
					<div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
						<span className="flex items-center gap-1">
							<Mail className="h-3.5 w-3.5" />
							{header.email}
						</span>
						<span className="flex items-center gap-1">
							<Phone className="h-3.5 w-3.5" />
							{header.phone}
						</span>
						<span className="flex items-center gap-1">
							<MapPin className="h-3.5 w-3.5" />
							{header.location}
						</span>
						{header.linkedin && (
							<span className="flex items-center gap-1">
								<Linkedin className="h-3.5 w-3.5" />
								{header.linkedin}
							</span>
						)}
						{header.github && (
							<span className="flex items-center gap-1">
								<Github className="h-3.5 w-3.5" />
								{header.github}
							</span>
						)}
					</div>
				</div>

				<Separator />

				{/* Summary */}
				<div>
					<h3 className="mb-2 text-sm font-semibold uppercase tracking-wider">
						Professional Summary
					</h3>
					<p className="text-sm leading-relaxed">{summary}</p>
				</div>

				<Separator />

				{/* Skills */}
				{skills.length > 0 && (
					<div>
						<h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
							Skills
						</h3>
						<div className="space-y-2">
							{skills.map((group) => (
								<div key={group.category}>
									<span className="text-sm font-medium">{group.category}:</span>{" "}
									<span className="text-sm text-muted-foreground">
										{group.items.join(", ")}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				<Separator />

				{/* Experiences */}
				{experiences.length > 0 && (
					<div>
						<h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
							Experience
						</h3>
						<div className="space-y-4">
							{experiences.map((exp, i) => (
								<div key={i}>
									<div className="flex items-start justify-between">
										<div>
											<p className="font-medium">{exp.title}</p>
											<p className="text-sm text-muted-foreground">
												{exp.company}
												{exp.location && ` - ${exp.location}`}
											</p>
										</div>
										<span className="text-sm text-muted-foreground">
											{exp.period}
										</span>
									</div>
									<ul className="mt-1.5 list-inside list-disc space-y-0.5 text-sm">
										{exp.achievements.map((achievement, j) => (
											<li key={j}>{achievement}</li>
										))}
									</ul>
									{exp.tech && exp.tech.length > 0 && (
										<div className="mt-1.5 flex flex-wrap gap-1">
											{exp.tech.map((t) => (
												<Badge key={t} variant="secondary" className="text-xs">
													{t}
												</Badge>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				<Separator />

				{/* Education */}
				{education.length > 0 && (
					<div>
						<h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">
							Education
						</h3>
						<div className="space-y-3">
							{education.map((edu, i) => (
								<div key={i}>
									<div className="flex items-start justify-between">
										<div>
											<p className="font-medium">{edu.degree}</p>
											<p className="text-sm text-muted-foreground">
												{edu.institution}
											</p>
										</div>
										<span className="text-sm text-muted-foreground">
											{edu.period}
										</span>
									</div>
									{edu.details && edu.details.length > 0 && (
										<ul className="mt-1 list-inside list-disc text-sm">
											{edu.details.map((detail, j) => (
												<li key={j}>{detail}</li>
											))}
										</ul>
									)}
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
