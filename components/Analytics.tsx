'use client';

import { useEffect } from 'react';
import { track, trackScrollDepth } from '@/lib/analytics/events';
import { getStoredConsent } from '@/components/CookieConsent';

interface AnalyticsProps {
  consent: 'accepted' | 'declined' | null;
}

export default function Analytics({ consent }: AnalyticsProps) {
  useEffect(() => {
    if (consent !== 'accepted') return;

    // Page view
    track('pageview', {
      userAgent: navigator.userAgent.slice(0, 120),
      screenWidth: window.screen.width,
      language: navigator.language,
    });

    // Scroll depth
    const cleanup = trackScrollDepth();

    // Session end on unload
    function onUnload() {
      track('session_end');
    }
    window.addEventListener('beforeunload', onUnload);

    return () => {
      cleanup();
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [consent]);

  return null;
}

// Convenience helper — call this from any client component to track clicks
export function useClickTracker(elementId: string) {
  return () => {
    if (getStoredConsent() !== 'accepted') return;
    track('click', { elementId });
  };
}
