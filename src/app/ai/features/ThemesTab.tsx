'use client';

import Link from 'next/link';
import { ThinkingProgress } from '@/components/ThinkingProgress';
import type { ThemeRecommendation } from './types';
import { THEME_COLORS } from './types';

interface Props {
  username: string;
  loading: boolean;
  recommendations: ThemeRecommendation[];
  themesSteps: { id: string; label: string }[];
  themesActiveIndex: number;
  onGetThemes: () => void;
}

export function ThemesTab({ username, loading, recommendations, themesSteps, themesActiveIndex, onGetThemes }: Props) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={onGetThemes}
        disabled={loading || !username.trim()}
        style={{
          display: 'block', width: '100%', maxWidth: '300px', margin: '0 auto 32px',
          padding: '14px 28px', background: loading ? '#1a1a1a' : '#22c55e',
          border: 'none', borderRadius: '12px',
          color: loading ? '#888' : '#000', fontSize: '16px', fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Getting Recommendations...' : 'Get Theme Recommendations'}
      </button>

      {loading && (
        <div style={{ maxWidth: '360px', margin: '0 auto 24px' }}>
          <ThinkingProgress steps={themesSteps} activeIndex={themesActiveIndex} variant="card" />
        </div>
      )}

      {recommendations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recommendations.map((rec, index) => (
            <div key={rec.theme} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#161616', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: THEME_COLORS[rec.theme] ?? '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 700, color: '#000', flexShrink: 0 }}>
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <span style={{ color: '#fff', fontSize: '18px', fontWeight: 600, textTransform: 'capitalize' }}>{rec.theme}</span>
                  <span style={{ padding: '2px 8px', background: 'rgba(34,197,94,0.2)', borderRadius: '10px', color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>{rec.score}% match</span>
                </div>
                <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>{rec.reason}</p>
              </div>
              <Link href={`/showcase/${username}?theme=${rec.theme}`} style={{ padding: '10px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px', color: '#888', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Preview
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
