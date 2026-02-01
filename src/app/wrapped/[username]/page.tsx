'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/landing/Navigation';
import { ShareMenu } from '@/components/ShareMenu';

interface ProfileData {
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  location: string | null;
  followers: number;
  following: number;
  totalContributions: number;
  totalStars: number;
  totalRepos: number;
  languages: Array<{ name: string; color: string; percentage: number }>;
  pinnedRepos: Array<{ name: string; description: string | null; stars: number; forks: number; language: string | null; url: string }>;
  streak: { current: number; longest: number; totalDays: number };
}

interface WrappedData {
  codingPersonality: string;
  contributionComparison: string;
  narrative: string;
  highlights: string[];
  industryBenchmarks: Array<{ metric: string; userValue: string; industryAvg: string; percentile: string }>;
}

const TOTAL_SLIDES = 8;
const accent = '#22c55e';
const accentLight = '#4ade80';

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      start = Math.floor(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function WrappedContent() {
  const params = useParams();
  const username = (params.username as string) || '';

  const [currentSlide, setCurrentSlide] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [wrappedData, setWrappedData] = useState<WrappedData | null>(null);
  const [thoughts, setThoughts] = useState<Array<{ content: string; timestamp: number }>>([]);
  const [rawText, setRawText] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [streaming, setStreaming] = useState(true);
  const [showThoughts, setShowThoughts] = useState(false);
  const thoughtsRef = useRef<HTMLDivElement>(null);

  // SSE streaming
  const startStream = useCallback(async () => {
    setStreaming(true);
    setError('');
    setRawText('');
    setThoughts([]);
    setWrappedData(null);

    try {
      const res = await fetch('/api/wrapped', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || `Error ${res.status}`);
        setStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError('No stream available');
        setStreaming(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') break;

          try {
            const chunk = JSON.parse(data) as { type: string; content: string };
            if (chunk.type === 'profile') {
              const profile = JSON.parse(chunk.content) as ProfileData;
              setProfileData(profile);
            } else if (chunk.type === 'thought') {
              setThoughts((prev) => [...prev, { content: chunk.content, timestamp: Date.now() }]);
            } else if (chunk.type === 'text') {
              accumulated += chunk.content;
              setRawText(accumulated);
            } else if (chunk.type === 'status') {
              setStatus(chunk.content);
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }

      // Parse the accumulated JSON
      try {
        const cleaned = accumulated.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleaned) as WrappedData;
        setWrappedData(parsed);
      } catch {
        // If JSON parsing fails, try to extract what we can
        setWrappedData({
          codingPersonality: 'Code Artisan',
          contributionComparison: 'An active contributor to the open source community.',
          narrative: accumulated.length > 50 ? accumulated : 'Your year in code was productive and full of growth.',
          highlights: ['Keep building great things!'],
          industryBenchmarks: [],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setStreaming(false);
    }
  }, [username]);

  useEffect(() => {
    if (username) startStream();
  }, [username, startStream]);

  // Auto-scroll thoughts
  useEffect(() => {
    if (thoughtsRef.current) {
      thoughtsRef.current.scrollTop = thoughtsRef.current.scrollHeight;
    }
  }, [thoughts]);

  const nextSlide = () => setCurrentSlide((s) => Math.min(s + 1, TOTAL_SLIDES - 1));
  const prevSlide = () => setCurrentSlide((s) => Math.max(s - 1, 0));

  const slideVariants = {
    enter: { opacity: 0, scale: 0.95, y: 30 },
    center: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -30 },
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
        <Navigation />
        <div style={{ maxWidth: 500, margin: '0 auto', padding: '160px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: '#a1a1a1', marginBottom: 24 }}>{error}</p>
          <button
            onClick={startStream}
            style={{
              padding: '12px 24px',
              background: accent,
              color: '#050505',
              border: 'none',
              borderRadius: 10,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const ready = profileData !== null;

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa', overflow: 'hidden' }}>
      <Navigation />

      {/* Main slide area */}
      <div
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px 120px',
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.06) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />

        {/* Slide content */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 700, textAlign: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              {/* Slide 0: Intro */}
              {currentSlide === 0 && (
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color: accent,
                      fontWeight: 500,
                      marginBottom: 24,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    GitSkins Presents
                  </div>
                  {ready && profileData.avatarUrl && (
                    <img
                      src={profileData.avatarUrl}
                      alt={username}
                      style={{
                        width: 96,
                        height: 96,
                        borderRadius: '50%',
                        border: `3px solid ${accent}`,
                        marginBottom: 24,
                        boxShadow: `0 0 40px rgba(34, 197, 94, 0.2)`,
                      }}
                    />
                  )}
                  <h1
                    style={{
                      fontSize: 'clamp(32px, 6vw, 56px)',
                      fontWeight: 700,
                      margin: 0,
                      marginBottom: 8,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.1,
                    }}
                  >
                    Your 2025 in Code
                  </h1>
                  <p style={{ fontSize: 20, color: '#a1a1a1', margin: 0 }}>@{username}</p>
                </div>
              )}

              {/* Slide 1: Contributions */}
              {currentSlide === 1 && ready && (
                <div>
                  <div style={{ fontSize: 14, color: '#666', fontWeight: 500, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Contributions
                  </div>
                  <div style={{ fontSize: 'clamp(48px, 10vw, 80px)', fontWeight: 700, color: accent, letterSpacing: '-0.03em', lineHeight: 1 }}>
                    <AnimatedCounter target={profileData.totalContributions} />
                  </div>
                  <div style={{ fontSize: 16, color: '#a1a1a1', marginTop: 8 }}>contributions this year</div>
                  {wrappedData?.contributionComparison && (
                    <div
                      style={{
                        marginTop: 24,
                        padding: '12px 20px',
                        background: 'rgba(34, 197, 94, 0.08)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: 10,
                        fontSize: 14,
                        color: accentLight,
                        maxWidth: 400,
                      }}
                    >
                      {wrappedData.contributionComparison}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 32 }}>
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 700 }}>{profileData.totalStars.toLocaleString()}</div>
                      <div style={{ fontSize: 13, color: '#666' }}>Stars</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 700 }}>{profileData.totalRepos.toLocaleString()}</div>
                      <div style={{ fontSize: 13, color: '#666' }}>Repos</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 700 }}>{profileData.followers.toLocaleString()}</div>
                      <div style={{ fontSize: 13, color: '#666' }}>Followers</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Slide 2: Languages */}
              {currentSlide === 2 && ready && (
                <div style={{ width: '100%', maxWidth: 500 }}>
                  <div style={{ fontSize: 14, color: '#666', fontWeight: 500, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Top Languages
                  </div>
                  {profileData.languages.slice(0, 5).map((lang, i) => (
                    <motion.div
                      key={lang.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.4 }}
                      style={{ marginBottom: 16 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>
                          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: lang.color, marginRight: 8 }} />
                          {lang.name}
                        </span>
                        <span style={{ fontSize: 14, color: '#666' }}>{lang.percentage}%</span>
                      </div>
                      <div style={{ height: 8, background: '#1a1a1a', borderRadius: 4, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${lang.percentage}%` }}
                          transition={{ delay: i * 0.15 + 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                          style={{ height: '100%', background: lang.color, borderRadius: 4 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Slide 3: Top Projects */}
              {currentSlide === 3 && ready && (
                <div style={{ width: '100%', maxWidth: 500 }}>
                  <div style={{ fontSize: 14, color: '#666', fontWeight: 500, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Pinned Projects
                  </div>
                  {profileData.pinnedRepos.length === 0 ? (
                    <p style={{ color: '#666' }}>No pinned repositories found.</p>
                  ) : (
                    profileData.pinnedRepos.slice(0, 4).map((repo, i) => (
                      <motion.a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.12, duration: 0.4 }}
                        style={{
                          display: 'block',
                          padding: '14px 16px',
                          background: '#111',
                          border: '1px solid #1f1f1f',
                          borderRadius: 12,
                          marginBottom: 10,
                          textAlign: 'left',
                          textDecoration: 'none',
                          color: '#fafafa',
                          transition: 'border-color 0.2s ease',
                        }}
                        whileHover={{ borderColor: accent }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: 15 }}>{repo.name}</span>
                          <span style={{ fontSize: 13, color: accent }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: 4 }}>
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                            {repo.stars}
                          </span>
                        </div>
                        {repo.description && (
                          <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{repo.description}</div>
                        )}
                      </motion.a>
                    ))
                  )}
                </div>
              )}

              {/* Slide 4: Streak */}
              {currentSlide === 4 && ready && (
                <div>
                  <div style={{ fontSize: 14, color: '#666', fontWeight: 500, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Consistency
                  </div>
                  <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[
                      { value: profileData.streak.current, label: 'Current Streak', suffix: 'days' },
                      { value: profileData.streak.longest, label: 'Longest Streak', suffix: 'days' },
                      { value: profileData.streak.totalDays, label: 'Active Days', suffix: 'total' },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.15, duration: 0.4 }}
                        style={{ textAlign: 'center' }}
                      >
                        <div style={{ fontSize: 'clamp(36px, 6vw, 52px)', fontWeight: 700, color: accent, lineHeight: 1 }}>
                          <AnimatedCounter target={stat.value} duration={1500} />
                        </div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{stat.suffix}</div>
                        <div style={{ fontSize: 14, color: '#a1a1a1', marginTop: 8, fontWeight: 500 }}>{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Slide 5: Personality */}
              {currentSlide === 5 && (
                <div>
                  <div style={{ fontSize: 14, color: '#666', fontWeight: 500, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Your Developer Archetype
                  </div>
                  {wrappedData ? (
                    <>
                      <h2
                        className="gradient-text-animated"
                        style={{
                          fontSize: 'clamp(28px, 5vw, 44px)',
                          fontWeight: 700,
                          margin: 0,
                          marginBottom: 24,
                          letterSpacing: '-0.02em',
                          lineHeight: 1.2,
                        }}
                      >
                        {wrappedData.codingPersonality}
                      </h2>
                      {wrappedData.highlights && wrappedData.highlights.length > 0 && (
                        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'left' }}>
                          {wrappedData.highlights.slice(0, 4).map((h, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.12, duration: 0.4 }}
                              style={{
                                padding: '10px 14px',
                                background: '#111',
                                border: '1px solid #1f1f1f',
                                borderRadius: 10,
                                marginBottom: 8,
                                fontSize: 14,
                                color: '#a1a1a1',
                              }}
                            >
                              {h}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : streaming ? (
                    <div style={{ color: '#444' }}>
                      <div
                        className="animate-spin"
                        style={{ width: 32, height: 32, border: '3px solid #1f1f1f', borderTopColor: accent, borderRadius: '50%', margin: '0 auto 16px' }}
                      />
                      Analyzing your coding personality...
                    </div>
                  ) : (
                    <p style={{ color: '#666' }}>Could not determine personality.</p>
                  )}
                </div>
              )}

              {/* Slide 6: AI Narrative */}
              {currentSlide === 6 && (
                <div style={{ width: '100%', maxWidth: 600, textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: 14, color: '#666', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      AI Narrative
                    </div>
                    {thoughts.length > 0 && (
                      <button
                        onClick={() => setShowThoughts((v) => !v)}
                        style={{
                          padding: '4px 10px',
                          fontSize: 12,
                          background: showThoughts ? 'rgba(34, 197, 94, 0.15)' : '#161616',
                          border: '1px solid #2a2a2a',
                          borderRadius: 6,
                          color: showThoughts ? accent : '#a1a1a1',
                          cursor: 'pointer',
                        }}
                      >
                        {showThoughts ? 'Hide' : 'Show'} Thinking ({thoughts.length})
                      </button>
                    )}
                  </div>

                  {showThoughts && thoughts.length > 0 && (
                    <div
                      ref={thoughtsRef}
                      style={{
                        maxHeight: 200,
                        overflowY: 'auto',
                        marginBottom: 16,
                        padding: 12,
                        background: '#0a0a0a',
                        border: '1px solid #1f1f1f',
                        borderRadius: 10,
                        fontSize: 12,
                        fontFamily: 'var(--font-mono)',
                        color: '#666',
                        lineHeight: 1.6,
                      }}
                    >
                      {thoughts.map((t, i) => (
                        <div key={i} style={{ marginBottom: 8 }}>{t.content}</div>
                      ))}
                    </div>
                  )}

                  {wrappedData?.narrative ? (
                    <div style={{ fontSize: 15, lineHeight: 1.8, color: '#d4d4d4', whiteSpace: 'pre-wrap' }}>
                      {wrappedData.narrative}
                    </div>
                  ) : streaming ? (
                    <div style={{ color: '#444', textAlign: 'center', padding: 40 }}>
                      <div
                        className="animate-spin"
                        style={{ width: 32, height: 32, border: '3px solid #1f1f1f', borderTopColor: accent, borderRadius: '50%', margin: '0 auto 16px' }}
                      />
                      {status || 'Generating your narrative...'}
                    </div>
                  ) : (
                    <p style={{ color: '#666', textAlign: 'center' }}>Narrative could not be generated.</p>
                  )}

                  {/* Industry Benchmarks */}
                  {wrappedData?.industryBenchmarks && wrappedData.industryBenchmarks.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                      <div style={{ fontSize: 13, color: '#666', fontWeight: 500, marginBottom: 12 }}>
                        Industry Benchmarks (via Google Search)
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
                        {wrappedData.industryBenchmarks.map((b, i) => (
                          <div
                            key={i}
                            style={{
                              padding: '10px 12px',
                              background: '#111',
                              border: '1px solid #1f1f1f',
                              borderRadius: 10,
                              fontSize: 12,
                            }}
                          >
                            <div style={{ color: '#666', marginBottom: 4 }}>{b.metric}</div>
                            <div style={{ color: accent, fontWeight: 600, fontSize: 14 }}>{b.userValue}</div>
                            <div style={{ color: '#444', marginTop: 2 }}>Avg: {b.industryAvg}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Slide 7: Share */}
              {currentSlide === 7 && (
                <div>
                  <div style={{ fontSize: 14, color: '#666', fontWeight: 500, marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Share Your Wrapped
                  </div>
                  <h2
                    className="gradient-text-animated"
                    style={{
                      fontSize: 'clamp(24px, 4vw, 36px)',
                      fontWeight: 700,
                      margin: 0,
                      marginBottom: 16,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    That&apos;s a wrap!
                  </h2>
                  <p style={{ color: '#a1a1a1', fontSize: 16, marginBottom: 32, maxWidth: 400 }}>
                    Share your GitHub Wrapped with your network.
                  </p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <ShareMenu
                      shareUrl={shareUrl}
                      shareText={`Check out my GitHub Wrapped! ${shareUrl}`}
                      context={{ username, source: 'wrapped' }}
                    />
                    <a
                      href={`/showcase/${username}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '12px 24px',
                        background: '#161616',
                        border: '1px solid #2a2a2a',
                        borderRadius: 10,
                        color: '#fafafa',
                        fontWeight: 600,
                        fontSize: 14,
                        textDecoration: 'none',
                      }}
                    >
                      View Showcase
                    </a>
                  </div>
                  <div style={{ marginTop: 32, fontSize: 13, color: '#444' }}>
                    Generated with Gemini 3 Pro -- Extended Thinking + Google Search Grounding
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation controls */}
        {ready && (
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              zIndex: 2,
            }}
          >
            {/* Dot indicators */}
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  style={{
                    width: currentSlide === i ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: currentSlide === i ? accent : '#2a2a2a',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>

            {/* Arrow buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#161616',
                  border: '1px solid #2a2a2a',
                  color: currentSlide === 0 ? '#333' : '#fafafa',
                  cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  padding: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide === TOTAL_SLIDES - 1}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: currentSlide === TOTAL_SLIDES - 1 ? '#161616' : accent,
                  border: currentSlide === TOTAL_SLIDES - 1 ? '1px solid #2a2a2a' : 'none',
                  color: currentSlide === TOTAL_SLIDES - 1 ? '#333' : '#050505',
                  cursor: currentSlide === TOTAL_SLIDES - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  padding: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Loading state before profile arrives */}
        {!ready && !error && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <div
              className="animate-spin"
              style={{ width: 40, height: 40, border: '3px solid #2a2a2a', borderTopColor: accent, borderRadius: '50%' }}
            />
            <div style={{ color: '#666', fontSize: 14 }}>{status || 'Loading your Wrapped...'}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WrappedUserPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid #2a2a2a', borderTopColor: '#22c55e', borderRadius: '50%' }} />
        </div>
      }
    >
      <WrappedContent />
    </Suspense>
  );
}
