import { z } from "zod";
import type { AiProvider } from "./schemas";
import type { ResolvedCV } from "@/hooks/use-resolved-cv";

/* ---- Result types ---- */

const matchResultSchema = z.object({
	overallScore: z.number().min(0).max(100),
	skillMatches: z.array(
		z.object({
			skill: z.string(),
			found: z.boolean(),
		}),
	),
	missingKeywords: z.array(z.string()),
	tips: z.array(
		z.object({
			section: z.string(),
			message: z.string(),
		}),
	),
});

export type MatchResult = z.infer<typeof matchResultSchema>;

/* ---- Prompt builder ---- */

function buildCvSummary(resolved: ResolvedCV): string {
	const lines: string[] = [];

	if (resolved.title) lines.push(`Title: ${resolved.title}`);
	if (resolved.introduction) lines.push(`Summary: ${resolved.introduction}`);

	if (resolved.skills.length > 0) {
		lines.push(`Skills: ${resolved.skills.map((s) => s.name).join(", ")}`);
	}

	for (const exp of resolved.experiences) {
		lines.push(
			`Experience: ${exp.selectedTitle} at ${exp.company} (${exp.period})`,
		);
		for (const b of exp.selectedBullets) lines.push(`  - ${b}`);
	}

	for (const edu of resolved.education) {
		lines.push(`Education: ${edu.degree} — ${edu.institution} (${edu.period})`);
	}

	for (const cert of resolved.certifications) {
		lines.push(`Certification: ${cert.name} by ${cert.issuer} (${cert.date})`);
	}

	return lines.join("\n");
}

const SYSTEM_PROMPT = `You are a professional CV analyst. Your task is to analyze a candidate's CV against a job description and return a structured JSON analysis.

You MUST return ONLY valid JSON with this exact schema:
{
  "overallScore": <number 0-100>,
  "skillMatches": [{ "skill": "<skill name>", "found": <true|false> }],
  "missingKeywords": ["<keyword>", ...],
  "tips": [{ "section": "<section name>", "message": "<actionable advice>" }]
}

Rules:
- overallScore: 0-100 match percentage considering skills, experience relevance, keywords
- skillMatches: list every skill/technology explicitly mentioned in the job description and whether it's in the CV
- missingKeywords: important keywords from the job description not found in the CV (max 10)
- tips: 3-5 concrete, actionable improvements (sections: Summary, Skills, Experience, Education, Certifications)
- No markdown, no explanation, only JSON`;

/* ---- API callers ---- */

async function callOpenAI(
	apiKey: string,
	userMessage: string,
): Promise<string> {
	const res = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: "gpt-4o-mini",
			messages: [
				{ role: "system", content: SYSTEM_PROMPT },
				{ role: "user", content: userMessage },
			],
			temperature: 0.2,
			response_format: { type: "json_object" },
		}),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(
			(err as { error?: { message?: string } }).error?.message ??
				`OpenAI error ${res.status}`,
		);
	}

	const data = await res.json();
	return data.choices[0].message.content;
}

async function callAnthropic(
	apiKey: string,
	userMessage: string,
): Promise<string> {
	const res = await fetch("https://api.anthropic.com/v1/messages", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": apiKey,
			"anthropic-version": "2023-06-01",
		},
		body: JSON.stringify({
			model: "claude-haiku-4-5-20251001",
			max_tokens: 1024,
			system: SYSTEM_PROMPT,
			messages: [{ role: "user", content: userMessage }],
		}),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(
			(err as { error?: { message?: string } }).error?.message ??
				`Anthropic error ${res.status}`,
		);
	}

	const data = await res.json();
	return data.content[0].text;
}

/* ---- Main export ---- */

export async function analyzeMatch(params: {
	jobDescription: string;
	resolved: ResolvedCV;
	apiKey: string;
	provider: AiProvider;
}): Promise<MatchResult> {
	const { jobDescription, resolved, apiKey, provider } = params;

	const cvSummary = buildCvSummary(resolved);
	const userMessage = `JOB DESCRIPTION:\n${jobDescription}\n\nCANDIDATE CV:\n${cvSummary}`;

	const raw =
		provider === "openai"
			? await callOpenAI(apiKey, userMessage)
			: await callAnthropic(apiKey, userMessage);

	const parsed = JSON.parse(raw);
	const result = matchResultSchema.safeParse(parsed);

	if (!result.success) {
		throw new Error("AI returned invalid response format");
	}

	return result.data;
}
