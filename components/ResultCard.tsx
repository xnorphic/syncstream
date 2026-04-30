'use client';

import ThreatAlert from './ThreatAlert';

export interface AnalysisResult {
  source: 'vectordb' | 'llm' | 'gemini_fallback';
  threat_level: 'safe' | 'warning' | 'danger';
  summary: string;
  benefits: string[];
  potential_harms: string[];
  injection_techniques: string[];
  jailbreak_techniques: string[];
}

interface ResultCardProps {
  result: AnalysisResult;
}

function Section({
  title,
  items,
  dot,
}: {
  title: string;
  items: string[];
  dot: string;
}) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-sm font-bold mb-3" style={{ color: '#9a9898', letterSpacing: '0.08em' }}>
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#fdfcfc', lineHeight: 1.6 }}>
            <span className="mt-1 shrink-0" style={{ color: dot }}>
              ›
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TechniqueTag({ label }: { label: string }) {
  return (
    <span
      className="inline-block text-xs px-2 py-0.5"
      style={{
        color: '#ff3b30',
        border: '1px solid rgba(255,59,48,0.3)',
        borderRadius: '4px',
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

export default function ResultCard({ result }: ResultCardProps) {
  const hasTechniques =
    result.injection_techniques.length > 0 || result.jailbreak_techniques.length > 0;

  const borderColor =
    result.threat_level === 'danger'
      ? 'rgba(255,59,48,0.4)'
      : result.threat_level === 'warning'
      ? 'rgba(255,159,10,0.4)'
      : 'rgba(48,209,88,0.3)';

  return (
    <div
      className="w-full"
      style={{
        backgroundColor: '#302c2c',
        border: `1px solid ${borderColor}`,
        borderRadius: '4px',
      }}
    >
      {/* Terminal chrome */}
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{ borderBottom: '1px solid rgba(15,0,0,0.2)' }}
      >
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff3b30' }} />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff9f0a' }} />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#30d158' }} />
        </div>
        <span className="text-sm" style={{ color: '#6e6e73' }}>
          skill-checker — result
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Threat level */}
        <ThreatAlert level={result.threat_level} source={result.source} />

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(15,0,0,0.2)' }} />

        {/* Summary */}
        <div>
          <p className="text-sm font-bold mb-2" style={{ color: '#9a9898', letterSpacing: '0.08em' }}>
            SUMMARY
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#fdfcfc' }}>
            {result.summary}
          </p>
        </div>

        {/* Benefits */}
        <Section
          title="INTENDED BENEFITS"
          items={result.benefits}
          dot="#30d158"
        />

        {/* Harms */}
        <Section
          title="POTENTIAL HARMS"
          items={result.potential_harms}
          dot="#ff9f0a"
        />

        {/* Detected techniques */}
        {hasTechniques && (
          <div>
            <p className="text-sm font-bold mb-3" style={{ color: '#9a9898', letterSpacing: '0.08em' }}>
              DETECTED TECHNIQUES
            </p>
            <div className="flex flex-wrap gap-2">
              {result.injection_techniques.map((t) => (
                <TechniqueTag key={t} label={`[injection] ${t}`} />
              ))}
              {result.jailbreak_techniques.map((t) => (
                <TechniqueTag key={t} label={`[jailbreak] ${t}`} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between text-xs pt-2"
          style={{
            borderTop: '1px solid rgba(15,0,0,0.2)',
            color: '#6e6e73',
          }}
        >
          <span>
            {result.source === 'vectordb'
              ? '⚡ instant — matched from vector cache'
              : result.source === 'gemini_fallback'
              ? '🔍 fresh — analyzed by gemini 2.5 flash (anthropic fallback)'
              : '🔍 fresh — analyzed by claude sonnet'}
          </span>
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}
