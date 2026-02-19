import { z } from "zod";
import type { AiProvider } from "./schemas";
import type { ResolvedCV } from "@/hooks/use-resolved-cv";

/* ---- Result types ---- */

export const matchResultSchema = z.object({
	// Core — always required
	overallScore: z.number().min(0).max(100),
	hardSkillMatches: z.array(
		z.object({
			skill: z.string(),
			found: z.boolean(),
			resumeCount: z.number().int().min(0),
			jdCount: z.number().int().min(0),
		}),
	),
	missingKeywords: z.array(z.string()),
	tips: z.array(
		z.object({
			section: z.string(),
			impact: z.enum(["high", "medium", "low"]).default("medium"),
			message: z.string(),
		}),
	),
	// Enriched — optional with safe defaults so old/partial results still parse
	jobTitleFound: z.boolean().default(false),
	wordCount: z.number().int().min(0).default(0),
	measurableResultsCount: z.number().int().min(0).default(0),
	softSkillMatches: z
		.array(z.object({ skill: z.string(), found: z.boolean() }))
		.default([]),
	atsTips: z
		.array(z.object({ category: z.string(), message: z.string() }))
		.default([]),
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

const SYSTEM_PROMPT = `You are an ATS (Applicant Tracking System) specialist and senior CV analyst. Analyze a candidate's CV against a job description with the precision of tools like Jobscan. Return ONLY valid JSON — no markdown, no explanation, no code block.

EXACT JSON SCHEMA REQUIRED:
{
  "overallScore": <integer 0-100>,
  "jobTitleFound": <boolean>,
  "wordCount": <integer>,
  "measurableResultsCount": <integer>,
  "hardSkillMatches": [
    { "skill": "<exact name from JD>", "found": <boolean>, "resumeCount": <integer>, "jdCount": <integer> }
  ],
  "softSkillMatches": [
    { "skill": "<soft skill name>", "found": <boolean> }
  ],
  "missingKeywords": ["<keyword>"],
  "atsTips": [
    { "category": "<Contact|Title|Sections|WordCount|Achievements|Language>", "message": "<specific ATS issue and fix>" }
  ],
  "tips": [
    { "section": "<Summary|Skills|Experience|Education|Certifications>", "impact": "<high|medium|low>", "message": "<specific actionable advice>" }
  ]
}

RULES — FOLLOW EXACTLY:

hardSkillMatches:
- Extract EVERY named tool, language, framework, library, protocol, and methodology explicitly mentioned in the JD as a technical requirement.
- Use the EXACT name as written in the JD: "React", "CSS-in-JS", "Jenkins", "Jira", etc.
- NEVER group skills into generic buckets — list each one individually.
- EXCLUDE experience thresholds and requirement phrases such as "minimum 3 years of experience", "familiarity with", "solid grasp of" — extract only the technology name itself (e.g. "HTML/CSS", not "solid grasp of HTML/CSS").
- resumeCount = how many times this skill OR a direct semantic equivalent appears in the CV. For example, "Styled Components" or "Emotion" count as occurrences of "CSS-in-JS". "Node.js" counts as an occurrence of "JavaScript runtime".
- jdCount = how many times this skill appears in the job description.
- found = true if resumeCount > 0 (including via semantic equivalent).
- If found via semantic equivalent (not exact wording), note it in the corresponding tip.

CRITICAL CONSISTENCY RULE: A skill with found=false MUST appear in missingKeywords. A skill with found=true MUST NOT appear in missingKeywords. This rule has no exceptions.

missingKeywords:
- List ONLY hard skills with found=false.
- Do NOT include soft skills here — soft skills belong exclusively in softSkillMatches.

softSkillMatches:
- Extract every soft skill explicitly listed in the JD (e.g. "pragmatic mindset", "team player", "curious, self-driven, eager to learn", "comfortable in fast-paced environment").
- found = true if the CV contains clear, specific evidence of this trait (a concrete example or explicit mention).
- found = false if the CV has no evidence — do not assume.
- Every entry MUST have the found boolean — never omit it.

jobTitleFound:
- true only if the exact job title from the JD appears verbatim (or a very close 1-word variant) in the CV header, title line, or summary.

wordCount:
- Estimate the word count of the CANDIDATE CV section only — do not count the job description words.

measurableResultsCount:
- Count bullet points that contain a concrete metric: a percentage, a ratio, a monetary value, a count of users/apps/teams with clear impact.
- Do NOT count mentions of years of experience, team sizes alone, or generic statements as measurable results.

atsTips:
- Flag ATS-specific structural issues only (not content/skill gaps).
- IMPORTANT: If the CV is written in a different language than the job description, flag it as category "Language" — e.g. "CV is written in French but the job description is in English. ATS keyword matching will fail for most terms. Rewrite key sections in English or add an English translation of skills and bullet points."
- Other examples: missing job title in header, non-standard section labels, word count below 400, no measurable results.
- Only flag issues that genuinely apply. Do not invent problems.

tips:
- Provide exactly 5 tips ordered by impact (high → medium → low).
- If a hard skill was found via semantic equivalent (e.g. "Styled Components" for "CSS-in-JS"), add a high-impact tip: "The JD requires 'X'. Your CV mentions 'Y' which satisfies this, but ATS won't match it. Add the exact keyword 'X' next to 'Y' in your skills or experience."
- Each tip must reference specific JD language and give a concrete rewrite suggestion.
- Do not repeat atsTips content.

overallScore calibration (STRICT — do not inflate):
- Start at 100.
- Subtract 4 points per hard skill with found=false.
- Subtract 5 points if jobTitleFound=false.
- Subtract 8 points if measurableResultsCount < 3.
- Subtract 4 points if measurableResultsCount is 3 or 4.
- Subtract 3 points per soft skill with found=false when more than 2 soft skills are missing.
- Subtract 10 points if CV language differs from JD language (ATS penalty).
- Minimum score is 0. A score above 70 requires fewer than 5 key hard skills missing.`;

/* ---- API callers ---- */

async function callOpenAI(
	apiKey: string,
	userMessage: string,
): Promise<string> {
	const model = "gpt-4o-mini";
	console.group(`[CVForge AI] OpenAI — ${model}`);
	console.log("User message:", userMessage);

	const res = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model,
			messages: [
				{ role: "system", content: SYSTEM_PROMPT },
				{ role: "user", content: userMessage },
			],
			temperature: 0.1,
			response_format: { type: "json_object" },
		}),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		const message =
			(err as { error?: { message?: string } }).error?.message ??
			`OpenAI error ${res.status}`;
		console.error("Error:", message);
		console.groupEnd();
		throw new Error(message);
	}

	const data = await res.json();
	const content = data.choices[0].message.content;
	console.log("Raw response:", content);
	console.log("Token usage:", data.usage);
	console.groupEnd();
	return content;
}

async function callAnthropic(
	apiKey: string,
	userMessage: string,
): Promise<string> {
	const model = "claude-haiku-4-5-20251001";
	console.group(`[CVForge AI] Anthropic — ${model}`);
	console.log("User message:", userMessage);

	const res = await fetch("https://api.anthropic.com/v1/messages", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": apiKey,
			"anthropic-version": "2023-06-01",
		},
		body: JSON.stringify({
			model,
			max_tokens: 2048,
			system: SYSTEM_PROMPT,
			messages: [{ role: "user", content: userMessage }],
		}),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		const message =
			(err as { error?: { message?: string } }).error?.message ??
			`Anthropic error ${res.status}`;
		console.error("Error:", message);
		console.groupEnd();
		throw new Error(message);
	}

	const data = await res.json();
	const content = data.content[0].text;
	console.log("Raw response:", content);
	console.log("Token usage:", data.usage);
	console.groupEnd();
	return content;
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
		console.error("[CVForge AI] Schema validation failed:", result.error.issues);
		throw new Error("AI returned invalid response format");
	}

	return result.data;
}
