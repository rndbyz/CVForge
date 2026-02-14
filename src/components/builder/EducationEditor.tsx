import { Pencil, Plus, Trash2 } from "lucide-react";
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
import type { Education } from "@/lib/schemas";
import { useBuilder } from "./BuilderContext";

export function EducationEditor() {
	const { education, setEducation, tailored, setTailored } = useBuilder();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingEdu, setEditingEdu] = useState<Education | null>(null);
	const [form, setForm] = useState({
		degree: "",
		institution: "",
		period: "",
		details: "",
	});

	function toggleEducation(id: string) {
		setTailored((prev) => ({
			...prev,
			educationIds: prev.educationIds.includes(id)
				? prev.educationIds.filter((eid) => eid !== id)
				: [...prev.educationIds, id],
		}));
	}

	function openAdd() {
		setEditingEdu(null);
		setForm({ degree: "", institution: "", period: "", details: "" });
		setDialogOpen(true);
	}

	function openEdit(edu: Education) {
		setEditingEdu(edu);
		setForm({
			degree: edu.degree,
			institution: edu.institution,
			period: edu.period,
			details: edu.details?.join("\n") ?? "",
		});
		setDialogOpen(true);
	}

	function saveEducation() {
		if (!form.degree.trim() || !form.institution.trim() || !form.period.trim())
			return;

		const details = form.details
			.split("\n")
			.map((d) => d.trim())
			.filter(Boolean);

		const data: Omit<Education, "id"> = {
			degree: form.degree.trim(),
			institution: form.institution.trim(),
			period: form.period.trim(),
			details: details.length > 0 ? details : undefined,
		};

		if (editingEdu) {
			setEducation((prev) =>
				prev.map((e) => (e.id === editingEdu.id ? { ...data, id: e.id } : e)),
			);
		} else {
			const id = crypto.randomUUID();
			setEducation((prev) => [...prev, { ...data, id }]);
		}
		setDialogOpen(false);
	}

	function deleteEducation(id: string) {
		setEducation((prev) => prev.filter((e) => e.id !== id));
		setTailored((prev) => ({
			...prev,
			educationIds: prev.educationIds.filter((eid) => eid !== id),
		}));
	}

	return (
		<div className="space-y-2">
			{education.map((edu) => (
				<div
					key={edu.id}
					className="flex items-center gap-2 rounded-md border p-2"
				>
					<Checkbox
						checked={tailored.educationIds.includes(edu.id)}
						onCheckedChange={() => toggleEducation(edu.id)}
					/>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium">{edu.degree}</p>
						<p className="text-xs text-muted-foreground">
							{edu.institution} — {edu.period}
						</p>
					</div>
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7"
						onClick={() => openEdit(edu)}
					>
						<Pencil className="h-3 w-3" />
					</Button>
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7 text-destructive"
						onClick={() => deleteEducation(edu.id)}
					>
						<Trash2 className="h-3 w-3" />
					</Button>
				</div>
			))}

			{education.length === 0 && (
				<p className="text-xs text-muted-foreground">No education yet.</p>
			)}

			<Button variant="outline" size="sm" className="w-full" onClick={openAdd}>
				<Plus className="mr-1 h-3 w-3" />
				Add education
			</Button>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{editingEdu ? "Edit Education" : "Add Education"}
						</DialogTitle>
					</DialogHeader>
					<div className="grid gap-3 py-2">
						<div className="grid gap-1.5">
							<Label className="text-xs">Degree</Label>
							<Input
								value={form.degree}
								onChange={(e) =>
									setForm((f) => ({ ...f, degree: e.target.value }))
								}
								placeholder="e.g. Master of Computer Science"
								className="h-8 text-sm"
							/>
						</div>
						<div className="grid gap-1.5">
							<Label className="text-xs">Institution</Label>
							<Input
								value={form.institution}
								onChange={(e) =>
									setForm((f) => ({
										...f,
										institution: e.target.value,
									}))
								}
								className="h-8 text-sm"
							/>
						</div>
						<div className="grid gap-1.5">
							<Label className="text-xs">Period</Label>
							<Input
								value={form.period}
								onChange={(e) =>
									setForm((f) => ({ ...f, period: e.target.value }))
								}
								placeholder="2018 - 2020"
								className="h-8 text-sm"
							/>
						</div>
						<div className="grid gap-1.5">
							<Label className="text-xs">
								Details (one per line, optional)
							</Label>
							<Input
								value={form.details}
								onChange={(e) =>
									setForm((f) => ({
										...f,
										details: e.target.value,
									}))
								}
								placeholder="Honours, specialization..."
								className="h-8 text-sm"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={saveEducation}>
							{editingEdu ? "Save" : "Add"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
