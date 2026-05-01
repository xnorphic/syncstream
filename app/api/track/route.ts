import { NextRequest, NextResponse } from 'next/server';
import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

interface TrackingPayload {
  eventType: string;
  page: string;
  referrer?: string;
  sessionId: string;
  metadata?: Record<string, string | number | boolean>;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function getGeoFromHeaders(req: NextRequest) {
  // Vercel injects these headers automatically on the edge
  return {
    country: req.headers.get('x-vercel-ip-country') ?? 'unknown',
    region: req.headers.get('x-vercel-ip-country-region') ?? 'unknown',
    city: req.headers.get('x-vercel-ip-city') ?? 'unknown',
  };
}

function persistEvent(event: object) {
  try {
    const dir = join(process.cwd(), 'analytics_data');
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const today = new Date().toISOString().slice(0, 10);
    const file = join(dir, `events_${today}.ndjson`);
    appendFileSync(file, JSON.stringify(event) + '\n', 'utf8');
  } catch {
    // Never crash the app over analytics storage failure
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TrackingPayload;

    if (!body.eventType || !body.sessionId) {
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
    }

    const geo = getGeoFromHeaders(req);
    const ip = getClientIp(req);
    // Anonymize IP — keep first 3 octets only (e.g. 192.168.1.x)
    const anonIp = ip.replace(/\.\d+$/, '.x');

    const event = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      eventType: body.eventType,
      page: body.page,
      referrer: body.referrer ?? null,
      sessionId: body.sessionId,
      geo,
      ip: anonIp,
      metadata: body.metadata ?? {},
    };

    persistEvent(event);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
