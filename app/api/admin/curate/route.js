import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ── Rubric prompt ─────────────────────────────────────────────────────────────

const CATEGORIZATION_PROMPT = `You are an expert AI skill curator. Analyze the provided Claude Skill (system prompt) and return a structured evaluation.

Scoring rubric (score each criterion within its max):
- Clarity of Purpose: 0–15 pts (can you understand the skill in one sentence?)
- Trigger Accuracy: 0–20 pts (does it trigger when it should, and only then?)
- Scope Definition: 0–15 pts (are in/out boundaries clearly stated?)
- Practical Utility: 0–20 pts (real, frequent problem vs niche edge case?)
- Content Quality: 0–15 pts (actionable, complete, unambiguous?)
- Maintenance & Accuracy: 0–10 pts (will this remain valid in 6 months?)

Total max: 95 pts. Scale to /10 by dividing total by 9.5.

Decision thresholds (scaled /10):
- 9–10 → "Keep"
- 7–8 → "Strong"
- 5–6 → "Consider"
- <5 → "Remove"

Categories (choose the best fit):
Coding, Writing, Analysis, Research, Productivity, Business, Education, Creative, DevOps, Data Science, Other

Respond ONLY with a valid JSON object, no markdown fencing:
{
  "category": "string",
  "subcategory": "string (specific area, e.g. React, Financial Analysis, Technical Writing)",
  "clarity": 0-15,
  "trigger_accuracy": 0-20,
  "scope": 0-15,
  "utility": 0-20,
  "content_quality": 0-15,
  "maintenance": 0-10,
  "total_score": 0-95,
  "scaled_score": "0.0-10.0 (one decimal)",
  "decision": "Keep|Strong|Consider|Remove",
  "red_flags": "comma-separated list of concerns, or empty string if none"
}`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

function stripFences(raw) {
  return raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
}

async function evaluateSkill(skill) {
  const userContent = `<skill>\n${skill}\n</skill>`;

  // Primary: Anthropic Claude
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: CATEGORIZATION_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    });
    const block = message.content[0];
    if (block.type !== 'text') throw new Error('Non-text response from Claude');
    return JSON.parse(stripFences(block.text));
  } catch (anthropicErr) {
    console.error('Anthropic failed in curate, falling back to Gemini:', anthropicErr);
  }

  // Fallback: Gemini
  const response = await genai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: userContent,
    config: { systemInstruction: CATEGORIZATION_PROMPT },
  });
  return JSON.parse(stripFences(response.text ?? ''));
}

function buildSkillMarkdown(skill, summary, evaluation) {
  const lines = [
    `# ${summary || 'Vetted Skill'}`,
    ``,
    `> **Category:** ${evaluation.category} / ${evaluation.subcategory}`,
    `> **Score:** ${evaluation.scaled_score}/10 (${evaluation.decision})`,
    `> **Curated:** ${new Date().toISOString().split('T')[0]}`,
    ``,
    `## System Prompt`,
    ``,
    '```',
    skill.trim(),
    '```',
    ``,
    `## Evaluation`,
    ``,
    `| Criterion | Score | Max |`,
    `|-----------|-------|-----|`,
    `| Clarity of Purpose | ${evaluation.clarity} | 15 |`,
    `| Trigger Accuracy | ${evaluation.trigger_accuracy} | 20 |`,
    `| Scope Definition | ${evaluation.scope} | 15 |`,
    `| Practical Utility | ${evaluation.utility} | 20 |`,
    `| Content Quality | ${evaluation.content_quality} | 15 |`,
    `| Maintenance & Accuracy | ${evaluation.maintenance} | 10 |`,
    `| **Total** | **${evaluation.total_score}** | **95** |`,
    ``,
  ];

  if (evaluation.red_flags) {
    lines.push(`## Red Flags`, ``, evaluation.red_flags, ``);
  }

  return lines.join('\n');
}

function escapeCSVField(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function appendCSVRow(csvPath, row) {
  const line = row.map(escapeCSVField).join(',');
  fs.appendFileSync(csvPath, line + '\n', 'utf8');
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request) {
  // Auth
  const auth = request.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token || token !== process.env.ADMIN_SECRET) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  const { skill, summary } = body;
  if (!skill || typeof skill !== 'string' || !skill.trim()) {
    return Response.json({ error: 'skill text is required' }, { status: 400 });
  }

  try {
    // 1. Categorize and score with LLM
    const evaluation = await evaluateSkill(skill.trim());

    // Validate required fields
    const required = ['category', 'subcategory', 'clarity', 'trigger_accuracy', 'scope',
      'utility', 'content_quality', 'maintenance', 'total_score', 'scaled_score', 'decision'];
    for (const field of required) {
      if (evaluation[field] === undefined) throw new Error(`LLM missing field: ${field}`);
    }

    // 2. Build directory path: vetted_skills/[Category]/[Subcategory]/
    const safeCategory = slugify(evaluation.category) || 'uncategorized';
    const safeSubcategory = slugify(evaluation.subcategory) || 'general';
    const dirPath = path.join(process.cwd(), 'vetted_skills', safeCategory, safeSubcategory);
    fs.mkdirSync(dirPath, { recursive: true });

    // 3. Save skill as .md file
    const slug = slugify(summary || evaluation.subcategory || 'skill');
    const timestamp = Date.now();
    const filename = `${slug}-${timestamp}.md`;
    const filePath = path.join(dirPath, filename);
    fs.writeFileSync(filePath, buildSkillMarkdown(skill, summary, evaluation), 'utf8');

    // 4. Append row to rating_tracker.csv
    const csvPath = path.join(process.cwd(), 'admin_assets', 'rating_tracker.csv');
    const date = new Date().toISOString().split('T')[0];
    appendCSVRow(csvPath, [
      date,
      summary || slug,
      evaluation.clarity,
      evaluation.trigger_accuracy,
      evaluation.scope,
      evaluation.utility,
      evaluation.content_quality,
      evaluation.maintenance,
      evaluation.scaled_score,
      evaluation.decision,
      evaluation.red_flags ?? '',
      '', // Notes — blank for human review
      evaluation.category,
      evaluation.subcategory,
    ]);

    return Response.json({
      status: 'curated',
      category: evaluation.category,
      subcategory: evaluation.subcategory,
      filename,
      path: `vetted_skills/${safeCategory}/${safeSubcategory}/${filename}`,
      total_score: evaluation.scaled_score,
      decision: evaluation.decision,
      red_flags: evaluation.red_flags || null,
    });
  } catch (err) {
    console.error('[/api/admin/curate]', err);
    return Response.json({ error: err?.message ?? 'curation failed' }, { status: 500 });
  }
}
