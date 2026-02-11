import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { MatchResult } from "@/lib/schemas";

interface MatchScoreDisplayProps {
	matchResult: MatchResult;
}

function getScoreColor(score: number): string {
	if (score >= 80) return "text-green-600";
	if (score >= 60) return "text-yellow-600";
	if (score >= 40) return "text-orange-500";
	return "text-red-500";
}

function getScoreLabel(score: number): string {
	if (score >= 80) return "Strong Match";
	if (score >= 60) return "Good Match";
	if (score >= 40) return "Partial Match";
	return "Weak Match";
}

export function MatchScoreDisplay({ matchResult }: MatchScoreDisplayProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>Match Analysis</span>
					<div className="text-right">
						<span
							className={`text-3xl font-bold ${getScoreColor(matchResult.overallScore)}`}
						>
							{matchResult.overallScore}%
						</span>
						<p className={`text-sm ${getScoreColor(matchResult.overallScore)}`}>
							{getScoreLabel(matchResult.overallScore)}
						</p>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{matchResult.matchedSkills.length > 0 && (
					<div>
						<h4 className="mb-2 text-sm font-medium">Matched Skills</h4>
						<div className="flex flex-wrap gap-2">
							{matchResult.matchedSkills.map((skill) => (
								<Badge
									key={skill.name}
									variant={skill.relevance >= 70 ? "default" : "secondary"}
								>
									{skill.name} ({skill.relevance}%)
								</Badge>
							))}
						</div>
					</div>
				)}

				{matchResult.missingSkills.length > 0 && (
					<>
						<Separator />
						<div>
							<h4 className="mb-2 text-sm font-medium">Missing Skills</h4>
							<div className="flex flex-wrap gap-2">
								{matchResult.missingSkills.map((skill) => (
									<Badge key={skill} variant="destructive">
										{skill}
									</Badge>
								))}
							</div>
						</div>
					</>
				)}

				{matchResult.recommendations.length > 0 && (
					<>
						<Separator />
						<div>
							<h4 className="mb-2 text-sm font-medium">Recommendations</h4>
							<ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
								{matchResult.recommendations.map((rec) => (
									<li key={rec}>{rec}</li>
								))}
							</ul>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
