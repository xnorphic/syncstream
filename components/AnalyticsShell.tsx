'use client';

import { useState, useEffect } from 'react';
import CookieConsent, { getStoredConsent, type ConsentState } from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';

export default function AnalyticsShell() {
  const [consent, setConsent] = useState<ConsentState>(null);

  useEffect(() => {
    setConsent(getStoredConsent());
  }, []);

  function handleConsent(value: 'accepted' | 'declined') {
    setConsent(value);
  }

  return (
    <>
      <Analytics consent={consent} />
      <CookieConsent onConsent={handleConsent} />
    </>
  );
}
