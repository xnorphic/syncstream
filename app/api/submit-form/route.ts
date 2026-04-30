import { NextRequest, NextResponse } from 'next/server';
import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

export interface FormPayload {
  type: 'bug' | 'feature';
  name: string;
  email: string;
  message: string;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function getGeo(req: NextRequest) {
  return {
    country: req.headers.get('x-vercel-ip-country') ?? 'unknown',
    region: req.headers.get('x-vercel-ip-country-region') ?? 'unknown',
    city: req.headers.get('x-vercel-ip-city') ?? 'unknown',
  };
}

function appendToLog(entry: object) {
  const dir = join(process.cwd(), 'feedback_data');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const file = join(dir, 'feedback_log.txt');
  const line = JSON.stringify(entry) + '\n';
  appendFileSync(file, line, 'utf8');
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FormPayload;
    const { type, name, email, message } = body;

    if (!type || !name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (!['bug', 'feature'].includes(type)) {
      return NextResponse.json({ error: 'Invalid form type.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message must be under 2000 characters.' }, { status: 400 });
    }

    const geo = getGeo(req);
    const ip = getClientIp(req).replace(/\.\d+$/, '.x');

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      type,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      geo,
      ip,
    };

    appendToLog(entry);

    return NextResponse.json({ ok: true, message: 'Submitted successfully. Thank you!' });
  } catch {
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
