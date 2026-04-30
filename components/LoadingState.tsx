'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  'generating embedding...',
  'querying vector database...',
  'checking known patterns...',
  'running llm analysis...',
  'processing results...',
];

export default function LoadingState() {
  const [stepIdx, setStepIdx] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const dotsTimer = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);

    const stepTimer = setInterval(() => {
      setStepIdx((i) => (i + 1) % STEPS.length);
    }, 1800);

    return () => {
      clearInterval(dotsTimer);
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <div
      className="w-full p-8"
      style={{
        backgroundColor: '#302c2c',
        border: '1px solid #646262',
        borderRadius: '4px',
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff3b30' }} />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff9f0a' }} />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#30d158' }} />
        </div>
        <span className="text-sm" style={{ color: '#6e6e73' }}>
          skill-checker — analysis
        </span>
      </div>

      <div className="space-y-2" style={{ color: '#9a9898', fontSize: '14px' }}>
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span style={{ color: i < stepIdx ? '#30d158' : i === stepIdx ? '#007aff' : '#302c2c' }}>
              {i < stepIdx ? '✓' : i === stepIdx ? '›' : '·'}
            </span>
            <span
              style={{
                color:
                  i < stepIdx ? '#6e6e73' : i === stepIdx ? '#fdfcfc' : '#302c2c',
              }}
            >
              {step}
              {i === stepIdx ? dots : ''}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2" style={{ color: '#6e6e73', fontSize: '12px' }}>
        <span
          className="inline-block w-2 h-4"
          style={{
            backgroundColor: '#007aff',
            animation: 'blink 1s step-end infinite',
          }}
        />
        <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
      </div>
    </div>
  );
}
