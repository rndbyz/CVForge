import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { useBaseCv } from "@/hooks";
import { type Experience, experienceSchema } from "@/lib/schemas";

function ExperienceForm({
	defaultValues,
	onSave,
	onClose,
}: {
	defaultValues?: Experience;
	onSave: (exp: Experience) => void;
	onClose: () => void;
}) {
	const form = useForm<Experience>({
		resolver: zodResolver(experienceSchema),
		defaultValues: defaultValues ?? {
			title: "",
			company: "",
			location: "",
			period: "",
			achievements: [""],
			tech: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		// react-hook-form useFieldArray requires array of objects; we adapt string[] via wrapper
		name: "achievements" as never,
	});

	// Tech is stored as string[] but edited as a comma-separated input
	const [techInput, setTechInput] = useState(
		(defaultValues?.tech ?? []).join(", "),
	);

	function onSubmit(data: Experience) {
		const techArray = techInput
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);

		onSave({ ...data, tech: techArray.length > 0 ? techArray : undefined });
		onClose();
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Job Title</FormLabel>
								<FormControl>
									<Input placeholder="Senior Engineer" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="company"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company</FormLabel>
								<FormControl>
									<Input placeholder="Acme Corp" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Location (optional)</FormLabel>
								<FormControl>
									<Input placeholder="New York, NY" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="period"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Period</FormLabel>
								<FormControl>
									<Input placeholder="Jan 2021 – Present" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Separator />

				<div className="space-y-2">
					<FormLabel>
						Achievements{" "}
						<span className="text-xs text-muted-foreground">
							(max 5, ≤ 120 chars each)
						</span>
					</FormLabel>

					{fields.map((field, index) => (
						<FormField
							key={field.id}
							control={form.control}
							name={`achievements.${index}` as const}
							render={({ field: inputField }) => (
								<FormItem>
									<div className="flex items-start gap-2">
										<FormControl>
											<Input
												placeholder={`Achievement ${index + 1}`}
												maxLength={120}
												{...inputField}
											/>
										</FormControl>
										{fields.length > 1 && (
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="shrink-0"
												onClick={() => remove(index)}
											>
												Remove
											</Button>
										)}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}

					{fields.length < 5 && (
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => append("" as never)}
						>
							Add Achievement
						</Button>
					)}
				</div>

				<Separator />

				<div className="space-y-1">
					<FormLabel htmlFor="tech-input">
						Tech Stack{" "}
						<span className="text-xs text-muted-foreground">
							(comma-separated, optional)
						</span>
					</FormLabel>
					<Input
						id="tech-input"
						placeholder="React, TypeScript, Node.js"
						value={techInput}
						onChange={(e) => setTechInput(e.target.value)}
					/>
				</div>

				<div className="flex justify-end gap-2 pt-2">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit">Save Experience</Button>
				</div>
			</form>
		</Form>
	);
}

export function ExperiencesManager() {
	const [baseCV, setBaseCV] = useBaseCv();
	const experiences = baseCV.experiences;
	const [addOpen, setAddOpen] = useState(false);
	const [editIndex, setEditIndex] = useState<number | null>(null);

	function handleAdd(exp: Experience) {
		setBaseCV((prev) => ({
			...prev,
			experiences: [...prev.experiences, exp],
		}));
		toast.success(`"${exp.title}" at "${exp.company}" added.`);
	}

	function handleEdit(index: number, exp: Experience) {
		setBaseCV((prev) => ({
			...prev,
			experiences: prev.experiences.map((e, i) => (i === index ? exp : e)),
		}));
		toast.success(`"${exp.title}" updated.`);
	}

	function handleDelete(index: number) {
		const exp = experiences[index];
		const label = exp ? `"${exp.title}"` : "Experience";
		setBaseCV((prev) => ({
			...prev,
			experiences: prev.experiences.filter((_, i) => i !== index),
		}));
		toast.success(`${label} removed.`);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-semibold">Experiences</h2>
					<p className="text-sm text-muted-foreground">
						{experiences.length} position
						{experiences.length !== 1 ? "s" : ""} on record
					</p>
				</div>

				<Dialog open={addOpen} onOpenChange={setAddOpen}>
					<DialogTrigger asChild>
						<Button>Add Experience</Button>
					</DialogTrigger>
					<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
						<DialogHeader>
							<DialogTitle>Add Experience</DialogTitle>
						</DialogHeader>
						<ExperienceForm
							onSave={handleAdd}
							onClose={() => setAddOpen(false)}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{experiences.length === 0 && (
				<Card>
					<CardContent className="py-10 text-center text-muted-foreground">
						No experiences yet. Click "Add Experience" to get started.
					</CardContent>
				</Card>
			)}

			<div className="space-y-3">
				{experiences.map((exp, index) => (
					<Card key={`${exp.company}-${index}`}>
						<CardHeader className="pb-2">
							<CardTitle className="text-base">
								{exp.title}{" "}
								<span className="font-normal text-muted-foreground">
									at {exp.company}
								</span>
							</CardTitle>
							<p className="text-sm text-muted-foreground">
								{exp.period}
								{exp.location ? ` · ${exp.location}` : ""}
							</p>
						</CardHeader>
						<CardContent className="space-y-3">
							<ul className="ml-4 list-disc space-y-1 text-sm">
								{exp.achievements.map((a, i) => (
									<li key={i}>{a}</li>
								))}
							</ul>

							{exp.tech && exp.tech.length > 0 && (
								<div className="flex flex-wrap gap-1">
									{exp.tech.map((t) => (
										<Badge key={t} variant="secondary">
											{t}
										</Badge>
									))}
								</div>
							)}

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
									<DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
										<DialogHeader>
											<DialogTitle>Edit Experience</DialogTitle>
										</DialogHeader>
										<ExperienceForm
											defaultValues={exp}
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
