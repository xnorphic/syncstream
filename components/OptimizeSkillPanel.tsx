'use client';

import { useState } from 'react';
import type { AnalysisResult } from '@/components/ResultCard';

interface OptimizeSkillPanelProps {
  skill: string;
  result: AnalysisResult;
}

type PanelState = 'idle' | 'open' | 'loading' | 'success' | 'error';

export default function OptimizeSkillPanel({ skill, result }: OptimizeSkillPanelProps) {
  const [state, setState] = useState<PanelState>('idle');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sentTo, setSentTo] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/optimize-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill,
          email: email.trim(),
          injectionTechniques: result.injection_techniques,
          jailbreakTechniques: result.jailbreak_techniques,
          threatLevel: result.threat_level,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState('error');
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSentTo(email.trim());
      setState('success');
    } catch {
      setState('error');
      setErrorMsg('Network error — please check your connection and try again.');
    }
  }

  if (state === 'success') {
    return (
      <div
        className="w-full p-5 mb-6"
        style={{
          backgroundColor: 'rgba(48,209,88,0.06)',
          border: '1px solid rgba(48,209,88,0.25)',
          borderRadius: '4px',
        }}
      >
        <div className="flex items-start gap-3">
          <span style={{ color: '#30d158', fontSize: '15px', marginTop: '1px' }}>✓</span>
          <div>
            <p className="text-sm font-bold mb-1" style={{ color: '#30d158' }}>
              Check your inbox
            </p>
            <p className="text-sm" style={{ color: '#9a9898', lineHeight: 1.6 }}>
              Your optimized skill was sent to{' '}
              <span style={{ color: '#fdfcfc', fontWeight: 600 }}>{sentTo}</span>.
              It includes the ROLE / TASK / OUTPUT rewrite with all vulnerabilities corrected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full mb-6"
      style={{
        backgroundColor: '#2a2626',
        border: '1px solid rgba(0,122,255,0.25)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {/* Banner row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-bold mb-1" style={{ color: '#fdfcfc' }}>
            Get an optimized version of this skill
          </p>
          <p className="text-xs" style={{ color: '#9a9898', lineHeight: 1.6 }}>
            We'll rewrite it using a clean{' '}
            <span style={{ color: '#fdfcfc' }}>ROLE / TASK / OUTPUT</span> structure,
            remove any security issues, and deliver it to your inbox — free.
          </p>
        </div>

        {state === 'idle' && (
          <button
            onClick={() => setState('open')}
            style={{
              flexShrink: 0,
              backgroundColor: '#007aff',
              color: '#fdfcfc',
              border: 'none',
              borderRadius: '4px',
              padding: '9px 20px',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Optimize &amp; deliver →
          </button>
        )}
      </div>

      {/* Email form — slides in when open or loading or error */}
      {(state === 'open' || state === 'loading' || state === 'error') && (
        <div
          style={{
            borderTop: '1px solid rgba(253,252,252,0.06)',
            padding: '16px 20px 20px',
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <label
              className="block text-xs font-bold mb-2"
              style={{ color: '#6e6e73', letterSpacing: '0.08em' }}
            >
              YOUR EMAIL — we'll deliver the optimized skill here
            </label>

            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={state === 'loading'}
                style={{
                  flex: 1,
                  backgroundColor: '#201d1d',
                  border: `1px solid ${state === 'error' ? 'rgba(255,59,48,0.4)' : 'rgba(253,252,252,0.1)'}`,
                  borderRadius: '4px',
                  padding: '9px 14px',
                  color: '#fdfcfc',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={state === 'loading' || !email.trim()}
                style={{
                  flexShrink: 0,
                  backgroundColor:
                    state === 'loading' || !email.trim()
                      ? 'rgba(253,252,252,0.08)'
                      : '#fdfcfc',
                  color:
                    state === 'loading' || !email.trim() ? '#6e6e73' : '#201d1d',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '9px 20px',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  cursor:
                    state === 'loading' || !email.trim() ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {state === 'loading' ? 'Generating...' : 'Send to inbox'}
              </button>
            </div>

            {state === 'error' && errorMsg && (
              <p className="text-xs mt-2" style={{ color: '#ff3b30' }}>
                ✕ {errorMsg}
              </p>
            )}

            <p className="text-xs mt-3" style={{ color: '#6e6e73', lineHeight: 1.6 }}>
              We'll use this to send you the optimized skill and occasional feature updates.
              No spam — ever.
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
