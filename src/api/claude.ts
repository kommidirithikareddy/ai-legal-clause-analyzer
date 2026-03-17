import type { ClauseAnalysis } from '../types';

const SYSTEM_PROMPT = `You are an expert legal analyst. When given a legal clause or contract section, analyze it thoroughly and respond with ONLY a valid JSON object (no markdown, no backticks, no extra text) in this exact format:

{
  "risks": [
    {
      "issue": "Brief name of the issue",
      "explanation": "Detailed explanation of why this is a risk",
      "severity": "high" | "medium" | "low"
    }
  ],
  "missingTerms": ["List of important terms or clauses that are absent"],
  "plainSummary": "A clear, jargon-free explanation of what this clause means in plain English",
  "overallRisk": "high" | "medium" | "low",
  "recommendations": ["Actionable suggestions to improve or negotiate this clause"]
}

Be thorough, identify real legal risks, and keep the plainSummary accessible to a non-lawyer.`;

export async function analyzeClause(clauseText: string): Promise<ClauseAnalysis> {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!apiKey) {
    throw new Error('Missing VITE_CLAUDE_API_KEY in .env file');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyze this legal clause:\n\n${clauseText}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.content[0].text;

  try {
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as ClauseAnalysis;
  } catch {
    throw new Error('Failed to parse AI response. Please try again.');
  }
}
