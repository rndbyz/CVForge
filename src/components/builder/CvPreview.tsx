import { Award, Github, Globe, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ResolvedCV } from "@/hooks/use-resolved-cv";
import { useLocale } from "@/hooks";
import { SKILL_CATEGORIES, SKILL_CATEGORY_LABELS } from "@/lib/schemas";


/** Convert a mm value to pixels at runtime. */
function mmToPx(mm: number) {
	const temp = document.createElement("div");
	temp.style.height = `${mm}mm`;
	temp.style.position = "absolute";
	temp.style.visibility = "hidden";
	document.body.appendChild(temp);
	const px = temp.offsetHeight;
	document.body.removeChild(temp);
	return px;
}

const A4_HEIGHT_MM = 297;
const PAGE_GUTTER_MM = 10;

export function CvPreview({
	resolved,
	displayMode = "a4",
}: { resolved: ResolvedCV; displayMode?: "long" | "a4" }) {
	const { profile, title, introduction, skills, experiences, education, certifications } =
		resolved;
	const [, , t] = useLocale();

	const measureRef = useRef<HTMLDivElement>(null);
	const [pages, setPages] = useState(1);

	useEffect(() => {
		if (displayMode !== "a4" || !measureRef.current) {
			setPages(1);
			return;
		}

		const measure = () => {
			if (!measureRef.current) return;
			const pageH = mmToPx(A4_HEIGHT_MM);
			const gutterH = mmToPx(PAGE_GUTTER_MM);
			if (pageH <= 0) return;
			const contentH = measureRef.current.scrollHeight;
			const firstPageUsable = pageH - gutterH;
			const nextPageUsable = pageH - gutterH * 2;
			if (contentH <= firstPageUsable) {
				setPages(1);
			} else {
				setPages(1 + Math.max(1, Math.ceil((contentH - firstPageUsable) / nextPageUsable)));
			}
		};

		const observer = new ResizeObserver(measure);
		observer.observe(measureRef.current);
		return () => observer.disconnect();
	}, [displayMode]);

	const hasContent =
		profile.name ||
		title ||
		introduction ||
		skills.length > 0 ||
		experiences.length > 0 ||
		education.length > 0 ||
		certifications.length > 0;

	if (!hasContent) {
		return (
			<div className="flex h-full w-full max-w-200 items-center justify-center rounded-lg border bg-white p-12 shadow-sm">
				<p className="text-center text-muted-foreground">
					{t("startBuilding")}
				</p>
			</div>
		);
	}

	const skillsByCategory = SKILL_CATEGORIES.map((cat) => ({
		category: SKILL_CATEGORY_LABELS[cat],
		items: skills.filter((s) => s.category === cat),
	})).filter((group) => group.items.length > 0);

	const cvContent = (
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

			{/* Summary */}
			{introduction && (
				<section className="mb-4">
					<h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">
						{t("summary")}
					</h2>
					<p className="text-gray-700">{introduction}</p>
				</section>
			)}

			{/* Skills */}
			{skillsByCategory.length > 0 && (
				<section className="mb-4">
					<h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
						{t("skills")}
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
						{t("experience")}
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
										{exp.selectedBullets.map((bullet) => (
											<li key={bullet}>{bullet}</li>
										))}
									</ul>
								)}
								{exp.tech && exp.tech.length > 0 && (
									<p className="mt-1 text-xs text-gray-400">
										{t("tech")}: {exp.tech.join(", ")}
									</p>
								)}
							</div>
						))}
					</div>
				</section>
			)}

			{/* Education */}
			{education.length > 0 && (
				<section className="mb-4">
					<h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
						{t("education")}
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

			{/* Certifications */}
			{certifications.length > 0 && (
				<section>
					<h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
						{t("certifications")}
					</h2>
					<div className="space-y-1">
						{certifications.map((cert) => (
							<div key={cert.id} className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Award className="h-3 w-3 shrink-0 text-gray-400" />
									<div>
										<span className="font-semibold text-gray-900">
											{cert.name}
										</span>
										<span className="text-gray-500"> — {cert.issuer}</span>
										{cert.credentialId && (
											<span className="ml-1 text-xs text-gray-400">
												#{cert.credentialId}
											</span>
										)}
									</div>
								</div>
								<span className="shrink-0 text-xs text-gray-400">
									{cert.date}
									{cert.expiryDate ? ` → ${cert.expiryDate}` : ""}
								</span>
							</div>
						))}
					</div>
				</section>
			)}
		</div>
	);

	/* ---- Long mode: single flowing block ---- */
	if (displayMode !== "a4") {
		return (
			<div className="w-full max-w-200 rounded-lg border bg-white shadow-sm">
				{cvContent}
			</div>
		);
	}

	/* ---- A4 mode: separate pages ---- */
	const gutterSize = `${PAGE_GUTTER_MM}mm`;
	const firstUsable = `${A4_HEIGHT_MM - PAGE_GUTTER_MM}mm`;
	const nextUsable = `${A4_HEIGHT_MM - PAGE_GUTTER_MM * 2}mm`;

	return (
		<div className="flex flex-col gap-6">
			{/* Hidden measuring div to compute page count */}
			<div
				ref={measureRef}
				aria-hidden
				className="pointer-events-none absolute w-[210mm] opacity-0"
			>
				{cvContent}
			</div>

			{/* Visible page slices */}
			{Array.from({ length: pages }).map((_, i) => (
				<div
					key={i}
					className="relative flex w-[210mm] h-[297mm] flex-col rounded-lg border bg-white shadow-sm"
				>
					{/* Top gutter (blank spacer) */}
					{i > 0 && <div className="shrink-0" style={{ height: gutterSize }} />}

					{/* Clipped content area */}
					<div className="flex-1 overflow-hidden">
						<div
							style={{
								marginTop: i === 0
									? "0"
									: `calc(-1 * ${firstUsable} - ${i - 1} * ${nextUsable})`,
							}}
						>
							{cvContent}
						</div>
					</div>

					{/* Bottom gutter (blank spacer) */}
					<div className="shrink-0" style={{ height: gutterSize }} />

					{/* Page number */}
					<span className="absolute bottom-2 right-3 text-[10px] text-gray-400">
						{i + 1} / {pages}
					</span>
				</div>
			))}
		</div>
	);
}
