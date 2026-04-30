import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

export async function GET(request) {
  // Verify Bearer token server-side — secret never leaves the server
  const auth = request.headers.get('authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();

  if (!token || token !== process.env.ADMIN_SECRET) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const index = pc.index('prompt-checker-2', process.env.PINECONE_HOST_URL);

    // Zero-vector query returns all stored vectors ranked by distance
    const zeroVector = new Array(1536).fill(0);
    const result = await index.query({
      vector: zeroVector,
      topK: 50,
      includeMetadata: true,
    });

    return Response.json({ threats: result.matches });
  } catch (err) {
    console.error('[/api/admin/threats]', err);
    return Response.json({ error: err?.message ?? 'query failed' }, { status: 500 });
  }
}
