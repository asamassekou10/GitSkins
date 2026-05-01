'use client';

import { ThinkingProgress } from '@/components/ThinkingProgress';
import type { ProfileIntel } from './types';

interface Props {
  username: string;
  loading: boolean;
  intel: ProfileIntel | null;
  intelSteps: { id: string; label: string }[];
  intelActiveIndex: number;
  onGetIntel: () => void;
}

export function IntelTab({ username, loading, intel, intelSteps, intelActiveIndex, onGetIntel }: Props) {
  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <button
        onClick={onGetIntel}
        disabled={loading || !username.trim()}
        style={{
          display: 'block', width: '100%', maxWidth: '320px', margin: '0 auto 32px',
          padding: '14px 28px', background: loading ? '#1a1a1a' : '#22c55e',
          border: 'none', borderRadius: '12px',
          color: loading ? '#888' : '#000', fontSize: '16px', fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Building Intelligence...' : 'Run Profile Intelligence'}
      </button>

      {loading && (
        <div style={{ maxWidth: '400px', margin: '0 auto 24px' }}>
          <ThinkingProgress steps={intelSteps} activeIndex={intelActiveIndex} variant="card" />
        </div>
      )}

      {intel && (
        <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '28px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>Profile Intelligence Summary</h3>
          <p style={{ color: '#cfcfcf', lineHeight: 1.6, marginBottom: '24px' }}>{intel.summary}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {intel.benchmarks.map((b, i) => (
              <div key={`${b.label}-${i}`} style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px' }}>
                <div style={{ color: '#888', fontSize: '12px', marginBottom: '6px' }}>{b.label}</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>{b.value}</div>
                <div style={{ color: '#666', fontSize: '12px', marginTop: '6px' }}>{b.context}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px' }}>
              <div style={{ color: '#22c55e', fontWeight: 600, marginBottom: '8px' }}>Strengths</div>
              <ul style={{ color: '#cfcfcf', paddingLeft: '18px', margin: 0 }}>
                {intel.strengths.map((item, i) => <li key={`s-${i}`} style={{ marginBottom: '6px' }}>{item}</li>)}
              </ul>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px' }}>
              <div style={{ color: '#fbbf24', fontWeight: 600, marginBottom: '8px' }}>Gaps to Close</div>
              <ul style={{ color: '#cfcfcf', paddingLeft: '18px', margin: 0 }}>
                {intel.gaps.map((item, i) => <li key={`g-${i}`} style={{ marginBottom: '6px' }}>{item}</li>)}
              </ul>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px' }}>
              <div style={{ color: '#60a5fa', fontWeight: 600, marginBottom: '8px' }}>Next Actions</div>
              <ul style={{ color: '#cfcfcf', paddingLeft: '18px', margin: 0 }}>
                {intel.recommendations.map((item, i) => <li key={`r-${i}`} style={{ marginBottom: '6px' }}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
