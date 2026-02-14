import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	SKILL_CATEGORIES,
	SKILL_CATEGORY_LABELS,
	type Skill,
	type SkillCategory,
} from "@/lib/schemas";
import { useBuilder } from "./BuilderContext";

const defaultSkill: Omit<Skill, "name"> = {
	category: "other",
	level: 3,
	years: 1,
	priority: 5,
};

export function SkillSelector() {
	const { skills, setSkills, tailored, setTailored } = useBuilder();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
	const [form, setForm] = useState({ name: "", ...defaultSkill });

	const grouped = SKILL_CATEGORIES.map((cat) => ({
		category: cat,
		label: SKILL_CATEGORY_LABELS[cat],
		items: skills.filter((s) => s.category === cat),
	})).filter((g) => g.items.length > 0);

	function toggleSkill(name: string) {
		setTailored((prev) => ({
			...prev,
			selectedSkillNames: prev.selectedSkillNames.includes(name)
				? prev.selectedSkillNames.filter((n) => n !== name)
				: [...prev.selectedSkillNames, name],
		}));
	}

	function openAdd() {
		setEditingSkill(null);
		setForm({ name: "", ...defaultSkill });
		setDialogOpen(true);
	}

	function openEdit(skill: Skill) {
		setEditingSkill(skill);
		setForm({ ...skill });
		setDialogOpen(true);
	}

	function saveSkill() {
		if (!form.name.trim()) return;
		const skill: Skill = { ...form, name: form.name.trim() };

		if (editingSkill) {
			setSkills((prev) =>
				prev.map((s) => (s.name === editingSkill.name ? skill : s)),
			);
			if (
				editingSkill.name !== skill.name &&
				tailored.selectedSkillNames.includes(editingSkill.name)
			) {
				setTailored((prev) => ({
					...prev,
					selectedSkillNames: prev.selectedSkillNames.map((n) =>
						n === editingSkill.name ? skill.name : n,
					),
				}));
			}
		} else {
			setSkills((prev) => [...prev, skill]);
		}
		setDialogOpen(false);
	}

	function deleteSkill(name: string) {
		setSkills((prev) => prev.filter((s) => s.name !== name));
		setTailored((prev) => ({
			...prev,
			selectedSkillNames: prev.selectedSkillNames.filter((n) => n !== name),
		}));
	}

	return (
		<div className="space-y-3">
			{grouped.map((group) => (
				<div key={group.category}>
					<p className="mb-1 text-xs font-semibold text-muted-foreground">
						{group.label}
					</p>
					<div className="space-y-1">
						{group.items.map((skill) => (
							<div
								key={skill.name}
								className="flex items-center gap-2 rounded-md border px-2 py-1.5"
							>
								<Checkbox
									checked={tailored.selectedSkillNames.includes(skill.name)}
									onCheckedChange={() => toggleSkill(skill.name)}
								/>
								<span className="flex-1 text-sm">{skill.name}</span>
								<Badge variant="outline" className="text-[10px]">
									{skill.level}/5
								</Badge>
								<Button
									size="icon"
									variant="ghost"
									className="h-6 w-6"
									onClick={() => openEdit(skill)}
								>
									<Pencil className="h-3 w-3" />
								</Button>
								<Button
									size="icon"
									variant="ghost"
									className="h-6 w-6 text-destructive"
									onClick={() => deleteSkill(skill.name)}
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
						))}
					</div>
				</div>
			))}

			{skills.length === 0 && (
				<p className="text-xs text-muted-foreground">No skills yet.</p>
			)}

			<Button variant="outline" size="sm" className="w-full" onClick={openAdd}>
				<Plus className="mr-1 h-3 w-3" />
				Add skill
			</Button>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							{editingSkill ? "Edit Skill" : "Add Skill"}
						</DialogTitle>
					</DialogHeader>
					<div className="grid gap-3 py-2">
						<div className="grid gap-1.5">
							<Label className="text-xs">Name</Label>
							<Input
								value={form.name}
								onChange={(e) =>
									setForm((f) => ({ ...f, name: e.target.value }))
								}
								placeholder="e.g. TypeScript"
								className="h-8 text-sm"
							/>
						</div>
						<div className="grid gap-1.5">
							<Label className="text-xs">Category</Label>
							<Select
								value={form.category}
								onValueChange={(v) =>
									setForm((f) => ({
										...f,
										category: v as SkillCategory,
									}))
								}
							>
								<SelectTrigger className="h-8 text-sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{SKILL_CATEGORIES.map((cat) => (
										<SelectItem key={cat} value={cat}>
											{SKILL_CATEGORY_LABELS[cat]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-3 gap-2">
							<div className="grid gap-1.5">
								<Label className="text-xs">Level (1-5)</Label>
								<Input
									type="number"
									min={1}
									max={5}
									value={form.level}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											level: Math.max(1, Math.min(5, Number(e.target.value))) as
												| 1
												| 2
												| 3
												| 4
												| 5,
										}))
									}
									className="h-8 text-sm"
								/>
							</div>
							<div className="grid gap-1.5">
								<Label className="text-xs">Years</Label>
								<Input
									type="number"
									min={0}
									max={50}
									value={form.years}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											years: Number(e.target.value),
										}))
									}
									className="h-8 text-sm"
								/>
							</div>
							<div className="grid gap-1.5">
								<Label className="text-xs">Priority (1-10)</Label>
								<Input
									type="number"
									min={1}
									max={10}
									value={form.priority}
									onChange={(e) =>
										setForm((f) => ({
											...f,
											priority: Number(e.target.value),
										}))
									}
									className="h-8 text-sm"
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={saveSkill}>{editingSkill ? "Save" : "Add"}</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
