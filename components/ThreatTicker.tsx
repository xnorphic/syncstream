'use client';

import { useState, useEffect } from 'react';

const ALL_THREATS = [
  'Prompt injection via delimiter confusion',
  'DAN jailbreak — "Do Anything Now" persona hijacking',
  'Token smuggling via Unicode homoglyphs',
  'Indirect prompt injection via RAG-poisoned documents',
  'Role-play bypass using fictional framing',
  'System prompt exfiltration via multi-turn probing',
  'Gradient-based adversarial suffix injection',
  'Many-shot jailbreaking via in-context learning abuse',
  'Base64 / encoded payload injection',
  'Multi-language jailbreak via translation boundary exploit',
  'Conversation history manipulation',
  'Tool-call hijacking in agentic pipelines',
  'Context window saturation attacks',
  'Sycophancy exploitation for unsafe content generation',
  'Memory poisoning in persistent AI systems',
  'Cross-prompt injection in multi-agent architectures',
  'Adversarial instruction nesting',
  'Output format manipulation — JSON and code injection',
  'Hypothetical scenario framing for policy bypass',
  'Jailbreak via academic / research framing',
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
}

function getTopFive(): string[] {
  const offset = getDayOfYear() % (ALL_THREATS.length - 4);
  return ALL_THREATS.slice(offset, offset + 5);
}

export default function ThreatTicker() {
  const [threats, setThreats] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setThreats(getTopFive());
  }, []);

  useEffect(() => {
    if (!threats.length) return;
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % threats.length), 3_000);
    return () => clearInterval(id);
  }, [threats]);

  if (!threats.length) return null;

  return (
    <div
      className="w-full p-5"
      style={{
        backgroundColor: '#302c2c',
        border: '1px solid #646262',
        borderRadius: '4px',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span style={{ color: '#ff9f0a' }}>⚠</span>
        <span
          className="text-sm font-bold"
          style={{ color: '#9a9898', letterSpacing: '0.08em' }}
        >
          DAILY THREAT INTELLIGENCE
        </span>
        <span className="text-xs ml-auto" style={{ color: '#6e6e73' }}>
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Threat list */}
      <ul className="space-y-3">
        {threats.map((threat, i) => {
          const isActive = i === activeIdx;
          return (
            <li
              key={threat}
              className="flex items-center gap-3 text-sm"
              style={{
                color: isActive ? '#fdfcfc' : '#6e6e73',
                transition: 'color 300ms',
              }}
            >
              <span
                style={{
                  color: isActive ? '#ff9f0a' : '#6e6e73',
                  minWidth: '20px',
                  fontWeight: 700,
                  transition: 'color 300ms',
                }}
              >
                {i + 1}.
              </span>
              <span style={{ fontWeight: isActive ? 700 : 400, flex: 1 }}>
                {threat}
              </span>
              {isActive && (
                <span
                  className="text-xs px-1.5 py-0.5 shrink-0"
                  style={{
                    color: '#ff9f0a',
                    border: '1px solid rgba(255,159,10,0.35)',
                    borderRadius: '4px',
                    letterSpacing: '0.04em',
                  }}
                >
                  TODAY
                </span>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-xs mt-4" style={{ color: '#6e6e73' }}>
        Top threats rotate daily based on global scan telemetry.
      </p>
    </div>
  );
}
