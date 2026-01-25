'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/landing/Navigation';
import { AuroraBackground } from '@/components/landing/AuroraBackground';
import {
  checkGenerationAllowed,
  incrementGenerationUsage,
  formatResetDate,
  getDaysUntilReset,
  isPro,
} from '@/lib/usage-tracker';
import { FREE_THEMES } from '@/config/subscription';
import type { GenerationCheckResult } from '@/types/subscription';

type ReadmeStyle = 'minimal' | 'detailed' | 'creative';
type SectionType = 'header' | 'about' | 'skills' | 'stats' | 'projects' | 'streak' | 'connect';

const themes = [
  { id: 'satan', name: 'Satan', color: '#ff4500', free: true },
  { id: 'neon', name: 'Neon', color: '#00ffff', free: false },
  { id: 'zen', name: 'Zen', color: '#00ff88', free: true },
  { id: 'github-dark', name: 'GitHub', color: '#238636', free: true },
  { id: 'dracula', name: 'Dracula', color: '#ff79c6', free: false },
];

const availableSections: { id: SectionType; label: string; description: string }[] = [
  { id: 'header', label: 'Header', description: 'Intro with name and avatar' },
  { id: 'about', label: 'About Me', description: 'Bio and personal info' },
  { id: 'skills', label: 'Skills', description: 'Languages & tech badges' },
  { id: 'stats', label: 'GitHub Stats', description: 'GitSkins stat widgets' },
  { id: 'streak', label: 'Streak', description: 'Contribution streak widget' },
  { id: 'projects', label: 'Projects', description: 'Pinned repositories' },
  { id: 'connect', label: 'Connect', description: 'Social links & contact' },
];

const styleOptions: { id: ReadmeStyle; label: string; description: string }[] = [
  { id: 'minimal', label: 'Minimal', description: 'Clean and simple' },
  { id: 'detailed', label: 'Detailed', description: 'Professional & comprehensive' },
  { id: 'creative', label: 'Creative', description: 'Fun with animations' },
];

export default function ReadmeGeneratorPage() {
  const [username, setUsername] = useState('');
  const [style, setStyle] = useState<ReadmeStyle>('detailed');
  const [theme, setTheme] = useState('satan');
  const [sections, setSections] = useState<SectionType[]>([
    'header', 'about', 'skills', 'stats', 'projects', 'connect',
  ]);
  const [useAI, setUseAI] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedReadme, setGeneratedReadme] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<{
    name: string | null;
    avatarUrl: string;
    bio: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Usage tracking
  const [usageInfo, setUsageInfo] = useState<GenerationCheckResult | null>(null);
  const [userIsPro, setUserIsPro] = useState(false);

  useEffect(() => {
    // Load usage info on mount
    const info = checkGenerationAllowed();
    setUsageInfo(info);
    setUserIsPro(isPro());
  }, []);

  const refreshUsageInfo = () => {
    const info = checkGenerationAllowed();
    setUsageInfo(info);
  };

  const toggleSection = (sectionId: SectionType) => {
    setSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((s) => s !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isThemeLocked = (themeId: string): boolean => {
    if (userIsPro) return false;
    return !FREE_THEMES.includes(themeId as typeof FREE_THEMES[number]);
  };

  const generateReadme = useCallback(async () => {
    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    // Check usage limits
    const currentUsage = checkGenerationAllowed();
    if (!currentUsage.allowed) {
      setError(`You've used all ${currentUsage.limit} generations this month. Upgrade to Pro or wait until ${formatResetDate(currentUsage.resetDate)}.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedReadme(null);

    try {
      const response = await fetch('/api/generate-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          sections,
          style,
          theme,
          useAI,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate README');
      }

      // Increment usage on successful generation
      incrementGenerationUsage();
      refreshUsageInfo();

      setGeneratedReadme(data.readme);
      setProfileData(data.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [username, sections, style, theme, useAI]);

  const copyToClipboard = async () => {
    if (!generatedReadme) return;

    try {
      await navigator.clipboard.writeText(generatedReadme);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = generatedReadme;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadReadme = () => {
    if (!generatedReadme) return;

    const blob = new Blob([generatedReadme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <Navigation />

      <main style={{ paddingTop: '100px', paddingBottom: '80px' }}>
        {/* Hero Section */}
        <section
          style={{
            position: 'relative',
            padding: '40px 20px 60px',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <AuroraBackground intensity="medium" position="top" />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '6px 16px',
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '20px',
                fontSize: '13px',
                color: '#22c55e',
                marginBottom: '24px',
              }}
            >
              AI-Powered
            </div>

            <h1
              style={{
                fontSize: 'clamp(32px, 6vw, 52px)',
                fontWeight: 800,
                margin: 0,
                marginBottom: '16px',
                letterSpacing: '-1px',
              }}
            >
              README{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Generator
              </span>
            </h1>

            <p
              style={{
                fontSize: '18px',
                color: '#888',
                margin: '0 auto',
                maxWidth: '500px',
                lineHeight: 1.6,
              }}
            >
              Create a stunning GitHub profile README in seconds with AI assistance.
            </p>
          </div>
        </section>

        {/* Usage Banner */}
        {usageInfo && (
          <section style={{ maxWidth: '1000px', margin: '0 auto 24px', padding: '0 20px' }}>
            <div
              style={{
                background: usageInfo.remaining === 0 ? 'rgba(239, 68, 68, 0.1)' : '#161616',
                border: `1px solid ${usageInfo.remaining === 0 ? 'rgba(239, 68, 68, 0.3)' : '#2a2a2a'}`,
                borderRadius: '12px',
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', color: '#888' }}>
                  Generations:{' '}
                  <span
                    style={{
                      color: usageInfo.remaining > 0 ? '#22c55e' : '#ef4444',
                      fontWeight: 600,
                    }}
                  >
                    {usageInfo.remaining}/{usageInfo.limit}
                  </span>
                </span>
                <span style={{ fontSize: '13px', color: '#666' }}>
                  Resets {formatResetDate(usageInfo.resetDate)} ({getDaysUntilReset(usageInfo.resetDate)} days)
                </span>
              </div>

              {!userIsPro && (
                <Link
                  href="/pricing"
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: '#22c55e',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Upgrade to Pro - 10/month
                </Link>
              )}

              {userIsPro && (
                <span
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#22c55e',
                    fontWeight: 600,
                  }}
                >
                  Pro Plan
                </span>
              )}
            </div>
          </section>
        )}

        {/* Generator Form */}
        <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              background: '#161616',
              borderRadius: '20px',
              border: '1px solid #2a2a2a',
              padding: '32px',
              marginBottom: '32px',
            }}
          >
            {/* Username Input */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '12px',
                }}
              >
                GitHub Username
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="octocat"
                  onKeyDown={(e) => e.key === 'Enter' && generateReadme()}
                  style={{
                    flex: 1,
                    padding: '14px 20px',
                    background: '#0d0d0d',
                    border: '1px solid #2a2a2a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                  }}
                />
                {profileData && (
                  <img
                    src={profileData.avatarUrl}
                    alt={profileData.name || username}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      border: '2px solid #22c55e',
                    }}
                  />
                )}
              </div>
            </div>

            {/* Style Selection */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '12px',
                }}
              >
                Style
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {styleOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setStyle(option.id)}
                    style={{
                      padding: '12px 20px',
                      background: style === option.id ? 'rgba(34, 197, 94, 0.15)' : '#0d0d0d',
                      border: `1px solid ${style === option.id ? '#22c55e' : '#2a2a2a'}`,
                      borderRadius: '10px',
                      color: style === option.id ? '#22c55e' : '#888',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {option.label}
                    <span
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 400,
                        color: '#666',
                        marginTop: '4px',
                      }}
                    >
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '12px',
                }}
              >
                Widget Theme
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {themes.map((t) => {
                  const locked = isThemeLocked(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => !locked && setTheme(t.id)}
                      disabled={locked}
                      style={{
                        padding: '10px 18px',
                        background: theme === t.id ? `${t.color}20` : '#0d0d0d',
                        border: `1px solid ${theme === t.id ? t.color : '#2a2a2a'}`,
                        borderRadius: '8px',
                        color: locked ? '#555' : theme === t.id ? t.color : '#888',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: locked ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: locked ? 0.6 : 1,
                        position: 'relative',
                      }}
                    >
                      {t.name}
                      {locked && (
                        <span
                          style={{
                            marginLeft: '6px',
                            fontSize: '10px',
                            background: '#333',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          PRO
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sections Selection */}
            <div style={{ marginBottom: '32px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '12px',
                }}
              >
                Sections to Include
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '10px',
                }}
              >
                {availableSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    style={{
                      padding: '12px 16px',
                      background: sections.includes(section.id)
                        ? 'rgba(34, 197, 94, 0.1)'
                        : '#0d0d0d',
                      border: `1px solid ${sections.includes(section.id) ? '#22c55e' : '#2a2a2a'}`,
                      borderRadius: '10px',
                      color: sections.includes(section.id) ? '#fff' : '#888',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          background: sections.includes(section.id) ? '#22c55e' : 'transparent',
                          border: `2px solid ${sections.includes(section.id) ? '#22c55e' : '#444'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          color: '#000',
                        }}
                      >
                        {sections.includes(section.id) && '✓'}
                      </span>
                      {section.label}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        color: '#666',
                        marginTop: '4px',
                        marginLeft: '26px',
                      }}
                    >
                      {section.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Toggle */}
            <div style={{ marginBottom: '32px' }}>
              <button
                onClick={() => setUseAI(!useAI)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 20px',
                  background: useAI ? 'rgba(34, 197, 94, 0.1)' : '#0d0d0d',
                  border: `1px solid ${useAI ? '#22c55e' : '#2a2a2a'}`,
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span
                  style={{
                    width: '40px',
                    height: '22px',
                    borderRadius: '11px',
                    background: useAI ? '#22c55e' : '#444',
                    position: 'relative',
                    transition: 'background 0.2s',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '3px',
                      left: useAI ? '21px' : '3px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#fff',
                      transition: 'left 0.2s',
                    }}
                  />
                </span>
                <span>
                  Use AI Enhancement
                  <span style={{ color: '#666', marginLeft: '8px', fontSize: '12px' }}>
                    (Generates more personalized content)
                  </span>
                </span>
              </button>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateReadme}
              disabled={isLoading || !username.trim() || (usageInfo !== null && !usageInfo.allowed)}
              style={{
                width: '100%',
                padding: '16px 32px',
                background: isLoading ? '#1a5f35' : usageInfo && !usageInfo.allowed ? '#333' : '#22c55e',
                border: 'none',
                borderRadius: '12px',
                color: usageInfo && !usageInfo.allowed ? '#888' : '#000',
                fontSize: '16px',
                fontWeight: 700,
                cursor: isLoading || !username.trim() || (usageInfo && !usageInfo.allowed) ? 'not-allowed' : 'pointer',
                opacity: !username.trim() ? 0.5 : 1,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              {isLoading ? (
                <>
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #000',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  Generating...
                </>
              ) : usageInfo && !usageInfo.allowed ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Limit Reached - Upgrade to Pro
                </>
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Generate README
                </>
              )}
            </button>

            {error && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '14px',
                }}
              >
                {error}
                {error.includes('Upgrade') && (
                  <Link
                    href="/pricing"
                    style={{
                      display: 'inline-block',
                      marginLeft: '8px',
                      color: '#22c55e',
                      textDecoration: 'underline',
                    }}
                  >
                    View Plans
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Generated README Output */}
          {generatedReadme && (
            <div
              style={{
                background: '#161616',
                borderRadius: '20px',
                border: '1px solid #2a2a2a',
                overflow: 'hidden',
              }}
            >
              {/* Output Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 24px',
                  borderBottom: '1px solid #2a2a2a',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27ca40' }} />
                  </div>
                  <span style={{ color: '#888', fontSize: '14px' }}>README.md</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      padding: '8px 16px',
                      background: copied ? '#22c55e' : '#0d0d0d',
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px',
                      color: copied ? '#000' : '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadReadme}
                    style={{
                      padding: '8px 16px',
                      background: '#0d0d0d',
                      border: '1px solid #2a2a2a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Markdown Content */}
              <pre
                style={{
                  margin: 0,
                  padding: '24px',
                  background: '#0d0d0d',
                  fontSize: '14px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  lineHeight: 1.6,
                  color: '#ccc',
                  overflow: 'auto',
                  maxHeight: '600px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {generatedReadme}
              </pre>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '40px 20px',
          borderTop: '1px solid #1a1a1a',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#444', fontSize: '14px', margin: 0 }}>
          GitSkins - Beautiful GitHub README Widgets
        </p>
      </footer>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
