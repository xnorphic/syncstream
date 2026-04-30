import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

const INDEX_NAME = 'prompt-checker-2';
const SIMILARITY_THRESHOLD = 0.9;

function getIndex() {
  return pc.index(INDEX_NAME, process.env.PINECONE_HOST_URL!);
}

export interface StoredAnalysis {
  threat_level: string;
  summary: string;
  benefits: string;
  potential_harms: string;
  injection_techniques: string;
  jailbreak_techniques: string;
  [key: string]: string;
}

export async function querySimilar(vector: number[]): Promise<StoredAnalysis | null> {
  const result = await getIndex().query({
    vector,
    topK: 1,
    includeMetadata: true,
  });

  const match = result.matches?.[0];
  if (match?.score && match.score >= SIMILARITY_THRESHOLD && match.metadata) {
    return match.metadata as unknown as StoredAnalysis;
  }
  return null;
}

export async function upsertAnalysis(
  id: string,
  vector: number[],
  metadata: StoredAnalysis,
): Promise<void> {
  await getIndex().upsert({ records: [{ id, values: vector, metadata }] });
}
