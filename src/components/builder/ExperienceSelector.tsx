import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Experience, SelectedExperience } from "@/lib/schemas";
import { useBuilder } from "./BuilderContext";

export function ExperienceSelector() {
	const { experiences, setExperiences, tailored, setTailored } = useBuilder();
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingExp, setEditingExp] = useState<Experience | null>(null);

	const [form, setForm] = useState({
		company: "",
		location: "",
		period: "",
		tech: "",
		titles: [""],
		bullets: [""],
	});

	function getSelection(expId: string): SelectedExperience | undefined {
		return tailored.experiences.find((e) => e.experienceId === expId);
	}

	function isSelected(expId: string) {
		return tailored.experiences.some((e) => e.experienceId === expId);
	}

	function toggleExperience(exp: Experience) {
		setTailored((prev) => {
			if (prev.experiences.some((e) => e.experienceId === exp.id)) {
				return {
					...prev,
					experiences: prev.experiences.filter(
						(e) => e.experienceId !== exp.id,
					),
				};
			}
			return {
				...prev,
				experiences: [
					...prev.experiences,
					{
						experienceId: exp.id,
						selectedTitle: exp.titles[0],
						selectedBullets: [...exp.bullets],
					},
				],
			};
		});
	}

	function selectTitle(expId: string, title: string) {
		setTailored((prev) => ({
			...prev,
			experiences: prev.experiences.map((e) =>
				e.experienceId === expId ? { ...e, selectedTitle: title } : e,
			),
		}));
	}

	function toggleBullet(expId: string, bullet: string) {
		setTailored((prev) => ({
			...prev,
			experiences: prev.experiences.map((e) => {
				if (e.experienceId !== expId) return e;
				const has = e.selectedBullets.includes(bullet);
				return {
					...e,
					selectedBullets: has
						? e.selectedBullets.filter((b) => b !== bullet)
						: [...e.selectedBullets, bullet],
				};
			}),
		}));
	}

	function openAdd() {
		setEditingExp(null);
		setForm({
			company: "",
			location: "",
			period: "",
			tech: "",
			titles: [""],
			bullets: [""],
		});
		setDialogOpen(true);
	}

	function openEdit(exp: Experience) {
		setEditingExp(exp);
		setForm({
			company: exp.company,
			location: exp.location ?? "",
			period: exp.period,
			tech: exp.tech?.join(", ") ?? "",
			titles: [...exp.titles],
			bullets: [...exp.bullets],
		});
		setDialogOpen(true);
	}

	function saveExperience() {
		if (
			!form.company.trim() ||
			!form.period.trim() ||
			form.titles.filter((t) => t.trim()).length === 0 ||
			form.bullets.filter((b) => b.trim()).length === 0
		)
			return;

		const data: Omit<Experience, "id"> = {
			company: form.company.trim(),
			location: form.location.trim() || undefined,
			period: form.period.trim(),
			tech: form.tech
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean),
			titles: form.titles.filter((t) => t.trim()).map((t) => t.trim()),
			bullets: form.bullets.filter((b) => b.trim()).map((b) => b.trim()),
		};

		if (editingExp) {
			setExperiences((prev) =>
				prev.map((e) => (e.id === editingExp.id ? { ...data, id: e.id } : e)),
			);
		} else {
			const id = crypto.randomUUID();
			setExperiences((prev) => [...prev, { ...data, id }]);
		}
		setDialogOpen(false);
	}

	function deleteExperience(id: string) {
		setExperiences((prev) => prev.filter((e) => e.id !== id));
		setTailored((prev) => ({
			...prev,
			experiences: prev.experiences.filter((e) => e.experienceId !== id),
		}));
	}

	function addFormField(field: "titles" | "bullets") {
		setForm((f) => ({ ...f, [field]: [...f[field], ""] }));
	}

	function updateFormField(
		field: "titles" | "bullets",
		index: number,
		value: string,
	) {
		setForm((f) => ({
			...f,
			[field]: f[field].map((v, i) => (i === index ? value : v)),
		}));
	}

	function removeFormField(field: "titles" | "bullets", index: number) {
		setForm((f) => ({
			...f,
			[field]: f[field].filter((_, i) => i !== index),
		}));
	}

	return (
		<div className="space-y-2">
			{experiences.map((exp) => {
				const sel = getSelection(exp.id);
				const expanded = expandedId === exp.id;

				return (
					<div key={exp.id} className="rounded-md border">
						{/* Header */}
						<div className="flex items-center gap-2 p-2">
							<Checkbox
								checked={isSelected(exp.id)}
								onCheckedChange={() => toggleExperience(exp)}
							/>
							<button
								type="button"
								className="flex flex-1 items-center gap-1 text-left"
								onClick={() => setExpandedId(expanded ? null : exp.id)}
							>
								{expanded ? (
									<ChevronDown className="h-3 w-3 shrink-0" />
								) : (
									<ChevronRight className="h-3 w-3 shrink-0" />
								)}
								<div className="min-w-0">
									<p className="truncate text-sm font-medium">{exp.company}</p>
									<p className="text-xs text-muted-foreground">{exp.period}</p>
								</div>
							</button>
							<Button
								size="icon"
								variant="ghost"
								className="h-7 w-7"
								onClick={() => openEdit(exp)}
							>
								<Pencil className="h-3 w-3" />
							</Button>
							<Button
								size="icon"
								variant="ghost"
								className="h-7 w-7 text-destructive"
								onClick={() => deleteExperience(exp.id)}
							>
								<Trash2 className="h-3 w-3" />
							</Button>
						</div>

						{/* Expanded: title variants + bullets */}
						{expanded && isSelected(exp.id) && sel && (
							<div className="border-t px-2 py-2 pl-8 space-y-2">
								<div>
									<p className="text-xs font-semibold text-muted-foreground mb-1">
										Title variant
									</p>
									{exp.titles.map((title) => (
										<label
											key={title}
											className="flex items-center gap-2 py-0.5 text-sm"
										>
											<input
												type="radio"
												name={`title-${exp.id}`}
												checked={sel.selectedTitle === title}
												onChange={() => selectTitle(exp.id, title)}
											/>
											{title}
										</label>
									))}
								</div>
								<div>
									<p className="text-xs font-semibold text-muted-foreground mb-1">
										Bullet points
									</p>
									{exp.bullets.map((bullet) => (
										<label
											key={bullet}
											className="flex items-start gap-2 py-0.5 text-sm"
										>
											<Checkbox
												checked={sel.selectedBullets.includes(bullet)}
												onCheckedChange={() => toggleBullet(exp.id, bullet)}
												className="mt-0.5"
											/>
											<span className="text-xs leading-relaxed">{bullet}</span>
										</label>
									))}
								</div>
							</div>
						)}
					</div>
				);
			})}

			{experiences.length === 0 && (
				<p className="text-xs text-muted-foreground">No experiences yet.</p>
			)}

			<Button variant="outline" size="sm" className="w-full" onClick={openAdd}>
				<Plus className="mr-1 h-3 w-3" />
				Add experience
			</Button>

			{/* Add/Edit Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{editingExp ? "Edit Experience" : "Add Experience"}
						</DialogTitle>
					</DialogHeader>
					<div className="grid gap-3 py-2">
						<div className="grid grid-cols-2 gap-2">
							<div className="grid gap-1.5">
								<Label className="text-xs">Company</Label>
								<Input
									value={form.company}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											company: e.target.value,
										}))
									}
									className="h-8 text-sm"
								/>
							</div>
							<div className="grid gap-1.5">
								<Label className="text-xs">Location</Label>
								<Input
									value={form.location}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											location: e.target.value,
										}))
									}
									className="h-8 text-sm"
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<div className="grid gap-1.5">
								<Label className="text-xs">Period</Label>
								<Input
									value={form.period}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											period: e.target.value,
										}))
									}
									placeholder="2022 - Present"
									className="h-8 text-sm"
								/>
							</div>
							<div className="grid gap-1.5">
								<Label className="text-xs">Tech (comma-separated)</Label>
								<Input
									value={form.tech}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											tech: e.target.value,
										}))
									}
									placeholder="React, TypeScript"
									className="h-8 text-sm"
								/>
							</div>
						</div>

						{/* Title variants */}
						<div className="grid gap-1.5">
							<Label className="text-xs">
								Title variants ({form.titles.length})
							</Label>
							{form.titles.map((t, i) => (
								<div key={i} className="flex gap-1">
									<Input
										value={t}
										onChange={(e) =>
											updateFormField("titles", i, e.target.value)
										}
										placeholder={`Title variant ${i + 1}`}
										className="h-8 text-sm"
									/>
									{form.titles.length > 1 && (
										<Button
											size="icon"
											variant="ghost"
											className="h-8 w-8 shrink-0"
											onClick={() => removeFormField("titles", i)}
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									)}
								</div>
							))}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => addFormField("titles")}
							>
								<Plus className="mr-1 h-3 w-3" />
								Add variant
							</Button>
						</div>

						{/* Bullet points */}
						<div className="grid gap-1.5">
							<Label className="text-xs">
								Bullet points ({form.bullets.length})
							</Label>
							{form.bullets.map((b, i) => (
								<div key={i} className="flex gap-1">
									<Textarea
										value={b}
										onChange={(e) =>
											updateFormField("bullets", i, e.target.value)
										}
										placeholder={`Bullet point ${i + 1}`}
										className="min-h-[48px] text-sm"
									/>
									{form.bullets.length > 1 && (
										<Button
											size="icon"
											variant="ghost"
											className="h-8 w-8 shrink-0"
											onClick={() => removeFormField("bullets", i)}
										>
											<Trash2 className="h-3 w-3" />
										</Button>
									)}
								</div>
							))}
							<Button
								variant="ghost"
								size="sm"
								onClick={() => addFormField("bullets")}
							>
								<Plus className="mr-1 h-3 w-3" />
								Add bullet
							</Button>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={saveExperience}>
							{editingExp ? "Save" : "Add"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
