'use client';

import { useState } from 'react';

interface FeedbackFormProps {
  type: 'bug' | 'feature';
  title: string;
  subtitle: string;
  placeholder: string;
  commandLabel: string;
}

const BG = '#201d1d';
const SURFACE = '#2a2626';
const BORDER = 'rgba(253,252,252,0.08)';
const BORDER_FOCUS = 'rgba(253,252,252,0.25)';
const TEXT = '#fdfcfc';
const MUTED = '#9a9898';
const DIM = '#6e6e73';
const ACCENT = '#007aff';
const SUCCESS = '#30d158';
const DANGER = '#ff3b30';

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="block text-xs font-bold mb-2" style={{ color: MUTED, letterSpacing: '0.08em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: BG,
  border: `1px solid ${BORDER}`,
  borderRadius: '4px',
  padding: '10px 14px',
  color: TEXT,
  fontSize: '13px',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.15s',
};

export default function FeedbackForm({
  type,
  title,
  subtitle,
  placeholder,
  commandLabel,
}: FeedbackFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setServerMsg('');

    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setServerMsg(data.error ?? 'Something went wrong.');
      } else {
        setStatus('success');
        setServerMsg(data.message);
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch {
      setStatus('error');
      setServerMsg('Network error — please try again.');
    }
  }

  const charCount = message.length;
  const charColor = charCount > 1800 ? DANGER : charCount > 1500 ? '#ffd60a' : DIM;

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      {/* Nav */}
      <nav
        className="w-full px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${BORDER}` }}
      >
        <a
          href="/"
          className="text-base font-bold"
          style={{ color: TEXT, letterSpacing: '-0.01em', textDecoration: 'none' }}
        >
          skill<span style={{ color: DIM }}>.</span>checker
        </a>
        <div className="flex items-center gap-6">
          <a href="/report-bug" className="text-sm" style={{ color: type === 'bug' ? TEXT : DIM, textDecoration: 'none' }}>
            report bug
          </a>
          <a href="/request-feature" className="text-sm" style={{ color: type === 'feature' ? TEXT : DIM, textDecoration: 'none' }}>
            request feature
          </a>
          <a href="/" className="text-sm" style={{ color: DIM, textDecoration: 'none' }}>
            ← home
          </a>
        </div>
      </nav>

      <main className="mx-auto px-6 py-16" style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm mb-2" style={{ color: ACCENT }}>
            $ {commandLabel}
          </p>
          <h1 className="font-bold mb-3" style={{ color: TEXT, fontSize: '32px', lineHeight: 1.2 }}>
            {title}
          </h1>
          <p className="text-sm" style={{ color: MUTED, lineHeight: 1.7 }}>
            {subtitle}
          </p>
        </div>

        {/* Form */}
        <div
          style={{
            backgroundColor: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: '6px',
            padding: '28px 28px',
          }}
        >
          {status === 'success' ? (
            <div className="text-center py-8">
              <div
                className="inline-flex items-center justify-center mb-4"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(48,209,88,0.1)',
                  border: `1px solid rgba(48,209,88,0.3)`,
                }}
              >
                <span style={{ color: SUCCESS, fontSize: '20px' }}>✓</span>
              </div>
              <p className="font-bold mb-2" style={{ color: TEXT }}>
                Submitted!
              </p>
              <p className="text-sm mb-6" style={{ color: MUTED }}>
                {serverMsg}
              </p>
              <button
                onClick={() => setStatus('idle')}
                style={{
                  backgroundColor: 'transparent',
                  border: `1px solid ${BORDER_FOCUS}`,
                  borderRadius: '4px',
                  padding: '8px 20px',
                  color: TEXT,
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                }}
              >
                Submit another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <Field label="NAME">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  placeholder="Your name"
                  required
                  style={{
                    ...inputStyle,
                    borderColor: focused === 'name' ? BORDER_FOCUS : BORDER,
                  }}
                />
              </Field>

              <Field label="EMAIL">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  placeholder="you@example.com"
                  required
                  style={{
                    ...inputStyle,
                    borderColor: focused === 'email' ? BORDER_FOCUS : BORDER,
                  }}
                />
              </Field>

              <Field label="MESSAGE">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                  placeholder={placeholder}
                  required
                  rows={7}
                  style={{
                    ...inputStyle,
                    borderColor: focused === 'message' ? BORDER_FOCUS : BORDER,
                    resize: 'vertical',
                    lineHeight: 1.6,
                  }}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs" style={{ color: charColor }}>
                    {charCount} / 2000
                  </span>
                </div>
              </Field>

              {status === 'error' && (
                <div
                  className="mb-5 px-4 py-3 text-sm"
                  style={{
                    backgroundColor: 'rgba(255,59,48,0.08)',
                    border: `1px solid rgba(255,59,48,0.3)`,
                    borderRadius: '4px',
                    color: DANGER,
                  }}
                >
                  ✕ {serverMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  backgroundColor: status === 'loading' ? 'rgba(253,252,252,0.1)' : TEXT,
                  color: status === 'loading' ? DIM : BG,
                  border: 'none',
                  borderRadius: '4px',
                  padding: '11px 0',
                  fontSize: '14px',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.15s',
                }}
              >
                {status === 'loading' ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          )}
        </div>

        {/* Footer note */}
        <p className="text-xs mt-6 text-center" style={{ color: DIM }}>
          Submissions are stored privately and reviewed by the team.
        </p>
      </main>
    </div>
  );
}
