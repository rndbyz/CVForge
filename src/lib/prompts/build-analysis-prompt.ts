import type { Skill } from "@/lib/schemas";

export function buildAnalysisPrompt(config: {
	jobDescription: string;
	skills: Skill[];
}): string {
	const skillsList = config.skills
		.map(
			(s) =>
				`- ${s.name} (Level: ${s.level}/5, ${s.years} years, Priority: ${s.priority})`,
		)
		.join("\n");

	return `Analyze the following job description against the candidate's skill base.

## Job Description
${config.jobDescription}

## Candidate Skills
${skillsList || "No skills defined yet."}

## Required JSON Output
Return a JSON object with this exact structure:
{
  "overallScore": <number 0-100>,
  "matchedSkills": [
    { "name": "<skill name>", "relevance": <number 0-100> }
  ],
  "missingSkills": ["<skill name>", ...],
  "recommendations": ["<actionable recommendation>", ...]
}

Score criteria:
- 80-100: Strong match, most required skills present
- 60-79: Good match, some gaps
- 40-59: Partial match, significant gaps
- 0-39: Weak match`;
}
