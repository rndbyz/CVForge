import type { BaseCV, MatchResult, PromptConfig } from "@/lib/schemas";

export function buildGenerationPrompt(config: {
	promptConfig: PromptConfig;
	baseCV: BaseCV;
	jobDescription: string;
	matchResult: MatchResult;
}): string {
	const { promptConfig, baseCV, jobDescription, matchResult } = config;

	const toneGuide = {
		technical:
			"Use precise technical language. Emphasize tools, technologies, and methodologies.",
		business:
			"Use business-oriented language. Emphasize outcomes, ROI, and strategic impact.",
		impact:
			"Use action-driven language. Emphasize measurable results and achievements.",
	};

	const countryGuide = {
		FR: "Follow French CV conventions. Use formal tone.",
		US: "Follow US resume conventions. Use action verbs.",
		UK: "Follow UK CV conventions. Include personal statement.",
		DE: "Follow German Lebenslauf conventions. Be structured and factual.",
		OTHER: "Use international CV conventions.",
	};

	return `Generate an optimized CV based on the following data.

## Target Configuration
- Country: ${promptConfig.targetCountry} - ${countryGuide[promptConfig.targetCountry]}
- Seniority: ${promptConfig.seniorityLevel}
- Tone: ${promptConfig.tone} - ${toneGuide[promptConfig.tone]}
- ATS Optimization Level: ${promptConfig.atsOptimizationIntensity}/5
${promptConfig.customInstructions ? `- Custom Instructions: ${promptConfig.customInstructions}` : ""}

## Job Description
${jobDescription}

## Match Analysis
- Overall Score: ${matchResult.overallScore}%
- Matched Skills: ${matchResult.matchedSkills.map((s) => s.name).join(", ")}
- Missing Skills: ${matchResult.missingSkills.join(", ")}

## Candidate Data
${JSON.stringify(baseCV, null, 2)}

## Required JSON Output
Return a JSON object with this exact structure:
{
  "header": {
    "name": "<string>",
    "title": "<optimized title for this role>",
    "email": "<string>",
    "phone": "<string>",
    "location": "<string>",
    "linkedin": "<string or omit>",
    "github": "<string or omit>"
  },
  "summary": "<2-3 sentence professional summary tailored to the job>",
  "skills": [
    { "category": "<category name>", "items": ["<skill>", ...] }
  ],
  "experiences": [
    {
      "title": "<string>",
      "company": "<string>",
      "location": "<string or omit>",
      "period": "<string>",
      "achievements": ["<max 120 chars each, max 5 items>"],
      "tech": ["<technology>", ...]
    }
  ],
  "education": [
    {
      "degree": "<string>",
      "institution": "<string>",
      "period": "<string>",
      "details": ["<string>", ...]
    }
  ]
}

## Optimization Rules
- Reorder experiences by relevance to the job description.
- Prioritize matched skills and relevant achievements.
- Rewrite achievement bullets to emphasize relevant impact.
- Group skills by logical categories.
- Tailor the summary to the specific role.
- Do NOT fabricate any data. Only restructure and optimize existing content.`;
}
