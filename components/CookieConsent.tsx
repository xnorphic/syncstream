'use client';

import { useEffect, useState } from 'react';

const CONSENT_KEY = 'sc_analytics_consent';
const CONSENT_EXPIRY_DAYS = 365;

export type ConsentState = 'accepted' | 'declined' | null;

export function getStoredConsent(): ConsentState {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    const { value, expiry } = JSON.parse(stored);
    if (Date.now() > expiry) {
      localStorage.removeItem(CONSENT_KEY);
      return null;
    }
    return value as ConsentState;
  } catch {
    return null;
  }
}

function storeConsent(value: 'accepted' | 'declined') {
  const expiry = Date.now() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, expiry }));
}

interface CookieConsentProps {
  onConsent: (state: 'accepted' | 'declined') => void;
}

export default function CookieConsent({ onConsent }: CookieConsentProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      // Small delay so page renders first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function handle(choice: 'accepted' | 'declined') {
    storeConsent(choice);
    setVisible(false);
    onConsent(choice);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'min(560px, calc(100vw - 32px))',
        backgroundColor: '#2a2626',
        border: '1px solid rgba(253,252,252,0.1)',
        borderRadius: '6px',
        padding: '20px 24px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}
    >
      <p className="text-sm font-bold mb-1" style={{ color: '#fdfcfc' }}>
        analytics &amp; cookies
      </p>
      <p className="text-xs mb-5" style={{ color: '#9a9898', lineHeight: 1.6 }}>
        We use cookies to track page visits, interactions, and session data to improve this tool.
        No personal data is collected. You can change your preference at any time.
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => handle('accepted')}
          style={{
            backgroundColor: '#fdfcfc',
            color: '#201d1d',
            border: 'none',
            borderRadius: '4px',
            padding: '7px 18px',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          Accept
        </button>
        <button
          onClick={() => handle('declined')}
          style={{
            backgroundColor: 'transparent',
            color: '#6e6e73',
            border: '1px solid rgba(110,110,115,0.4)',
            borderRadius: '4px',
            padding: '7px 18px',
            fontSize: '13px',
            fontWeight: 500,
            fontFamily: 'inherit',
            cursor: 'pointer',
          }}
        >
          Decline
        </button>
        <span className="text-xs ml-auto" style={{ color: '#6e6e73' }}>
          preference stored for 1 year
        </span>
      </div>
    </div>
  );
}
