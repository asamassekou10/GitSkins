'use client';

import Link from 'next/link';
import { ThinkingProgress } from '@/components/ThinkingProgress';
import type { ProfileAnalysis, ProfileData } from './types';
import { THEME_COLORS } from './types';

interface Props {
  username: string;
  analyzing: boolean;
  analysis: ProfileAnalysis | null;
  profileData: ProfileData | null;
  analyzeSteps: { id: string; label: string }[];
  analyzeActiveIndex: number;
  onAnalyze: () => void;
}

export function AnalyzeTab({ username, analyzing, analysis, profileData, analyzeSteps, analyzeActiveIndex, onAnalyze }: Props) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={onAnalyze}
        disabled={analyzing || !username.trim()}
        style={{
          display: 'block', width: '100%', maxWidth: '300px', margin: '0 auto 32px',
          padding: '14px 28px', background: analyzing ? '#1a1a1a' : '#22c55e',
          border: 'none', borderRadius: '12px',
          color: analyzing ? '#888' : '#000', fontSize: '16px', fontWeight: 600,
          cursor: analyzing ? 'not-allowed' : 'pointer',
        }}
      >
        {analyzing ? 'Analyzing profile...' : 'Analyze Profile'}
      </button>

      {analyzing && (
        <div style={{ maxWidth: '360px', margin: '0 auto 24px' }}>
          <ThinkingProgress steps={analyzeSteps} activeIndex={analyzeActiveIndex} variant="card" />
        </div>
      )}

      {analysis && profileData && (
        <div style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: '20px', padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <img src={profileData.avatarUrl} alt={profileData.name ?? username} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #22c55e' }} />
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#fff' }}>{profileData.name || username}</h2>
              <p style={{ margin: '4px 0 0', color: '#22c55e', fontSize: '18px', fontWeight: 600 }}>{analysis.developerType}</p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Personality</h3>
            <p style={{ color: '#e5e5e5', lineHeight: 1.6 }}>{analysis.personality}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px' }}>
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Coding Style</div>
              <div style={{ color: '#fff', fontWeight: 500 }}>{analysis.codingStyle}</div>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px' }}>
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>Collaboration</div>
              <div style={{ color: '#fff', fontWeight: 500 }}>{analysis.collaborationLevel}</div>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Key Strengths</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {analysis.strengths.map((strength) => (
                <span key={strength} style={{ padding: '6px 14px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px', color: '#22c55e', fontSize: '14px' }}>
                  {strength}
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: `linear-gradient(135deg, ${THEME_COLORS[analysis.recommendedTheme] ?? '#22c55e'}20, transparent)`, border: `1px solid ${THEME_COLORS[analysis.recommendedTheme] ?? '#22c55e'}40`, borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Recommended Theme</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: THEME_COLORS[analysis.recommendedTheme] ?? '#22c55e' }} />
              <span style={{ color: '#fff', fontSize: '20px', fontWeight: 600, textTransform: 'capitalize' }}>{analysis.recommendedTheme}</span>
            </div>
            <p style={{ color: '#a3a3a3', margin: 0 }}>{analysis.themeReason}</p>
          </div>

          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
            </svg>
            <span style={{ color: '#a1a1a1' }}>{analysis.funFact}</span>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link href={`/showcase/${username}?theme=${analysis.recommendedTheme}`} style={{ display: 'inline-block', padding: '12px 24px', background: '#22c55e', borderRadius: '10px', color: '#000', fontWeight: 600, textDecoration: 'none' }}>
              View Widgets with {analysis.recommendedTheme} Theme
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
