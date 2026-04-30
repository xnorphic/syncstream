import { getStoredConsent } from '@/components/CookieConsent';

export type EventType = 'pageview' | 'click' | 'scroll' | 'analyze_submit' | 'session_end';

export interface TrackingEvent {
  eventType: EventType;
  page: string;
  referrer?: string;
  sessionId: string;
  metadata?: Record<string, string | number | boolean>;
}

const SESSION_KEY = 'sc_session_id';

function getOrCreateSession(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function track(
  eventType: EventType,
  metadata?: TrackingEvent['metadata'],
): Promise<void> {
  if (typeof window === 'undefined') return;
  if (getStoredConsent() !== 'accepted') return;

  const payload: TrackingEvent = {
    eventType,
    page: window.location.pathname,
    referrer: document.referrer || undefined,
    sessionId: getOrCreateSession(),
    metadata,
  };

  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Silently fail — analytics should never break the app
  }
}

export function trackScrollDepth(): () => void {
  let maxDepth = 0;
  let reported: number[] = [];
  const thresholds = [25, 50, 75, 100];

  function onScroll() {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    const depth = Math.round((scrolled / total) * 100);
    maxDepth = Math.max(maxDepth, depth);

    for (const t of thresholds) {
      if (maxDepth >= t && !reported.includes(t)) {
        reported.push(t);
        track('scroll', { depth: t });
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}
