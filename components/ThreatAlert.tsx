'use client';

interface ThreatAlertProps {
  level: 'safe' | 'warning' | 'danger';
  source: 'vectordb' | 'llm' | 'gemini_fallback';
}

const LEVELS = {
  safe: { label: 'SAFE', color: '#30d158', symbol: '✓' },
  warning: { label: 'WARNING', color: '#ff9f0a', symbol: '⚠' },
  danger: { label: 'DANGER', color: '#ff3b30', symbol: '✕' },
};

export default function ThreatAlert({ level, source }: ThreatAlertProps) {
  const { label, color, symbol } = LEVELS[level];

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div
        className="flex items-center gap-2"
        style={{ color }}
      >
        <span
          className="flex items-center justify-center w-6 h-6 text-sm font-bold"
          style={{
            border: `1px solid ${color}`,
            borderRadius: '4px',
            lineHeight: 1,
          }}
        >
          {symbol}
        </span>
        <span className="text-base font-bold tracking-widest">{label}</span>
      </div>

      <span
        className="text-sm"
        style={{ color: '#9a9898', borderRadius: '4px' }}
      >
        <span style={{ color: '#6e6e73' }}>via</span>{' '}
        {source === 'vectordb' ? (
          <span style={{ color: '#007aff' }}>vector cache</span>
        ) : source === 'gemini_fallback' ? (
          <span style={{ color: '#ff9f0a' }}>gemini fallback</span>
        ) : (
          <span style={{ color: '#9a9898' }}>claude sonnet</span>
        )}
      </span>
    </div>
  );
}
