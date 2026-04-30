import { getEmbedding } from '@/services/embeddingService';
import { querySimilar, upsertAnalysis } from '@/services/vectorDbService';
import { analyzeSkill } from '@/services/llmAnalyzerService';
import { randomUUID } from 'crypto';

export async function POST(request) {
  try {
    const body = await request.json();
    const skill = body?.skill;

    if (!skill || typeof skill !== 'string' || !skill.trim()) {
      return Response.json({ error: 'skill text is required.' }, { status: 400 });
    }

    const trimmed = skill.trim();

    // 1. Embed
    const vector = await getEmbedding(trimmed);

    // 2. Check vector DB for known pattern (>0.90 cosine similarity)
    const cached = await querySimilar(vector);
    if (cached) {
      return Response.json({
        source: 'vectordb',
        threat_level: cached.threat_level,
        summary: cached.summary,
        benefits: JSON.parse(cached.benefits),
        potential_harms: JSON.parse(cached.potential_harms),
        injection_techniques: JSON.parse(cached.injection_techniques || '[]'),
        jailbreak_techniques: JSON.parse(cached.jailbreak_techniques || '[]'),
      });
    }

    // 3. Zero-day: analyze with Claude
    const analysis = await analyzeSkill(trimmed);

    // 4. Upsert result so future identical prompts hit the cache
    await upsertAnalysis(randomUUID(), vector, {
      threat_level: analysis.threat_level,
      summary: analysis.summary,
      benefits: JSON.stringify(analysis.benefits),
      potential_harms: JSON.stringify(analysis.potential_harms),
      injection_techniques: JSON.stringify(analysis.injection_techniques),
      jailbreak_techniques: JSON.stringify(analysis.jailbreak_techniques),
    });

    return Response.json(analysis); // source is 'llm' or 'gemini_fallback', set by the service
  } catch (err) {
    console.error('[/api/analyze]', err);
    return Response.json({ error: err?.message ?? 'analysis failed.' }, { status: 500 });
  }
}
