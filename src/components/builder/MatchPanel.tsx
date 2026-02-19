import {
	AlertCircle,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	FileWarning,
	Loader2,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { useApiKeys, useLocale } from "@/hooks";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { analyzeMatch, matchResultSchema, type MatchResult } from "@/lib/ai-match";
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

const nullableMatchResultSchema = matchResultSchema.nullable();

/* ---- Sub-components ---- */

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

function ImpactBadge({ impact }: { impact: "high" | "medium" | "low" }) {
	const cls =
		impact === "high"
			? "border-red-200 bg-red-50 text-red-700"
			: impact === "medium"
				? "border-yellow-200 bg-yellow-50 text-yellow-700"
				: "border-gray-200 bg-gray-50 text-gray-500";
	return (
		<Badge variant="outline" className={`text-xs ${cls}`}>
			{impact}
		</Badge>
	);
}

/* ---- Main panel ---- */

export function MatchPanel({ resolved }: { resolved: ResolvedCV }) {
	const { tailored, setTailored } = useBuilder();
	const [apiKeys, setApiKeys] = useApiKeys();
	const [, , t] = useLocale();

	const [result, setResult] = useLocalStorage<MatchResult | null>(
		`match_result_${tailored.id}`,
		nullableMatchResultSchema,
		null,
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [keyVisible, setKeyVisible] = useState(false);
	const [descOpen, setDescOpen] = useState(!result);

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
			setDescOpen(false);
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

				{/* Job description (collapsible) */}
				<div className="rounded-md border">
					<button
						type="button"
						className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
						onClick={() => setDescOpen((v) => !v)}
					>
						<span>
							{descOpen
								? "Job Description"
								: jobDescription.trim()
									? jobDescription.trim().slice(0, 60) +
										(jobDescription.trim().length > 60 ? "…" : "")
									: "Job Description"}
						</span>
						{descOpen ? (
							<ChevronUp className="h-3.5 w-3.5 shrink-0" />
						) : (
							<ChevronDown className="h-3.5 w-3.5 shrink-0" />
						)}
					</button>
					{descOpen && (
						<div className="border-t px-3 pb-3 pt-2">
							<Textarea
								value={jobDescription}
								onChange={(e) => setJobDescription(e.target.value)}
								placeholder="Paste the job description here..."
								className="min-h-40 resize-none text-sm"
							/>
						</div>
					)}
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

						{/* Score + meta */}
						<div className="flex flex-col items-center gap-2 py-2">
							<ScoreRing score={result.overallScore} />
							<p className="text-sm text-muted-foreground">
								{result.overallScore >= 75
									? "Strong match"
									: result.overallScore >= 50
										? "Partial match"
										: "Low match"}
							</p>
							<div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
								<span
									className={
										result.jobTitleFound
											? "text-green-600"
											: "text-red-500"
									}
								>
									{result.jobTitleFound ? "✓" : "✗"} Job title
								</span>
								<span>·</span>
								<span
									className={
										result.measurableResultsCount >= 3
											? "text-green-600"
											: "text-yellow-500"
									}
								>
									{result.measurableResultsCount} measurable result
									{result.measurableResultsCount !== 1 ? "s" : ""}
								</span>
								<span>·</span>
								<span
									className={
										result.wordCount >= 400
											? "text-green-600"
											: "text-yellow-500"
									}
								>
									~{result.wordCount} words
								</span>
							</div>
						</div>

						{/* ATS Tips */}
						{(result.atsTips?.length ?? 0) > 0 && (
							<div className="space-y-1.5">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									ATS Issues
								</h3>
								<div className="space-y-1.5">
									{result.atsTips.map((tip, i) => (
										<div
											key={i}
											className="flex items-start gap-2 rounded-md border border-yellow-200 bg-yellow-50 p-2.5 text-xs"
										>
											<FileWarning className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-600" />
											<div>
												<span className="font-medium text-yellow-800">
													{tip.category}:{" "}
												</span>
												<span className="text-yellow-700">{tip.message}</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Hard skill matches */}
						{(result.hardSkillMatches?.length ?? 0) > 0 && (
							<div className="space-y-1.5">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									{t("skills")}
								</h3>
								<div className="space-y-1">
									{result.hardSkillMatches.map((sm) => (
										<div
											key={sm.skill}
											className="flex items-center justify-between gap-2 text-sm"
										>
											<div className="flex items-center gap-2 min-w-0">
												{sm.found ? (
													<CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
												) : (
													<XCircle className="h-4 w-4 shrink-0 text-red-400" />
												)}
												<span
													className={
														sm.found
															? "text-foreground truncate"
															: "text-muted-foreground truncate"
													}
												>
													{sm.skill}
												</span>
											</div>
											<span className="shrink-0 text-xs text-muted-foreground tabular-nums">
												{sm.resumeCount}/{sm.jdCount}×
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Soft skill matches */}
						{(result.softSkillMatches?.length ?? 0) > 0 && (
							<div className="space-y-1.5">
								<h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Soft Skills
								</h3>
								<div className="space-y-1">
									{result.softSkillMatches.map((sm) => (
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
						{(result.missingKeywords?.length ?? 0) > 0 && (
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
						{(result.tips?.length ?? 0) > 0 && (
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
											<div className="mb-1 flex items-center gap-2">
												<span className="font-medium text-foreground">
													{tip.section}
												</span>
												<ImpactBadge impact={tip.impact} />
											</div>
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
