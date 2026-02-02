'use client';

import { useState, useMemo } from 'react';
import { Navigation } from '@/components/landing/Navigation';
import { ShareMenu } from '@/components/ShareMenu';

const ALL_THEMES = [
  'satan', 'neon', 'zen', 'github-dark', 'dracula',
  'winter', 'spring', 'summer', 'autumn',
  'christmas', 'halloween',
  'ocean', 'forest', 'sunset', 'midnight', 'aurora',
  'retro', 'minimal', 'pastel', 'matrix',
] as const;

const THEME_COLORS: Record<string, string> = {
  satan: '#ef4444', neon: '#00ffaa', zen: '#a3a3a3', 'github-dark': '#238636', dracula: '#bd93f9',
  winter: '#93c5fd', spring: '#86efac', summer: '#fbbf24', autumn: '#f97316',
  christmas: '#dc2626', halloween: '#f97316',
  ocean: '#0ea5e9', forest: '#22c55e', sunset: '#f43f5e', midnight: '#6366f1', aurora: '#a78bfa',
  retro: '#facc15', minimal: '#a1a1a1', pastel: '#f9a8d4', matrix: '#00ff41',
};

interface DailyActivity {
  name: string | null;
  avatarUrl: string;
  commits: number;
  additions: number;
  deletions: number;
  prsMerged: number;
  commitMessages: string[];
}

export default function DailyPage() {
  const [username, setUsername] = useState('');
  const [activity, setActivity] = useState<DailyActivity | null>(null);
  const [todayText, setTodayText] = useState('');
  const [tomorrowText, setTomorrowText] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('satan');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    const trimmed = username.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setActivity(null);
    setTodayText('');

    try {
      const res = await fetch('/api/daily-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch');
      }
      const data: DailyActivity = await res.json();
      setActivity(data);

      // Auto-generate AI text from commit messages
      if (data.commitMessages.length > 0) {
        setAiLoading(true);
        try {
          const aiRes = await fetch('/api/daily-generate-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commitMessages: data.commitMessages, username: trimmed }),
          });
          if (aiRes.ok) {
            const aiData = await aiRes.json();
            setTodayText(aiData.text || '');
          }
        } catch {
          // AI text is optional, proceed without it
        } finally {
          setAiLoading(false);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const cardUrl = useMemo(() => {
    if (!activity) return '';
    const params = new URLSearchParams({
      username: username.trim(),
      theme: selectedTheme,
      today: todayText,
      tomorrow: tomorrowText,
      commits: String(activity.commits),
      additions: String(activity.additions),
      deletions: String(activity.deletions),
      prs: String(activity.prsMerged),
      date: today,
      name: activity.name || username.trim(),
      avatar: activity.avatarUrl,
    });
    return `/api/daily-card?${params.toString()}`;
  }, [activity, username, selectedTheme, todayText, tomorrowText, today]);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <Navigation />

      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 1200,
          height: 600,
          background: 'radial-gradient(ellipse at top, rgba(34, 197, 94, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 900,
          margin: '0 auto',
          padding: '120px 24px 80px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 500,
              color: '#22c55e',
              marginBottom: 24,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            #BuildInPublic
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 700,
              margin: 0,
              marginBottom: 12,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Daily Dev Card
          </h1>
          <p style={{ fontSize: 16, color: '#a1a1a1', margin: 0 }}>
            Generate a shareable card showing what you built today. AI-powered summaries, 20 premium themes.
          </p>
        </div>

        {/* Username input */}
        <div style={{ display: 'flex', gap: 8, maxWidth: 460, margin: '0 auto 48px' }}>
          <input
            type="text"
            placeholder="GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
            style={{
              flex: 1,
              padding: '14px 16px',
              background: '#111',
              border: '1px solid #1f1f1f',
              borderRadius: 10,
              color: '#fafafa',
              fontSize: 15,
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#22c55e'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#1f1f1f'; }}
          />
          <button
            onClick={handleFetch}
            disabled={loading || !username.trim()}
            style={{
              padding: '14px 24px',
              background: loading ? '#166534' : '#22c55e',
              border: 'none',
              borderRadius: 10,
              color: '#050505',
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer',
              transition: 'background 0.2s ease',
              whiteSpace: 'nowrap',
              opacity: !username.trim() ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#4ade80'; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#22c55e'; }}
          >
            {loading ? 'Fetching...' : 'Fetch Activity'}
          </button>
        </div>

        {error && (
          <div
            style={{
              textAlign: 'center',
              color: '#ef4444',
              fontSize: 14,
              marginBottom: 24,
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 10,
              maxWidth: 460,
              margin: '0 auto 24px',
            }}
          >
            {error}
          </div>
        )}

        {/* Editor + Preview */}
        {activity && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Text editing */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Today I...
                  {aiLoading && <span style={{ color: '#22c55e', marginLeft: 8, fontWeight: 400, textTransform: 'none' }}>AI generating...</span>}
                </label>
                <textarea
                  value={todayText}
                  onChange={(e) => setTodayText(e.target.value)}
                  placeholder="Built the daily dev card feature..."
                  maxLength={400}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#111',
                    border: '1px solid #1f1f1f',
                    borderRadius: 10,
                    color: '#fafafa',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#22c55e'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#1f1f1f'; }}
                />
                <div style={{ fontSize: 11, color: '#404040', marginTop: 4, textAlign: 'right' }}>
                  {todayText.length}/400
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Tomorrow I&apos;ll...
                </label>
                <textarea
                  value={tomorrowText}
                  onChange={(e) => setTomorrowText(e.target.value)}
                  placeholder="Add animation and ship the feature..."
                  maxLength={400}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#111',
                    border: '1px solid #1f1f1f',
                    borderRadius: 10,
                    color: '#fafafa',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#22c55e'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#1f1f1f'; }}
                />
                <div style={{ fontSize: 11, color: '#404040', marginTop: 4, textAlign: 'right' }}>
                  {tomorrowText.length}/400
                </div>
              </div>
            </div>

            {/* Stats summary */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 12,
              }}
            >
              {[
                { label: 'Commits', value: activity.commits },
                { label: '+ Lines', value: activity.additions },
                { label: '- Lines', value: activity.deletions },
                { label: 'PRs Merged', value: activity.prsMerged },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    padding: '14px 12px',
                    background: '#111',
                    border: '1px solid #1f1f1f',
                    borderRadius: 12,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>
                    {stat.value.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: '#666', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Theme selector */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                Theme
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {ALL_THEMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTheme(t)}
                    style={{
                      padding: '6px 14px',
                      background: selectedTheme === t ? `${THEME_COLORS[t]}20` : '#111',
                      border: `1px solid ${selectedTheme === t ? THEME_COLORS[t] : '#1f1f1f'}`,
                      borderRadius: 8,
                      color: selectedTheme === t ? THEME_COLORS[t] : '#666',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textTransform: 'capitalize',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        background: THEME_COLORS[t],
                        marginRight: 6,
                        verticalAlign: 'middle',
                      }}
                    />
                    {t.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Card preview */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Preview
                </label>
                <ShareMenu
                  shareUrl={`${baseUrl}/daily`}
                  shareText={`Check out what I built today! #BuildInPublic #DevCard`}
                  imageUrl={`${baseUrl}${cardUrl}`}
                  downloadFilename={`daily-card-${username.trim()}-${today}.svg`}
                  context={{ username: username.trim(), theme: selectedTheme, source: 'daily' }}
                />
              </div>
              <div
                style={{
                  background: '#0a0a0a',
                  border: '1px solid #1f1f1f',
                  borderRadius: 16,
                  padding: 16,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cardUrl}
                  alt="Daily Dev Card Preview"
                  style={{
                    width: '100%',
                    maxWidth: 720,
                    height: 'auto',
                    borderRadius: 8,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
