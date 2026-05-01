'use client';

import { useState } from 'react';
import SkillInput from '@/components/SkillInput';
import ResultCard, { type AnalysisResult } from '@/components/ResultCard';
import OptimizeSkillPanel from '@/components/OptimizeSkillPanel';
import LoadingState from '@/components/LoadingState';
import MetricsDashboard from '@/components/MetricsDashboard';
import ThreatTicker from '@/components/ThreatTicker';

const CHAR_LIMIT = 5_000;

// ── Nav ────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav
      className="w-full px-6 py-4 flex items-center justify-between"
      style={{ borderBottom: '1px solid rgba(15,0,0,0.2)' }}
    >
      <span className="text-base font-bold" style={{ color: '#fdfcfc', letterSpacing: '-0.01em' }}>
        skill<span style={{ color: '#6e6e73' }}>.</span>checker
      </span>
      <div className="flex items-center gap-6">
        <a
          href="/admin"
          className="text-sm"
          style={{ color: '#6e6e73', textDecoration: 'none' }}
        >
          admin
        </a>
        <span className="text-sm" style={{ color: '#6e6e73' }}>
          v1.0.0
        </span>
        <span
          className="text-xs px-2 py-0.5"
          style={{
            color: '#30d158',
            border: '1px solid rgba(48,209,88,0.3)',
            borderRadius: '4px',
          }}
        >
          live
        </span>
      </div>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <div className="mb-12">
      <div className="mb-3">
        <span className="text-sm" style={{ color: '#007aff' }}>
          $ skill-checker --analyze
        </span>
      </div>
      <h1
        className="font-bold mb-4"
        style={{ fontSize: '38px', lineHeight: 1.5, color: '#fdfcfc' }}
      >
        Analyze Claude Skills
        <br />
        <span style={{ color: '#9a9898' }}>for Security Threats</span>
      </h1>
      <p className="text-base max-w-xl" style={{ color: '#9a9898', lineHeight: 1.6 }}>
        Detect prompt injections, jailbreaks, and manipulation vectors in
        Claude system prompts. Powered by vector similarity (Pinecone) for
        instant pattern matching and Claude Sonnet for zero-day analysis.
      </p>

      <div className="mt-8 space-y-2">
        {[
          ['⚡', 'vector cache', '— instant match for known patterns (>0.90 cosine similarity)'],
          ['🔍', 'llm analysis', '— zero-day threat detection via Claude Sonnet / Gemini'],
          ['🛡', 'structured report', '— benefits, harms, and detected techniques'],
        ].map(([icon, name, desc]) => (
          <div key={name} className="flex items-center gap-2 text-sm">
            <span>{icon}</span>
            <span className="font-bold" style={{ color: '#fdfcfc', minWidth: '120px' }}>
              {name}
            </span>
            <span style={{ color: '#6e6e73' }}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Paywall Alert ──────────────────────────────────────────────────────────

function PaywallAlert({ charCount }: { charCount: number }) {
  return (
    <div
      className="w-full p-5 mb-6"
      style={{
        backgroundColor: 'rgba(255,59,48,0.07)',
        border: '2px solid #ff3b30',
        borderRadius: '4px',
      }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-bold mb-1" style={{ color: '#ff3b30', fontSize: '15px' }}>
            ✕ Character Limit Exceeded
          </p>
          <p className="text-sm" style={{ color: '#9a9898', lineHeight: 1.6 }}>
            The current version supports up to{' '}
            <span style={{ color: '#fdfcfc', fontWeight: 700 }}>
              {CHAR_LIMIT.toLocaleString()} characters
            </span>
            . Your skill is{' '}
            <span style={{ color: '#ff3b30', fontWeight: 700 }}>
              {charCount.toLocaleString()} chars
            </span>
            . Higher limits are coming soon — please trim your prompt to continue.
          </p>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255,214,10,0.08)',
            border: '1px solid rgba(255,214,10,0.3)',
            borderRadius: '4px',
            padding: '8px 16px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '13px' }}>⏳</span>
          <span style={{ color: '#ffd60a', fontSize: '13px', fontWeight: 700 }}>
            Higher limits coming soon
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Error Banner ───────────────────────────────────────────────────────────

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div
      className="w-full flex items-start justify-between gap-4 p-4 mb-6"
      style={{
        backgroundColor: 'rgba(255,59,48,0.08)',
        border: '1px solid rgba(255,59,48,0.3)',
        borderRadius: '4px',
      }}
    >
      <div className="flex items-start gap-3">
        <span style={{ color: '#ff3b30' }}>✕</span>
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: '#ff3b30' }}>
            analysis failed
          </p>
          <p className="text-sm" style={{ color: '#9a9898' }}>
            {message}
          </p>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="text-xs shrink-0"
        style={{ color: '#6e6e73', fontFamily: 'inherit', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        dismiss
      </button>
    </div>
  );
}

// ── Section Label ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-bold mb-4" style={{ color: '#9a9898', letterSpacing: '0.08em' }}>
      {children}
    </p>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [currentSkill, setCurrentSkill] = useState('');

  const limitExceeded = charCount > CHAR_LIMIT;

  async function handleAnalyze(skill: string) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentSkill(skill);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? `server error (${res.status})`);
        return;
      }

      setResult(data as AnalysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'network error — check your connection.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#201d1d' }}>
      <Nav />

      <main className="mx-auto px-6 py-16" style={{ maxWidth: '860px' }}>
        <Hero />

        {/* Live Metrics Dashboard */}
        <MetricsDashboard />

        {/* Divider */}
        <div className="mb-8" style={{ borderTop: '1px solid rgba(15,0,0,0.2)' }} />

        {/* Skill Input */}
        <section className="mb-6">
          <SectionLabel>SKILL INPUT</SectionLabel>
          <SkillInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            onTextChange={(text) => { setCharCount(text.length); setCurrentSkill(text); }}
            limitExceeded={limitExceeded}
          />
        </section>

        {/* Paywall — shown only when char limit exceeded */}
        {limitExceeded && <PaywallAlert charCount={charCount} />}

        {/* Analysis error */}
        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        {/* Loading */}
        {isLoading && (
          <section className="mb-10">
            <SectionLabel>ANALYSIS</SectionLabel>
            <LoadingState />
          </section>
        )}

        {/* Result */}
        {result && !isLoading && (
          <section className="mb-6">
            <SectionLabel>ANALYSIS RESULT</SectionLabel>
            <ResultCard result={result} />
          </section>
        )}

        {/* Optimize Skill — shown after a result is available */}
        {result && !isLoading && currentSkill && (
          <OptimizeSkillPanel skill={currentSkill} result={result} />
        )}

        {/* Daily Threat Intelligence Ticker */}
        <section className="mb-10">
          <SectionLabel>THREAT INTELLIGENCE</SectionLabel>
          <ThreatTicker />
        </section>

        {/* Footer */}
        <footer
          className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
          style={{ borderTop: '1px solid rgba(15,0,0,0.2)', color: '#6e6e73' }}
        >
          <span>
            skill<span style={{ color: '#302c2c' }}>.</span>checker — built with{' '}
            <span style={{ color: '#9a9898' }}>Claude Sonnet</span> +{' '}
            <span style={{ color: '#9a9898' }}>Pinecone</span> +{' '}
            <span style={{ color: '#9a9898' }}>OpenAI Embeddings</span>
          </span>
          <div className="flex items-center gap-4">
            <a href="/report-bug" style={{ color: '#6e6e73', textDecoration: 'none' }}>
              report bug
            </a>
            <a href="/request-feature" style={{ color: '#6e6e73', textDecoration: 'none' }}>
              request feature
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
