import {
	AlertCircle,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	Loader2,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { useApiKeys, useLocale } from "@/hooks";
import { analyzeMatch, type MatchResult } from "@/lib/ai-match";
import type { AiProvider } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBuilder } from "./BuilderContext";
import type { ResolvedCV } from "@/hooks/use-resolved-cv";

function ScoreRing({ score }: { score: number }) {
	const color =
		score >= 75
			? "text-green-600"
			: score >= 50
				? "text-yellow-500"
				: "text-red-500";

	const bgColor =
		score >= 75
			? "bg-green-50 border-green-200"
			: score >= 50
				? "bg-yellow-50 border-yellow-200"
				: "bg-red-50 border-red-200";

	return (
		<div
			className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 ${bgColor}`}
		>
			<span className={`text-3xl font-bold ${color}`}>{score}</span>
			<span className="text-xs text-muted-foreground">/ 100</span>
		</div>
	);
}

export function MatchPanel({ resolved }: { resolved: ResolvedCV }) {
	const { tailored, setTailored } = useBuilder();
	const [apiKeys, setApiKeys] = useApiKeys();
	const [, , t] = useLocale();

	const [result, setResult] = useState<MatchResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [keyVisible, setKeyVisible] = useState(false);

	const jobDescription = tailored.jobDescription ?? "";

	const setJobDescription = (value: string) => {
		setTailored((prev) => ({ ...prev, jobDescription: value }));
	};

	const canAnalyze =
		jobDescription.trim().length > 50 && apiKeys.apiKey.trim().length > 0;

	const handleAnalyze = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await analyzeMatch({
				jobDescription,
				resolved,
				apiKey: apiKeys.apiKey,
				provider: apiKeys.provider,
			});
			setResult(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollArea className="h-full">
			<div className="space-y-4 p-4">
				<h2 className="text-lg font-semibold">Match Score</h2>

				{/* Job description input */}
				<div className="space-y-1.5">
					<Label className="text-xs">Job Description</Label>
					<Textarea
						value={jobDescription}
						onChange={(e) => setJobDescription(e.target.value)}
						placeholder="Paste the job description here..."
						className="min-h-40 resize-none text-sm"
					/>
				</div>

				{/* API key config (collapsible) */}
				<div className="rounded-md border">
					<button
						type="button"
						className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
						onClick={() => setKeyVisible((v) => !v)}
					>
						<span>API Key</span>
						{keyVisible ? (
							<ChevronUp className="h-3.5 w-3.5" />
						) : (
							<ChevronDown className="h-3.5 w-3.5" />
						)}
					</button>
					{keyVisible && (
						<div className="space-y-2 border-t px-3 pb-3 pt-2">
							<div className="space-y-1">
								<Label className="text-xs">Provider</Label>
								<Select
									value={apiKeys.provider}
									onValueChange={(v) =>
										setApiKeys((prev) => ({
											...prev,
											provider: v as AiProvider,
										}))
									}
								>
									<SelectTrigger className="h-8 text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="openai">OpenAI (gpt-4o-mini)</SelectItem>
										<SelectItem value="anthropic">
											Anthropic (claude-haiku)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-1">
								<Label className="text-xs">API Key</Label>
								<Input
									type="password"
									value={apiKeys.apiKey}
									onChange={(e) =>
										setApiKeys((prev) => ({
											...prev,
											apiKey: e.target.value,
										}))
									}
									placeholder="sk-..."
									className="h-8 text-xs"
								/>
							</div>
						</div>
					)}
				</div>

				{/* Analyze button */}
				<Button
					className="w-full"
					onClick={handleAnalyze}
					disabled={!canAnalyze || loading}
				>
					{loading ? (
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					) : null}
					{loading ? "Analyzing..." : "Analyze Match"}
				</Button>

				{!canAnalyze && !loading && (
					<p className="text-center text-xs text-muted-foreground">
						{!apiKeys.apiKey.trim()
							? "Enter your API key above to analyze."
							: "Paste a job description (min. 50 chars)."}
					</p>
				)}

				{/* Error */}
				{error && (
					<div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
						<AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
						<span>{error}</span>
					</div>
				)}

				{/* Results */}
				{result && (
					<div className="space-y-4">
						{/* Score */}
						<div className="flex flex-col items-center gap-2 py-2">
							<ScoreRing score={result.overallScore} />
							<p className="text-sm text-muted-foreground">
								{result.overallScore >= 75
									? "Strong match"
									: result.overallScore >= 50
										? "Partial match"
										: "Low match"}
							</p>
						</div>

						{/* Skill matches */}
						{result.skillMatches.length > 0 && (
							<div className="space-y-1.5">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									{t("skills")}
								</h3>
								<div className="space-y-1">
									{result.skillMatches.map((sm) => (
										<div
											key={sm.skill}
											className="flex items-center gap-2 text-sm"
										>
											{sm.found ? (
												<CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
											) : (
												<XCircle className="h-4 w-4 shrink-0 text-red-400" />
											)}
											<span
												className={
													sm.found
														? "text-foreground"
														: "text-muted-foreground"
												}
											>
												{sm.skill}
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Missing keywords */}
						{result.missingKeywords.length > 0 && (
							<div className="space-y-1.5">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Missing Keywords
								</h3>
								<div className="flex flex-wrap gap-1.5">
									{result.missingKeywords.map((kw) => (
										<Badge
											key={kw}
											variant="outline"
											className="border-red-200 bg-red-50 text-red-700 text-xs"
										>
											{kw}
										</Badge>
									))}
								</div>
							</div>
						)}

						{/* Tips */}
						{result.tips.length > 0 && (
							<div className="space-y-1.5">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Suggestions
								</h3>
								<div className="space-y-2">
									{result.tips.map((tip, i) => (
										<div
											key={i}
											className="rounded-md border bg-card p-2.5 text-sm"
										>
											<span className="font-medium text-foreground">
												{tip.section}:{" "}
											</span>
											<span className="text-muted-foreground">
												{tip.message}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</ScrollArea>
	);
}
