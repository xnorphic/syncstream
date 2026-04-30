import { NextRequest, NextResponse } from 'next/server';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';

interface AnalyticsEvent {
  id: string;
  timestamp: string;
  eventType: string;
  page: string;
  referrer: string | null;
  sessionId: string;
  geo: { country: string; region: string; city: string };
  ip: string;
  metadata: Record<string, string | number | boolean>;
}

interface AggregatedStats {
  totalEvents: number;
  uniqueSessions: number;
  pageviews: number;
  topPages: Array<{ page: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  eventBreakdown: Record<string, number>;
  recentEvents: AnalyticsEvent[];
  dateRange: { from: string; to: string };
}

function loadEvents(daysBack = 7): AnalyticsEvent[] {
  const dir = join(process.cwd(), 'analytics_data');
  if (!existsSync(dir)) return [];

  const cutoff = Date.now() - daysBack * 24 * 60 * 60 * 1000;
  const events: AnalyticsEvent[] = [];

  try {
    const files = readdirSync(dir)
      .filter((f) => f.startsWith('events_') && f.endsWith('.ndjson'))
      .sort()
      .reverse()
      .slice(0, daysBack + 1);

    for (const file of files) {
      const lines = readFileSync(join(dir, file), 'utf8').trim().split('\n');
      for (const line of lines) {
        try {
          const ev = JSON.parse(line) as AnalyticsEvent;
          if (new Date(ev.timestamp).getTime() >= cutoff) {
            events.push(ev);
          }
        } catch {
          // Skip malformed lines
        }
      }
    }
  } catch {
    return [];
  }

  return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

function aggregate(events: AnalyticsEvent[]): AggregatedStats {
  const sessions = new Set<string>();
  const pageCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};
  const eventBreakdown: Record<string, number> = {};
  let pageviews = 0;

  for (const ev of events) {
    sessions.add(ev.sessionId);
    eventBreakdown[ev.eventType] = (eventBreakdown[ev.eventType] ?? 0) + 1;
    if (ev.eventType === 'pageview') {
      pageviews++;
      pageCounts[ev.page] = (pageCounts[ev.page] ?? 0) + 1;
    }
    const country = ev.geo?.country ?? 'unknown';
    countryCounts[country] = (countryCounts[country] ?? 0) + 1;
  }

  const sorted = (obj: Record<string, number>) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key, count]) => ({ [Object.keys({ key })[0]]: key, count }));

  const dates = events.map((e) => e.timestamp);

  return {
    totalEvents: events.length,
    uniqueSessions: sessions.size,
    pageviews,
    topPages: sorted(pageCounts).map((e) => ({ page: (e as Record<string,string|number>)['key'] as string, count: e.count })),
    topCountries: sorted(countryCounts).map((e) => ({
      country: (e as Record<string,string|number>)['key'] as string,
      count: e.count,
    })),
    eventBreakdown,
    recentEvents: events.slice(0, 50),
    dateRange: {
      from: dates[dates.length - 1] ?? '',
      to: dates[0] ?? '',
    },
  };
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.replace('Bearer ', '');
  if (!process.env.ADMIN_SECRET || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const daysBack = Math.min(
    30,
    parseInt(req.nextUrl.searchParams.get('days') ?? '7', 10),
  );

  const events = loadEvents(daysBack);
  const stats = aggregate(events);

  return NextResponse.json(stats);
}
