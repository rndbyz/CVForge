import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useBaseCv } from "@/hooks";
import { type BaseCV, type Education, educationSchema } from "@/lib/schemas";

// Form schema covering summary + education array
const baseCvFormSchema = z.object({
	summary: z.string().min(1, "Summary is required").max(500),
	education: z.array(educationSchema),
});

type BaseCvFormValues = z.infer<typeof baseCvFormSchema>;

// Single education entry editor (uncontrolled within the list)
function EducationEntry({
	entry,
	index,
	onChange,
	onRemove,
}: {
	entry: Education;
	index: number;
	onChange: (index: number, updated: Education) => void;
	onRemove: (index: number) => void;
}) {
	const [detailsInput, setDetailsInput] = useState(
		(entry.details ?? []).join("\n"),
	);

	function handleField(field: keyof Education, value: string) {
		const details =
			field === "details"
				? value
						.split("\n")
						.map((d) => d.trim())
						.filter(Boolean)
				: entry.details;

		onChange(index, {
			...entry,
			[field]: value,
			details: field === "details" ? details : entry.details,
		});
	}

	function handleDetailsChange(value: string) {
		setDetailsInput(value);
		const details = value
			.split("\n")
			.map((d) => d.trim())
			.filter(Boolean);
		onChange(index, { ...entry, details });
	}

	return (
		<Card className="relative">
			<CardContent className="space-y-3 pt-4">
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					<div className="space-y-1">
						<label
							htmlFor={`edu-degree-${index}`}
							className="text-sm font-medium"
						>
							Degree
						</label>
						<Input
							id={`edu-degree-${index}`}
							placeholder="B.Sc. Computer Science"
							value={entry.degree}
							onChange={(e) => handleField("degree", e.target.value)}
						/>
					</div>

					<div className="space-y-1">
						<label
							htmlFor={`edu-institution-${index}`}
							className="text-sm font-medium"
						>
							Institution
						</label>
						<Input
							id={`edu-institution-${index}`}
							placeholder="MIT"
							value={entry.institution}
							onChange={(e) => handleField("institution", e.target.value)}
						/>
					</div>

					<div className="space-y-1">
						<label
							htmlFor={`edu-period-${index}`}
							className="text-sm font-medium"
						>
							Period
						</label>
						<Input
							id={`edu-period-${index}`}
							placeholder="2015 – 2019"
							value={entry.period}
							onChange={(e) => handleField("period", e.target.value)}
						/>
					</div>
				</div>

				<div className="space-y-1">
					<label
						htmlFor={`edu-details-${index}`}
						className="text-sm font-medium"
					>
						Details{" "}
						<span className="text-xs text-muted-foreground">
							(optional — one per line)
						</span>
					</label>
					<Textarea
						id={`edu-details-${index}`}
						placeholder={"Dean's list\nGPA 3.9/4.0"}
						rows={3}
						value={detailsInput}
						onChange={(e) => handleDetailsChange(e.target.value)}
					/>
				</div>

				<Button
					type="button"
					variant="destructive"
					size="sm"
					onClick={() => onRemove(index)}
				>
					Remove
				</Button>
			</CardContent>
		</Card>
	);
}

export function BaseCvForm() {
	const [baseCV, setBaseCV] = useBaseCv();

	const form = useForm<BaseCvFormValues>({
		resolver: zodResolver(baseCvFormSchema),
		defaultValues: {
			summary: "",
			education: [],
		},
	});

	// Local state for education so we can manipulate the array without RHF complexity
	const [educationList, setEducationList] = useState<Education[]>([]);

	// Hydrate once localStorage data loads
	useEffect(() => {
		form.reset({ summary: baseCV.summary, education: baseCV.education });
		setEducationList(baseCV.education);
	}, [baseCV, form]);

	function addEducation() {
		const newEntry: Education = {
			degree: "",
			institution: "",
			period: "",
			details: [],
		};
		setEducationList((prev) => [...prev, newEntry]);
	}

	function updateEducation(index: number, updated: Education) {
		setEducationList((prev) => prev.map((e, i) => (i === index ? updated : e)));
	}

	function removeEducation(index: number) {
		setEducationList((prev) => prev.filter((_, i) => i !== index));
	}

	function onSubmit(data: BaseCvFormValues) {
		setBaseCV((prev: BaseCV) => ({
			...prev,
			summary: data.summary,
			education: educationList,
		}));
		toast.success("Base CV saved successfully.");
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Summary &amp; Education</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							{/* Summary */}
							<FormField
								control={form.control}
								name="summary"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Professional Summary</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Write a concise summary of your professional background..."
												rows={5}
												maxLength={500}
												{...field}
											/>
										</FormControl>
										<div className="text-right text-xs text-muted-foreground">
											{field.value?.length ?? 0} / 500
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Separator />

							{/* Education list */}
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-semibold">Education</h3>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={addEducation}
									>
										Add Education
									</Button>
								</div>

								{educationList.length === 0 && (
									<p className="text-sm text-muted-foreground">
										No education entries yet.
									</p>
								)}

								{educationList.map((entry, index) => (
									<EducationEntry
										key={index}
										entry={entry}
										index={index}
										onChange={updateEducation}
										onRemove={removeEducation}
									/>
								))}
							</div>

							<div className="flex justify-end pt-2">
								<Button type="submit">Save</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
