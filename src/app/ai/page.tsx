'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/landing/Navigation';
import { AuroraBackground } from '@/components/landing/AuroraBackground';

interface ProfileAnalysis {
  developerType: string;
  personality: string;
  strengths: string[];
  codingStyle: string;
  collaborationLevel: string;
  recommendedTheme: string;
  themeReason: string;
  careerInsight: string;
  funFact: string;
}

interface ThemeRecommendation {
  theme: string;
  score: number;
  reason: string;
}

interface ProfileIntel {
  summary: string;
  benchmarks: Array<{
    label: string;
    value: string;
    context: string;
  }>;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

interface PortfolioCaseStudy {
  title: string;
  repo: string;
  problem: string;
  approach: string;
  impact: string;
  stack: string[];
  highlights: string[];
  repoUrl?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIFeaturesPage() {
  const [username, setUsername] = useState('octocat');
  const [activeTab, setActiveTab] = useState<'analyze' | 'themes' | 'intel' | 'portfolio' | 'chat'>('analyze');

  // Analysis state
  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Theme recommendations state
  const [recommendations, setRecommendations] = useState<ThemeRecommendation[]>([]);
  const [loadingThemes, setLoadingThemes] = useState(false);

  // Profile intelligence state
  const [profileIntel, setProfileIntel] = useState<ProfileIntel | null>(null);
  const [loadingIntel, setLoadingIntel] = useState(false);

  // Portfolio state
  const [portfolio, setPortfolio] = useState<PortfolioCaseStudy[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m GitSkins AI Assistant powered by Google Gemini. I can help you customize your GitHub profile widgets, recommend themes, and answer questions about GitSkins features. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Error state
  const [error, setError] = useState('');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleAnalyze = async (overrideUsername?: string) => {
    const targetUsername = (overrideUsername ?? username).trim();
    if (!targetUsername) {
      setError('Please enter a GitHub username');
      return;
    }

    setError('');
    setAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: targetUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze profile');
      }

      setAnalysis(data.analysis);
      setProfileData(data.profile);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze profile');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGetThemes = async (overrideUsername?: string) => {
    const targetUsername = (overrideUsername ?? username).trim();
    if (!targetUsername) {
      setError('Please enter a GitHub username');
      return;
    }

    setError('');
    setLoadingThemes(true);
    setRecommendations([]);

    try {
      const response = await fetch('/api/ai/recommend-themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: targetUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      setRecommendations(data.recommendations);
      setProfileData(data.profile);
    } catch (err: any) {
      setError(err.message || 'Failed to get theme recommendations');
    } finally {
      setLoadingThemes(false);
    }
  };

  const handleGetIntel = async (overrideUsername?: string) => {
    const targetUsername = (overrideUsername ?? username).trim();
    if (!targetUsername) {
      setError('Please enter a GitHub username');
      return;
    }

    setError('');
    setLoadingIntel(true);
    setProfileIntel(null);

    try {
      const response = await fetch('/api/ai/profile-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: targetUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get profile intelligence');
      }

      setProfileIntel(data.intel);
      setProfileData(data.profile);
    } catch (err: any) {
      setError(err.message || 'Failed to get profile intelligence');
    } finally {
      setLoadingIntel(false);
    }
  };

  const handleGetPortfolio = async (overrideUsername?: string) => {
    const targetUsername = (overrideUsername ?? username).trim();
    if (!targetUsername) {
      setError('Please enter a GitHub username');
      return;
    }

    setError('');
    setLoadingPortfolio(true);
    setPortfolio([]);

    try {
      const response = await fetch('/api/ai/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: targetUsername }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to build portfolio');
      }

      setPortfolio(data.caseStudies || []);
      setProfileData(data.profile);
    } catch (err: any) {
      setError(err.message || 'Failed to build portfolio');
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const runDemo = () => {
    const demoUsername = 'octocat';
    setUsername(demoUsername);
    if (activeTab === 'analyze') {
      void handleAnalyze(demoUsername);
    } else if (activeTab === 'themes') {
      void handleGetThemes(demoUsername);
    } else if (activeTab === 'intel') {
      void handleGetIntel(demoUsername);
    } else if (activeTab === 'portfolio') {
      void handleGetPortfolio(demoUsername);
    }
  };

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          context: {
            username: username || undefined,
            profileData: profileData || undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  const themeColors: Record<string, string> = {
    satan: '#dc2626',
    neon: '#22d3ee',
    zen: '#a3a3a3',
    'github-dark': '#238636',
    dracula: '#bd93f9',
    ocean: '#0ea5e9',
    forest: '#22c55e',
    sunset: '#f97316',
    midnight: '#3b82f6',
    aurora: '#a855f7',
    retro: '#f472b6',
    minimal: '#737373',
    pastel: '#fda4af',
    matrix: '#22c55e',
    winter: '#7dd3fc',
    spring: '#86efac',
    summer: '#fcd34d',
    autumn: '#ea580c',
    christmas: '#dc2626',
    halloween: '#f97316',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
        color: '#e5e5e5',
      }}
    >
      <Navigation />
      <AuroraBackground />

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '100px 20px 60px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '24px',
              marginBottom: '16px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 500 }}>Powered by Google Gemini</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #fff 0%, #22c55e 50%, #4ade80 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '16px',
            }}
          >
            AI-Powered Features
          </h1>
          <p style={{ color: '#888', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Discover your coding personality, get personalized theme recommendations, and chat with our AI assistant.
          </p>
        </div>

        {/* Username Input */}
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto 32px',
            display: 'flex',
            gap: '12px',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              padding: '12px 16px',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '16px',
              }}
              onKeyPress={(e) => {
                if (e.key !== 'Enter') return;
                if (activeTab === 'analyze') {
                  void handleAnalyze();
                } else if (activeTab === 'themes') {
                  void handleGetThemes();
                } else if (activeTab === 'intel') {
                  void handleGetIntel();
                } else if (activeTab === 'portfolio') {
                  void handleGetPortfolio();
                }
              }}
            />
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={runDemo}
            style={{
              padding: '8px 16px',
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '999px',
              color: '#22c55e',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Run demo with octocat
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '32px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'analyze', label: 'Profile Analysis', icon: '🧠' },
            { id: 'themes', label: 'Theme Recommendations', icon: '🎨' },
            { id: 'intel', label: 'Profile Intelligence', icon: '📈' },
            { id: 'portfolio', label: 'Portfolio Builder', icon: '🗂️' },
            { id: 'chat', label: 'AI Assistant', icon: '💬' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 24px',
                background: activeTab === tab.id ? '#22c55e' : '#161616',
                border: activeTab === tab.id ? 'none' : '1px solid #2a2a2a',
                borderRadius: '12px',
                color: activeTab === tab.id ? '#000' : '#888',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Error Display */}
        {error && (
          <div
            style={{
              maxWidth: '600px',
              margin: '0 auto 24px',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {/* Profile Analysis Tab */}
        {activeTab === 'analyze' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button
              onClick={() => handleAnalyze()}
              disabled={analyzing || !username.trim()}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '300px',
                margin: '0 auto 32px',
                padding: '14px 28px',
                background: analyzing ? '#1a1a1a' : '#22c55e',
                border: 'none',
                borderRadius: '12px',
                color: analyzing ? '#888' : '#000',
                fontSize: '16px',
                fontWeight: 600,
                cursor: analyzing ? 'not-allowed' : 'pointer',
              }}
            >
              {analyzing ? 'Analyzing with Gemini...' : 'Analyze Profile'}
            </button>

            {analysis && profileData && (
              <div
                style={{
                  background: '#161616',
                  border: '1px solid #2a2a2a',
                  borderRadius: '20px',
                  padding: '32px',
                }}
              >
                {/* Profile Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
                  <img
                    src={profileData.avatarUrl}
                    alt={profileData.name}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #22c55e' }}
                  />
                  <div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#fff' }}>
                      {profileData.name || username}
                    </h2>
                    <p style={{ margin: '4px 0 0', color: '#22c55e', fontSize: '18px', fontWeight: 600 }}>
                      {analysis.developerType}
                    </p>
                  </div>
                </div>

                {/* Personality */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Personality
                  </h3>
                  <p style={{ color: '#e5e5e5', lineHeight: 1.6 }}>{analysis.personality}</p>
                </div>

                {/* Stats Grid */}
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

                {/* Strengths */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                    Key Strengths
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {analysis.strengths.map((strength, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '6px 14px',
                          background: 'rgba(34, 197, 94, 0.15)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '20px',
                          color: '#22c55e',
                          fontSize: '14px',
                        }}
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Theme */}
                <div
                  style={{
                    background: `linear-gradient(135deg, ${themeColors[analysis.recommendedTheme] || '#22c55e'}20, transparent)`,
                    border: `1px solid ${themeColors[analysis.recommendedTheme] || '#22c55e'}40`,
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <h3 style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    Recommended Theme
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: themeColors[analysis.recommendedTheme] || '#22c55e',
                      }}
                    />
                    <span style={{ color: '#fff', fontSize: '20px', fontWeight: 600, textTransform: 'capitalize' }}>
                      {analysis.recommendedTheme}
                    </span>
                  </div>
                  <p style={{ color: '#a3a3a3', margin: 0 }}>{analysis.themeReason}</p>
                </div>

                {/* Fun Fact */}
                <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px' }}>
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>💡</span>
                  <span style={{ color: '#e5e5e5' }}>{analysis.funFact}</span>
                </div>

                {/* CTA */}
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <Link
                    href={`/showcase/${username}?theme=${analysis.recommendedTheme}`}
                    style={{
                      display: 'inline-block',
                      padding: '12px 24px',
                      background: '#22c55e',
                      borderRadius: '10px',
                      color: '#000',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    View Widgets with {analysis.recommendedTheme} Theme
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Theme Recommendations Tab */}
        {activeTab === 'themes' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button
              onClick={() => handleGetThemes()}
              disabled={loadingThemes || !username.trim()}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '300px',
                margin: '0 auto 32px',
                padding: '14px 28px',
                background: loadingThemes ? '#1a1a1a' : '#22c55e',
                border: 'none',
                borderRadius: '12px',
                color: loadingThemes ? '#888' : '#000',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loadingThemes ? 'not-allowed' : 'pointer',
              }}
            >
              {loadingThemes ? 'Getting Recommendations...' : 'Get Theme Recommendations'}
            </button>

            {recommendations.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recommendations.map((rec, index) => (
                  <div
                    key={rec.theme}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      background: '#161616',
                      border: '1px solid #2a2a2a',
                      borderRadius: '16px',
                      padding: '20px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: themeColors[rec.theme] || '#22c55e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#000',
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#fff', fontSize: '18px', fontWeight: 600, textTransform: 'capitalize' }}>
                          {rec.theme}
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            background: 'rgba(34, 197, 94, 0.2)',
                            borderRadius: '10px',
                            color: '#22c55e',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          {rec.score}% match
                        </span>
                      </div>
                      <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>{rec.reason}</p>
                    </div>
                    <Link
                      href={`/showcase/${username}?theme=${rec.theme}`}
                      style={{
                        padding: '10px 16px',
                        background: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                        borderRadius: '8px',
                        color: '#888',
                        fontSize: '13px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Preview
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Intelligence Tab */}
        {activeTab === 'intel' && (
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <button
              onClick={() => handleGetIntel()}
              disabled={loadingIntel || !username.trim()}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '320px',
                margin: '0 auto 32px',
                padding: '14px 28px',
                background: loadingIntel ? '#1a1a1a' : '#22c55e',
                border: 'none',
                borderRadius: '12px',
                color: loadingIntel ? '#888' : '#000',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loadingIntel ? 'not-allowed' : 'pointer',
              }}
            >
              {loadingIntel ? 'Building Intelligence...' : 'Run Profile Intelligence'}
            </button>

            {profileIntel && (
              <div
                style={{
                  background: '#161616',
                  border: '1px solid #2a2a2a',
                  borderRadius: '20px',
                  padding: '28px',
                }}
              >
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>
                  Profile Intelligence Summary
                </h3>
                <p style={{ color: '#cfcfcf', lineHeight: 1.6, marginBottom: '24px' }}>{profileIntel.summary}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  {profileIntel.benchmarks.map((benchmark, index) => (
                    <div key={`${benchmark.label}-${index}`} style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ color: '#888', fontSize: '12px', marginBottom: '6px' }}>{benchmark.label}</div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>{benchmark.value}</div>
                      <div style={{ color: '#666', fontSize: '12px', marginTop: '6px' }}>{benchmark.context}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ color: '#22c55e', fontWeight: 600, marginBottom: '8px' }}>Strengths</div>
                    <ul style={{ color: '#cfcfcf', paddingLeft: '18px', margin: 0 }}>
                      {profileIntel.strengths.map((item, index) => (
                        <li key={`strength-${index}`} style={{ marginBottom: '6px' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ color: '#fbbf24', fontWeight: 600, marginBottom: '8px' }}>Gaps to Close</div>
                    <ul style={{ color: '#cfcfcf', paddingLeft: '18px', margin: 0 }}>
                      {profileIntel.gaps.map((item, index) => (
                        <li key={`gap-${index}`} style={{ marginBottom: '6px' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ color: '#60a5fa', fontWeight: 600, marginBottom: '8px' }}>Next Actions</div>
                    <ul style={{ color: '#cfcfcf', paddingLeft: '18px', margin: 0 }}>
                      {profileIntel.recommendations.map((item, index) => (
                        <li key={`rec-${index}`} style={{ marginBottom: '6px' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Portfolio Builder Tab */}
        {activeTab === 'portfolio' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <button
              onClick={() => handleGetPortfolio()}
              disabled={loadingPortfolio || !username.trim()}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: '320px',
                margin: '0 auto 32px',
                padding: '14px 28px',
                background: loadingPortfolio ? '#1a1a1a' : '#22c55e',
                border: 'none',
                borderRadius: '12px',
                color: loadingPortfolio ? '#888' : '#000',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loadingPortfolio ? 'not-allowed' : 'pointer',
              }}
            >
              {loadingPortfolio ? 'Generating Portfolio...' : 'Generate Portfolio'}
            </button>

            {portfolio.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {portfolio.map((caseStudy, index) => (
                  <div key={`${caseStudy.repo}-${index}`} style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: '18px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ color: '#fff', fontSize: '20px', fontWeight: 700 }}>{caseStudy.title}</div>
                        <div style={{ color: '#888', fontSize: '14px' }}>{caseStudy.repo}</div>
                      </div>
                      {caseStudy.repoUrl && (
                        <Link
                          href={caseStudy.repoUrl}
                          style={{
                            padding: '8px 14px',
                            background: '#1a1a1a',
                            border: '1px solid #2a2a2a',
                            borderRadius: '8px',
                            color: '#888',
                            textDecoration: 'none',
                            fontSize: '13px',
                          }}
                        >
                          View Repo
                        </Link>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '16px' }}>
                      <div>
                        <div style={{ color: '#22c55e', fontWeight: 600, marginBottom: '6px' }}>Problem</div>
                        <p style={{ color: '#cfcfcf', margin: 0 }}>{caseStudy.problem}</p>
                      </div>
                      <div>
                        <div style={{ color: '#60a5fa', fontWeight: 600, marginBottom: '6px' }}>Approach</div>
                        <p style={{ color: '#cfcfcf', margin: 0 }}>{caseStudy.approach}</p>
                      </div>
                      <div>
                        <div style={{ color: '#fbbf24', fontWeight: 600, marginBottom: '6px' }}>Impact</div>
                        <p style={{ color: '#cfcfcf', margin: 0 }}>{caseStudy.impact}</p>
                      </div>
                    </div>
                    <div style={{ marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {caseStudy.stack.map((tech) => (
                        <span key={`${caseStudy.repo}-${tech}`} style={{ padding: '4px 10px', background: '#1a1a1a', borderRadius: '999px', fontSize: '12px', color: '#888' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    <ul style={{ marginTop: '12px', color: '#cfcfcf', paddingLeft: '18px' }}>
                      {caseStudy.highlights.map((highlight, idx) => (
                        <li key={`${caseStudy.repo}-h-${idx}`} style={{ marginBottom: '6px' }}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Chat Tab */}
        {activeTab === 'chat' && (
          <div
            style={{
              maxWidth: '700px',
              margin: '0 auto',
              background: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '20px',
              overflow: 'hidden',
            }}
          >
            {/* Chat Messages */}
            <div
              style={{
                height: '400px',
                overflowY: 'auto',
                padding: '20px',
              }}
            >
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '12px 16px',
                      background: msg.role === 'user' ? '#22c55e' : '#1a1a1a',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      color: msg.role === 'user' ? '#000' : '#e5e5e5',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                  <div
                    style={{
                      padding: '12px 16px',
                      background: '#1a1a1a',
                      borderRadius: '16px 16px 16px 4px',
                      color: '#888',
                    }}
                  >
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div
              style={{
                padding: '16px 20px',
                borderTop: '1px solid #2a2a2a',
                display: 'flex',
                gap: '12px',
              }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything about GitSkins..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '15px',
                  outline: 'none',
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
              />
              <button
                onClick={handleSendChat}
                disabled={chatLoading || !chatInput.trim()}
                style={{
                  padding: '12px 20px',
                  background: chatLoading || !chatInput.trim() ? '#1a1a1a' : '#22c55e',
                  border: 'none',
                  borderRadius: '12px',
                  color: chatLoading || !chatInput.trim() ? '#888' : '#000',
                  fontWeight: 600,
                  cursor: chatLoading || !chatInput.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Powered by Gemini Footer */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            AI features powered by{' '}
            <span style={{ color: '#22c55e', fontWeight: 600 }}>Google Gemini</span>
          </p>
        </div>
      </div>
    </div>
  );
}
