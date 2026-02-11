import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useSkills } from "@/hooks";
import { type Skill, skillSchema } from "@/lib/schemas";

const LEVEL_LABELS: Record<number, string> = {
	1: "Beginner",
	2: "Elementary",
	3: "Intermediate",
	4: "Advanced",
	5: "Expert",
};

function SkillForm({
	defaultValues,
	onSave,
	onClose,
}: {
	defaultValues?: Skill;
	onSave: (skill: Skill) => void;
	onClose: () => void;
}) {
	const form = useForm<Skill>({
		resolver: zodResolver(skillSchema),
		defaultValues: defaultValues ?? {
			name: "",
			level: 3,
			years: 1,
			priority: 5,
		},
	});

	function onSubmit(data: Skill) {
		onSave(data);
		onClose();
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Skill Name</FormLabel>
							<FormControl>
								<Input placeholder="TypeScript" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="level"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Level</FormLabel>
							<Select
								onValueChange={(val) => field.onChange(Number(val))}
								value={String(field.value)}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select level" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{[1, 2, 3, 4, 5].map((lvl) => (
										<SelectItem key={lvl} value={String(lvl)}>
											{lvl} — {LEVEL_LABELS[lvl]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="years"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Years of Experience</FormLabel>
								<FormControl>
									<Input
										type="number"
										min={0}
										max={50}
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="priority"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Priority (1–10)</FormLabel>
								<FormControl>
									<Input
										type="number"
										min={1}
										max={10}
										{...field}
										onChange={(e) => field.onChange(Number(e.target.value))}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit">Save Skill</Button>
				</div>
			</form>
		</Form>
	);
}

export function SkillsManager() {
	const [skills, setSkills] = useSkills();
	const [addOpen, setAddOpen] = useState(false);
	const [editIndex, setEditIndex] = useState<number | null>(null);

	function handleAdd(skill: Skill) {
		setSkills((prev) => [...prev, skill]);
		toast.success(`"${skill.name}" added.`);
	}

	function handleEdit(index: number, skill: Skill) {
		setSkills((prev) => prev.map((s, i) => (i === index ? skill : s)));
		toast.success(`"${skill.name}" updated.`);
	}

	function handleDelete(index: number) {
		const name = skills[index]?.name ?? "Skill";
		setSkills((prev) => prev.filter((_, i) => i !== index));
		toast.success(`"${name}" removed.`);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold">Skills</h2>
					<p className="text-sm text-muted-foreground">
						{skills.length} skill{skills.length !== 1 ? "s" : ""} in your base
					</p>
				</div>

				<Dialog open={addOpen} onOpenChange={setAddOpen}>
					<DialogTrigger asChild>
						<Button>Add Skill</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Skill</DialogTitle>
						</DialogHeader>
						<SkillForm onSave={handleAdd} onClose={() => setAddOpen(false)} />
					</DialogContent>
				</Dialog>
			</div>

			{skills.length === 0 && (
				<Card>
					<CardContent className="py-10 text-center text-muted-foreground">
						No skills yet. Click "Add Skill" to get started.
					</CardContent>
				</Card>
			)}

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{skills.map((skill, index) => (
					<Card key={`${skill.name}-${index}`}>
						<CardHeader className="pb-2">
							<CardTitle className="text-base">{skill.name}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
								<span>
									Level:{" "}
									<span className="font-medium text-foreground">
										{LEVEL_LABELS[skill.level]} ({skill.level}/5)
									</span>
								</span>
								<span>
									Years:{" "}
									<span className="font-medium text-foreground">
										{skill.years}
									</span>
								</span>
								<span>
									Priority:{" "}
									<span className="font-medium text-foreground">
										{skill.priority}/10
									</span>
								</span>
							</div>

							<div className="flex gap-2 pt-1">
								<Dialog
									open={editIndex === index}
									onOpenChange={(open) => setEditIndex(open ? index : null)}
								>
									<DialogTrigger asChild>
										<Button size="sm" variant="outline">
											Edit
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Edit Skill</DialogTitle>
										</DialogHeader>
										<SkillForm
											defaultValues={skill}
											onSave={(updated) => handleEdit(index, updated)}
											onClose={() => setEditIndex(null)}
										/>
									</DialogContent>
								</Dialog>

								<Button
									size="sm"
									variant="destructive"
									onClick={() => handleDelete(index)}
								>
									Delete
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
