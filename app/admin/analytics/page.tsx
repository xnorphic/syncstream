'use client';

import { useState, useCallback } from 'react';

interface AnalyticsStats {
  totalEvents: number;
  uniqueSessions: number;
  pageviews: number;
  topPages: Array<{ page: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  eventBreakdown: Record<string, number>;
  recentEvents: Array<{
    id: string;
    timestamp: string;
    eventType: string;
    page: string;
    sessionId: string;
    geo: { country: string; region: string; city: string };
    metadata: Record<string, string | number | boolean>;
  }>;
  dateRange: { from: string; to: string };
}

const EVENT_COLORS: Record<string, string> = {
  pageview: '#30d158',
  click: '#007aff',
  scroll: '#ffd60a',
  analyze_submit: '#ff9f0a',
  session_end: '#6e6e73',
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        backgroundColor: '#2a2626',
        border: '1px solid rgba(253,252,252,0.08)',
        borderRadius: '6px',
        padding: '20px 24px',
      }}
    >
      <p className="text-xs mb-1" style={{ color: '#6e6e73', letterSpacing: '0.08em' }}>
        {label.toUpperCase()}
      </p>
      <p className="font-bold" style={{ color: '#fdfcfc', fontSize: '28px' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function Bar({
  label,
  count,
  max,
  color = '#007aff',
}: {
  label: string;
  count: number;
  max: number;
  color?: string;
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: '#9a9898' }}>{label}</span>
        <span style={{ color: '#fdfcfc' }}>{count.toLocaleString()}</span>
      </div>
      <div
        style={{
          height: '4px',
          backgroundColor: 'rgba(253,252,252,0.06)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            backgroundColor: color,
            borderRadius: '2px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
}

export default function AnalyticsDashboardPage() {
  const [secret, setSecret] = useState('');
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!secret.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics?days=${days}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `error ${res.status}`);
        return;
      }
      setStats(data as AnalyticsStats);
    } catch {
      setError('network error');
    } finally {
      setLoading(false);
    }
  }, [secret, days]);

  const maxPage = stats?.topPages[0]?.count ?? 1;
  const maxCountry = stats?.topCountries[0]?.count ?? 1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#201d1d', fontFamily: 'var(--font-mono)' }}>
      <div className="mx-auto px-6 py-12" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm mb-2" style={{ color: '#007aff' }}>$ analytics --dashboard</p>
          <h1 className="font-bold mb-1" style={{ color: '#fdfcfc', fontSize: '28px' }}>
            Traffic Analytics
          </h1>
          <p className="text-sm" style={{ color: '#6e6e73' }}>
            User behavior, geo distribution, and event breakdown.
          </p>
        </div>

        {/* Auth + Controls */}
        <div
          className="flex flex-col sm:flex-row gap-3 mb-10 p-5"
          style={{
            backgroundColor: '#2a2626',
            border: '1px solid rgba(253,252,252,0.08)',
            borderRadius: '6px',
          }}
        >
          <input
            type="password"
            placeholder="admin secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            style={{
              flex: 1,
              backgroundColor: '#201d1d',
              border: '1px solid rgba(253,252,252,0.1)',
              borderRadius: '4px',
              padding: '8px 14px',
              color: '#fdfcfc',
              fontSize: '13px',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            style={{
              backgroundColor: '#201d1d',
              border: '1px solid rgba(253,252,252,0.1)',
              borderRadius: '4px',
              padding: '8px 14px',
              color: '#9a9898',
              fontSize: '13px',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          >
            <option value={1}>last 1 day</option>
            <option value={7}>last 7 days</option>
            <option value={14}>last 14 days</option>
            <option value={30}>last 30 days</option>
          </select>
          <button
            onClick={load}
            disabled={loading || !secret.trim()}
            style={{
              backgroundColor: loading || !secret.trim() ? 'rgba(253,252,252,0.1)' : '#fdfcfc',
              color: loading || !secret.trim() ? '#6e6e73' : '#201d1d',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: loading || !secret.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'loading...' : 'Load'}
          </button>
        </div>

        {error && (
          <p className="text-sm mb-6" style={{ color: '#ff3b30' }}>
            ✕ {error}
          </p>
        )}

        {stats && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <StatCard label="Total Events" value={stats.totalEvents} />
              <StatCard label="Unique Sessions" value={stats.uniqueSessions} />
              <StatCard label="Page Views" value={stats.pageviews} />
            </div>

            {/* Event breakdown + Geo side by side */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {/* Event types */}
              <div
                style={{
                  backgroundColor: '#2a2626',
                  border: '1px solid rgba(253,252,252,0.08)',
                  borderRadius: '6px',
                  padding: '20px 24px',
                }}
              >
                <p className="text-xs font-bold mb-5" style={{ color: '#9a9898', letterSpacing: '0.08em' }}>
                  EVENT BREAKDOWN
                </p>
                {Object.entries(stats.eventBreakdown).map(([type, count]) => (
                  <Bar
                    key={type}
                    label={type}
                    count={count}
                    max={stats.totalEvents}
                    color={EVENT_COLORS[type] ?? '#6e6e73'}
                  />
                ))}
              </div>

              {/* Top countries */}
              <div
                style={{
                  backgroundColor: '#2a2626',
                  border: '1px solid rgba(253,252,252,0.08)',
                  borderRadius: '6px',
                  padding: '20px 24px',
                }}
              >
                <p className="text-xs font-bold mb-5" style={{ color: '#9a9898', letterSpacing: '0.08em' }}>
                  TOP COUNTRIES
                </p>
                {stats.topCountries.map(({ country, count }) => (
                  <Bar key={country} label={country} count={count} max={maxCountry} color="#30d158" />
                ))}
                {stats.topCountries.length === 0 && (
                  <p className="text-xs" style={{ color: '#6e6e73' }}>no geo data yet</p>
                )}
              </div>
            </div>

            {/* Top pages */}
            <div
              className="mb-8"
              style={{
                backgroundColor: '#2a2626',
                border: '1px solid rgba(253,252,252,0.08)',
                borderRadius: '6px',
                padding: '20px 24px',
              }}
            >
              <p className="text-xs font-bold mb-5" style={{ color: '#9a9898', letterSpacing: '0.08em' }}>
                TOP PAGES
              </p>
              {stats.topPages.map(({ page, count }) => (
                <Bar key={page} label={page} count={count} max={maxPage} color="#007aff" />
              ))}
            </div>

            {/* Recent events table */}
            <div
              style={{
                backgroundColor: '#2a2626',
                border: '1px solid rgba(253,252,252,0.08)',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <p
                className="text-xs font-bold px-6 py-4"
                style={{
                  color: '#9a9898',
                  letterSpacing: '0.08em',
                  borderBottom: '1px solid rgba(253,252,252,0.06)',
                }}
              >
                RECENT EVENTS (last 50)
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(253,252,252,0.06)' }}>
                      {['timestamp', 'type', 'page', 'session', 'country'].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: '10px 16px',
                            textAlign: 'left',
                            color: '#6e6e73',
                            fontWeight: 500,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentEvents.map((ev) => (
                      <tr
                        key={ev.id}
                        style={{ borderBottom: '1px solid rgba(253,252,252,0.04)' }}
                      >
                        <td style={{ padding: '9px 16px', color: '#6e6e73' }}>
                          {new Date(ev.timestamp).toLocaleString()}
                        </td>
                        <td style={{ padding: '9px 16px' }}>
                          <span
                            style={{
                              color: EVENT_COLORS[ev.eventType] ?? '#6e6e73',
                              fontWeight: 600,
                            }}
                          >
                            {ev.eventType}
                          </span>
                        </td>
                        <td style={{ padding: '9px 16px', color: '#9a9898' }}>{ev.page}</td>
                        <td style={{ padding: '9px 16px', color: '#6e6e73' }}>
                          {ev.sessionId.slice(0, 12)}…
                        </td>
                        <td style={{ padding: '9px 16px', color: '#9a9898' }}>
                          {ev.geo?.country ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs mt-6" style={{ color: '#6e6e73' }}>
              Date range: {stats.dateRange.from ? new Date(stats.dateRange.from).toLocaleDateString() : '—'} →{' '}
              {stats.dateRange.to ? new Date(stats.dateRange.to).toLocaleDateString() : '—'}
            </p>
          </>
        )}

        {!stats && !loading && (
          <p className="text-sm" style={{ color: '#6e6e73' }}>
            Enter your admin secret and click Load to view analytics.
          </p>
        )}
      </div>
    </div>
  );
}
