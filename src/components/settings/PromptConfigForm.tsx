import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { usePromptConfig } from "@/hooks";
import {
	defaultPromptConfig,
	type PromptConfig,
	promptConfigSchema,
} from "@/lib/schemas";

const COUNTRY_OPTIONS = [
	{ value: "US", label: "United States" },
	{ value: "FR", label: "France" },
	{ value: "UK", label: "United Kingdom" },
	{ value: "DE", label: "Germany" },
	{ value: "OTHER", label: "Other" },
] as const;

const SENIORITY_OPTIONS = [
	{ value: "junior", label: "Junior" },
	{ value: "mid", label: "Mid-level" },
	{ value: "senior", label: "Senior" },
	{ value: "lead", label: "Lead" },
	{ value: "principal", label: "Principal" },
] as const;

const TONE_OPTIONS = [
	{ value: "technical", label: "Technical" },
	{ value: "business", label: "Business" },
	{ value: "impact", label: "Impact-driven" },
] as const;

const ATS_LABELS: Record<number, string> = {
	1: "Minimal",
	2: "Light",
	3: "Balanced",
	4: "Strong",
	5: "Maximum",
};

export function PromptConfigForm() {
	const [promptConfig, setPromptConfig] = usePromptConfig();

	const form = useForm<PromptConfig>({
		resolver: zodResolver(promptConfigSchema),
		defaultValues: defaultPromptConfig,
	});

	useEffect(() => {
		form.reset(promptConfig);
	}, [promptConfig, form]);

	function onSubmit(data: PromptConfig) {
		setPromptConfig(data);
		toast.success("Prompt configuration saved.");
	}

	const atsValue = form.watch("atsOptimizationIntensity");

	return (
		<Card>
			<CardHeader>
				<CardTitle>Prompt Strategy</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							{/* Target Country */}
							<FormField
								control={form.control}
								name="targetCountry"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Target Country</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select country" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{COUNTRY_OPTIONS.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Seniority Level */}
							<FormField
								control={form.control}
								name="seniorityLevel"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Seniority Level</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select seniority" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{SENIORITY_OPTIONS.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Tone */}
							<FormField
								control={form.control}
								name="tone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tone</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select tone" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{TONE_OPTIONS.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* ATS Optimization Intensity */}
						<FormField
							control={form.control}
							name="atsOptimizationIntensity"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center justify-between">
										<FormLabel>ATS Optimization Intensity</FormLabel>
										<span className="text-sm font-medium text-foreground">
											{atsValue} — {ATS_LABELS[atsValue]}
										</span>
									</div>
									<FormControl>
										<Slider
											min={1}
											max={5}
											step={1}
											value={[field.value]}
											onValueChange={(vals) => field.onChange(vals[0])}
											className="py-2"
										/>
									</FormControl>
									<div className="flex justify-between text-xs text-muted-foreground">
										<span>Minimal</span>
										<span>Maximum</span>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Custom Instructions */}
						<FormField
							control={form.control}
							name="customInstructions"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Custom Instructions{" "}
										<span className="text-xs text-muted-foreground">
											(optional — max 1000 chars)
										</span>
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder="e.g. Always emphasize team leadership. Avoid mentioning specific client names."
											rows={4}
											maxLength={1000}
											{...field}
										/>
									</FormControl>
									<div className="text-right text-xs text-muted-foreground">
										{field.value?.length ?? 0} / 1000
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end pt-2">
							<Button type="submit">Save Configuration</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
