'use client';

import Link from 'next/link';
import { ThinkingProgress } from '@/components/ThinkingProgress';
import type { PortfolioCaseStudy } from './types';

interface Props {
  username: string;
  loading: boolean;
  portfolio: PortfolioCaseStudy[];
  portfolioSteps: { id: string; label: string }[];
  portfolioActiveIndex: number;
  onGetPortfolio: () => void;
}

export function PortfolioTab({ username, loading, portfolio, portfolioSteps, portfolioActiveIndex, onGetPortfolio }: Props) {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button
        onClick={onGetPortfolio}
        disabled={loading || !username.trim()}
        style={{
          display: 'block', width: '100%', maxWidth: '320px', margin: '0 auto 32px',
          padding: '14px 28px', background: loading ? '#1a1a1a' : '#22c55e',
          border: 'none', borderRadius: '12px',
          color: loading ? '#888' : '#000', fontSize: '16px', fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Generating Portfolio...' : 'Generate Portfolio'}
      </button>

      {loading && (
        <div style={{ maxWidth: '400px', margin: '0 auto 24px' }}>
          <ThinkingProgress steps={portfolioSteps} activeIndex={portfolioActiveIndex} variant="card" />
        </div>
      )}

      {portfolio.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {portfolio.map((cs, index) => (
            <div key={`${cs.repo}-${index}`} style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: '18px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>{cs.title}</div>
                  <div style={{ color: '#888', fontSize: '14px' }}>{cs.repo}</div>
                </div>
                {cs.repoUrl && (
                  <Link href={cs.repoUrl} style={{ padding: '8px 14px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#888', textDecoration: 'none', fontSize: '13px' }}>
                    View Repo
                  </Link>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '16px' }}>
                <div>
                  <div style={{ color: '#22c55e', fontWeight: 600, marginBottom: '6px' }}>Problem</div>
                  <p style={{ color: '#cfcfcf', margin: 0 }}>{cs.problem}</p>
                </div>
                <div>
                  <div style={{ color: '#60a5fa', fontWeight: 600, marginBottom: '6px' }}>Approach</div>
                  <p style={{ color: '#cfcfcf', margin: 0 }}>{cs.approach}</p>
                </div>
                <div>
                  <div style={{ color: '#fbbf24', fontWeight: 600, marginBottom: '6px' }}>Impact</div>
                  <p style={{ color: '#cfcfcf', margin: 0 }}>{cs.impact}</p>
                </div>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {cs.stack.map((tech) => (
                  <span key={`${cs.repo}-${tech}`} style={{ padding: '4px 10px', background: '#1a1a1a', borderRadius: '999px', fontSize: '12px', color: '#888' }}>{tech}</span>
                ))}
              </div>

              <ul style={{ marginTop: '12px', color: '#cfcfcf', paddingLeft: '18px' }}>
                {cs.highlights.map((h, i) => <li key={`${cs.repo}-h-${i}`} style={{ marginBottom: '6px' }}>{h}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
