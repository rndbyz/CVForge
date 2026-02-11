import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTemplateVariant } from "@/hooks";
import type { TemplateVariant } from "@/lib/schemas";

type TemplateOption = {
	value: TemplateVariant;
	label: string;
	description: string;
	features: string[];
};

const TEMPLATE_OPTIONS: TemplateOption[] = [
	{
		value: "modern",
		label: "Modern",
		description: "Clean layout with accent colors and a two-column structure.",
		features: [
			"Two-column layout",
			"Accent color headers",
			"Compact skill tags",
			"Best for tech roles",
		],
	},
	{
		value: "classic",
		label: "Classic",
		description:
			"Traditional single-column format. Readable by all HR systems.",
		features: [
			"Single-column layout",
			"Serif-inspired typography",
			"Conservative spacing",
			"Universal compatibility",
		],
	},
	{
		value: "ats",
		label: "ATS",
		description:
			"Stripped-down plain text structure optimized for applicant tracking systems.",
		features: [
			"Plain text structure",
			"No decorative elements",
			"Maximum keyword density",
			"Best ATS parse rate",
		],
	},
];

export function TemplateSelector() {
	const [variant, setVariant] = useTemplateVariant();

	function handleSelect(value: TemplateVariant) {
		setVariant(value);
		const label =
			TEMPLATE_OPTIONS.find((t) => t.value === value)?.label ?? value;
		toast.success(`"${label}" template selected.`);
	}

	return (
		<div className="space-y-4">
			<div>
				<h2 className="text-xl font-semibold">Template</h2>
				<p className="text-sm text-muted-foreground">
					Select the CV layout that best suits your target role. The JSON output
					remains identical — only the LaTeX rendering changes.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{TEMPLATE_OPTIONS.map((option) => {
					const isSelected = variant === option.value;

					return (
						<button
							key={option.value}
							type="button"
							className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
							onClick={() => handleSelect(option.value)}
							aria-pressed={isSelected}
						>
							<Card
								className={
									isSelected
										? "border-2 border-primary shadow-md"
										: "border-2 border-transparent hover:border-muted-foreground/30 transition-colors"
								}
							>
								<CardHeader className="pb-2">
									<div className="flex items-center justify-between">
										<CardTitle className="text-base">{option.label}</CardTitle>
										{isSelected && (
											<span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
												Selected
											</span>
										)}
									</div>
									<CardDescription>{option.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-1">
										{option.features.map((feature) => (
											<li
												key={feature}
												className="flex items-center gap-2 text-sm text-muted-foreground"
											>
												<span
													className={
														isSelected
															? "text-primary"
															: "text-muted-foreground"
													}
												>
													&#10003;
												</span>
												{feature}
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						</button>
					);
				})}
			</div>
		</div>
	);
}
