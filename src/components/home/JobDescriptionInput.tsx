import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionInputProps {
	value: string;
	onChange: (value: string) => void;
	onAnalyze: () => void;
	isAnalyzing: boolean;
}

export function JobDescriptionInput({
	value,
	onChange,
	onAnalyze,
	isAnalyzing,
}: JobDescriptionInputProps) {
	const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Job Description</h2>
				<span className="text-sm text-muted-foreground">{wordCount} words</span>
			</div>
			<Textarea
				placeholder="Paste the job description here..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="min-h-[200px] resize-y"
			/>
			<Button
				onClick={onAnalyze}
				disabled={!value.trim() || isAnalyzing}
				className="w-full"
			>
				{isAnalyzing ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Analyzing...
					</>
				) : (
					<>
						<Search className="mr-2 h-4 w-4" />
						Analyze Match
					</>
				)}
			</Button>
		</div>
	);
}
