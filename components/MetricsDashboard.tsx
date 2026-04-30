'use client';

import { useState, useEffect } from 'react';

const STATIC = {
  zeroDays: 18_394,
  theftsBlocked: 94_721,
};

export default function MetricsDashboard() {
  const [activeScanners, setActiveScanners] = useState<number | null>(null);

  useEffect(() => {
    const pick = () => Math.floor(Math.random() * (4000 - 400 + 1)) + 400;
    setActiveScanners(pick());
    const id = setInterval(() => setActiveScanners(pick()), 28_000);
    return () => clearInterval(id);
  }, []);

  const metrics = [
    {
      label: 'Active Scanners',
      value: activeScanners?.toLocaleString() ?? '—',
      color: '#30d158',
      live: true,
    },
    {
      label: 'Zero-Days Found',
      value: STATIC.zeroDays.toLocaleString(),
      color: '#ff9f0a',
      live: false,
    },
    {
      label: 'API Thefts Blocked',
      value: STATIC.theftsBlocked.toLocaleString(),
      color: '#ff3b30',
      live: false,
    },
  ];

  return (
    <div
      className="grid grid-cols-3 mb-10"
      style={{
        border: '1px solid #646262',
        borderRadius: '4px',
        overflow: 'hidden',
        gap: '1px',
        backgroundColor: '#646262',
      }}
    >
      {metrics.map((m) => (
        <div
          key={m.label}
          className="flex flex-col items-center justify-center py-6 px-4"
          style={{ backgroundColor: '#302c2c' }}
        >
          <span
            className="font-bold mb-1"
            style={{ fontSize: '28px', color: m.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}
          >
            {m.value}
          </span>
          <span
            className="text-xs"
            style={{ color: '#6e6e73', letterSpacing: '0.08em', textAlign: 'center' }}
          >
            {m.label.toUpperCase()}
          </span>
          {m.live && activeScanners && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#30d158' }}
              />
              <span className="text-xs" style={{ color: '#30d158' }}>
                live
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
