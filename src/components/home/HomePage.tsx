import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useApiKeys } from "@/hooks/use-api-keys";
import { useBaseCv } from "@/hooks/use-base-cv";
import { usePromptConfig } from "@/hooks/use-prompt-config";
import { useSkills } from "@/hooks/use-skills";
import { buildAnalysisPrompt } from "@/lib/prompts/build-analysis-prompt";
import { buildGenerationPrompt } from "@/lib/prompts/build-prompt";
import type { GeneratedCV, MatchResult } from "@/lib/schemas";
import { analyzeJob } from "@/server/analyze-job";
import { generateCV } from "@/server/generate-cv";
import { CvPreview } from "./CvPreview";
import { JobDescriptionInput } from "./JobDescriptionInput";
import { MatchScoreDisplay } from "./MatchScoreDisplay";

export function HomePage() {
	const [jobDescription, setJobDescription] = useState("");
	const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
	const [generatedCv, setGeneratedCv] = useState<GeneratedCV | null>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);

	const [apiKeys] = useApiKeys();
	const [skills] = useSkills();
	const [baseCv] = useBaseCv();
	const [promptConfig] = usePromptConfig();

	function getActiveApiKey(): string | null {
		const key =
			apiKeys.provider === "openai" ? apiKeys.openai : apiKeys.anthropic;
		return key || null;
	}

	async function handleAnalyze() {
		const apiKey = getActiveApiKey();
		if (!apiKey) {
			toast.error("No API key configured. Go to Settings > API Keys.");
			return;
		}

		setIsAnalyzing(true);
		setMatchResult(null);
		setGeneratedCv(null);

		try {
			const prompt = buildAnalysisPrompt({
				jobDescription,
				skills,
			});

			const result = await analyzeJob({
				data: {
					apiKey,
					provider: apiKeys.provider,
					model: apiKeys.model,
					prompt,
				},
			});

			setMatchResult(result);
			toast.success("Analysis complete!");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Analysis failed. Please try again.",
			);
		} finally {
			setIsAnalyzing(false);
		}
	}

	async function handleGenerate() {
		if (!matchResult) return;

		const apiKey = getActiveApiKey();
		if (!apiKey) {
			toast.error("No API key configured. Go to Settings > API Keys.");
			return;
		}

		setIsGenerating(true);

		try {
			const prompt = buildGenerationPrompt({
				promptConfig,
				baseCV: baseCv,
				jobDescription,
				matchResult,
			});

			const result = await generateCV({
				data: {
					apiKey,
					provider: apiKeys.provider,
					model: apiKeys.model,
					prompt,
				},
			});

			setGeneratedCv(result);
			toast.success("CV generated successfully!");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Generation failed. Please try again.",
			);
		} finally {
			setIsGenerating(false);
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold">AI CV Optimizer</h1>
				<p className="text-muted-foreground">
					Paste a job description, analyze the match, and generate a tailored
					CV.
				</p>
			</div>

			<JobDescriptionInput
				value={jobDescription}
				onChange={setJobDescription}
				onAnalyze={handleAnalyze}
				isAnalyzing={isAnalyzing}
			/>

			{matchResult && (
				<>
					<MatchScoreDisplay matchResult={matchResult} />
					<Button
						onClick={handleGenerate}
						disabled={isGenerating}
						size="lg"
						className="w-full"
					>
						{isGenerating ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Generating CV...
							</>
						) : (
							<>
								<Sparkles className="mr-2 h-4 w-4" />
								Generate Optimized CV
							</>
						)}
					</Button>
				</>
			)}

			{generatedCv && <CvPreview generatedCv={generatedCv} />}
		</div>
	);
}
