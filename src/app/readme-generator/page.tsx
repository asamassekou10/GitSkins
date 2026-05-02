'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { FREE_THEMES } from '@/config/subscription';
import { ThinkingProgress } from '@/components/ThinkingProgress';
import { useThinkingProgress } from '@/hooks/useThinkingProgress';
import { useUserPlan } from '@/hooks/useUserPlan';

type ReadmeStyle = 'minimal' | 'detailed' | 'creative';
type SectionType = 'header' | 'about' | 'skills' | 'stats' | 'projects' | 'streak' | 'connect';
type CareerRole = 'frontend' | 'backend' | 'fullstack' | 'data' | 'mobile' | 'devops' | 'product';
type ReadmeGoal = 'get-hired' | 'open-source' | 'freelance' | 'indie-hacker' | 'student' | 'founder' | 'personal-brand';
type ReadmeStructure = 'portfolio' | 'hiring' | 'open-source' | 'founder' | 'minimal' | 'visual' | 'technical';
type ReadmeTone = 'concise' | 'confident' | 'friendly' | 'senior' | 'founder' | 'playful' | 'recruiter';

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

const goalOptions: { id: ReadmeGoal; label: string; description: string }[] = [
  { id: 'get-hired', label: 'Get Hired', description: 'Recruiter-friendly proof and contact path' },
  { id: 'open-source', label: 'Open Source', description: 'Maintainer credibility and contributor clarity' },
  { id: 'freelance', label: 'Freelance', description: 'Services, outcomes, and conversion' },
  { id: 'indie-hacker', label: 'Indie Hacker', description: 'Products, launches, and builder momentum' },
  { id: 'student', label: 'Student', description: 'Learning velocity and project potential' },
  { id: 'founder', label: 'Founder', description: 'Product vision and technical ownership' },
  { id: 'personal-brand', label: 'Personal Brand', description: 'Memorable developer positioning' },
];

const structureOptions: { id: ReadmeStructure; label: string; description: string }[] = [
  { id: 'visual', label: 'Visual Kit', description: 'GitSkins card, widgets, and polished sections' },
  { id: 'portfolio', label: 'Portfolio', description: 'Featured work and clear project proof' },
  { id: 'hiring', label: 'Hiring', description: 'Fast scan for recruiters and teams' },
  { id: 'open-source', label: 'OSS', description: 'Community and contributor oriented' },
  { id: 'founder', label: 'Founder', description: 'Products, direction, and outcomes' },
  { id: 'minimal', label: 'Minimal', description: 'Short, clean, low-badge layout' },
  { id: 'technical', label: 'Technical', description: 'Systems, stack, and deeper proof' },
];

const toneOptions: { id: ReadmeTone; label: string }[] = [
  { id: 'confident', label: 'Confident' },
  { id: 'concise', label: 'Concise' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'senior', label: 'Senior' },
  { id: 'founder', label: 'Founder' },
  { id: 'playful', label: 'Playful' },
  { id: 'recruiter', label: 'Recruiter' },
];

const careerRoles: { id: CareerRole; label: string; description: string }[] = [
  { id: 'frontend', label: 'Frontend Engineer', description: 'UI/UX, performance, design systems' },
  { id: 'backend', label: 'Backend Engineer', description: 'APIs, scalability, data reliability' },
  { id: 'fullstack', label: 'Full-Stack Engineer', description: 'End-to-end delivery and ownership' },
  { id: 'data', label: 'Data/ML Engineer', description: 'Pipelines, analytics, ML systems' },
  { id: 'mobile', label: 'Mobile Engineer', description: 'iOS/Android and cross-platform' },
  { id: 'devops', label: 'DevOps/SRE', description: 'Infra, CI/CD, reliability' },
  { id: 'product', label: 'Product Engineer', description: 'Impact, experiments, growth' },
];

export default function ReadmeGeneratorPage() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('octocat');
  const [style, setStyle] = useState<ReadmeStyle>('detailed');
  const [theme, setTheme] = useState('satan');
  const [sections, setSections] = useState<SectionType[]>([
    'header', 'about', 'skills', 'stats', 'projects', 'connect',
  ]);
  const [careerMode, setCareerMode] = useState(true);
  const [careerRole, setCareerRole] = useState<CareerRole>('fullstack');
  const [agentLoop, setAgentLoop] = useState(true);
  const [useAI, setUseAI] = useState(true);
  const [goal, setGoal] = useState<ReadmeGoal>('get-hired');
  const [structure, setStructure] = useState<ReadmeStructure>('visual');
  const [tone, setTone] = useState<ReadmeTone>('confident');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedReadme, setGeneratedReadme] = useState<string | null>(null);
  const [aiProvider, setAiProvider] = useState<'gemini' | 'gemini_refined' | 'openai' | 'template' | null>(null);
  const [profileData, setProfileData] = useState<{
    name: string | null;
    avatarUrl: string;
    bio: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('preview');
  const [refinementNotes, setRefinementNotes] = useState<string[] | null>(null);
  const [agentReasoning, setAgentReasoning] = useState<string | null>(null);
  const [agentLogExpanded, setAgentLogExpanded] = useState(false);
  const [readmeScore, setReadmeScore] = useState<{
    overall: number;
    profileClarity: number;
    projectProof: number;
    visualConsistency: number;
    recruiterScanability: number;
    suggestions: string[];
  } | null>(null);
  const [strategy, setStrategy] = useState<{
    primaryRole: string;
    strongestSignals: string[];
    weakSignals: string[];
    suggestedTone: string;
    profileGoal: string;
  } | null>(null);

  const { plan: userPlan, readmeGenerationsUsed, readmeGenerationsLimit, readmeGenerationsRemaining, loading: planLoading, authenticated } = useUserPlan();
  const userIsPro = userPlan === 'pro';
  const usageAllowed = authenticated && (userIsPro || readmeGenerationsRemaining > 0);

  const readmeStepLabels = useMemo(
    () =>
      careerMode && agentLoop
        ? ['Fetching GitHub profile', 'Drafting README', `Refining for ${careerRole}`]
        : ['Fetching GitHub profile', 'Drafting README'],
    [careerMode, agentLoop, careerRole]
  );
  const readmeProgress = useThinkingProgress(readmeStepLabels, { intervalMs: 1200 });


  useEffect(() => {
    const careerParam = searchParams.get('careerMode');
    const roleParam = searchParams.get('role') as CareerRole | null;
    if (careerParam === '1') {
      setCareerMode(true);
      if (roleParam) {
        setCareerRole(roleParam);
      }
    }
  }, [searchParams]);

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
    if (!authenticated) {
      window.location.href = '/auth';
      return;
    }

    if (!username.trim()) {
      setError('Please enter a GitHub username');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedReadme(null);
    setAiProvider(null);
    setRefinementNotes(null);
    setAgentReasoning(null);
    setReadmeScore(null);
    setStrategy(null);
    readmeProgress.start();

    try {
      const response = await fetch('/api/generate-readme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          sections,
          style,
          theme,
          careerMode,
          careerRole,
          agentLoop,
          useAI,
          goal,
          structure,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate README');
      }

      setRefinementNotes(Array.isArray(data.refinementNotes) ? data.refinementNotes : null);
      setAgentReasoning(typeof data.reasoning === 'string' ? data.reasoning : null);
      setGeneratedReadme(data.readme);
      setAiProvider(data.aiProvider || null);
      setProfileData(data.profile);
      setReadmeScore(data.score ?? null);
      setStrategy(data.strategy ?? null);
      readmeProgress.complete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      readmeProgress.reset();
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, username, sections, style, theme, careerMode, careerRole, agentLoop, useAI, goal, structure, tone, readmeProgress.start, readmeProgress.complete, readmeProgress.reset]);

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
        background: '#050505',
        color: '#fafafa',
      }}
    >

      <main style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        {/* Hero Section */}
        <section
          style={{
            padding: '20px 24px 48px',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '100px',
                fontSize: '13px',
                color: '#22c55e',
                marginBottom: '24px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              AI profile writing studio
            </div>

            <h1
              style={{
                fontSize: 'clamp(38px, 6vw, 66px)',
                fontWeight: 900,
                margin: 0,
                marginBottom: '16px',
                letterSpacing: '-0.055em',
                lineHeight: 0.96,
              }}
            >
              Build a README that reads like a product story.
            </h1>

            <p
              style={{
                fontSize: '17px',
                color: '#a1a1a1',
                margin: '0 auto',
                maxWidth: '620px',
                lineHeight: 1.6,
              }}
            >
              Turn your repositories, skills, and profile signal into a polished GitHub README with themed cards, sections, and copy-ready Markdown.
            </p>
            <a
              href="/readme-agent"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '16px',
                padding: '8px 16px',
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: '8px',
                color: '#22c55e',
                fontSize: '13px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Open the Live README Agent
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </div>
        </section>

        {/* Usage Banner */}
        {!planLoading && (
          <section style={{ maxWidth: '1000px', margin: '0 auto 24px', padding: '0 20px' }}>
            <div
              style={{
                background: !authenticated ? 'rgba(34, 197, 94, 0.08)' : !usageAllowed ? 'rgba(239, 68, 68, 0.1)' : '#161616',
                border: `1px solid ${!authenticated ? 'rgba(34, 197, 94, 0.22)' : !usageAllowed ? 'rgba(239, 68, 68, 0.3)' : '#2a2a2a'}`,
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
                {!authenticated ? (
                  <span style={{ fontSize: '14px', color: '#aaa' }}>
                    Sign in to use your 5 free README generations.
                  </span>
                ) : userIsPro ? (
                  <span style={{ fontSize: '14px', color: '#888' }}>
                    Generations: <span style={{ color: '#22c55e', fontWeight: 600 }}>Unlimited</span>
                  </span>
                ) : (
                  <>
                    <span style={{ fontSize: '14px', color: '#888' }}>
                      Generations this month:{' '}
                      <span style={{ color: readmeGenerationsRemaining > 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                        {readmeGenerationsRemaining}/{readmeGenerationsLimit}
                      </span>
                    </span>
                    {/* Progress bar */}
                    <div style={{ width: '120px', height: '4px', background: '#2a2a2a', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${readmeGenerationsLimit > 0 ? Math.min(100, (readmeGenerationsUsed / readmeGenerationsLimit) * 100) : 0}%`,
                        background: readmeGenerationsRemaining > 0 ? '#22c55e' : '#ef4444',
                        borderRadius: '2px',
                        transition: 'width 0.3s',
                      }} />
                    </div>
                  </>
                )}
              </div>

              <span
                style={{
                  padding: '6px 12px',
                  background: userIsPro || !authenticated ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: userIsPro || !authenticated ? '#22c55e' : '#666',
                  fontWeight: 600,
                }}
              >
                {!authenticated ? 'Sign in required' : userIsPro ? 'Pro Plan' : 'Free Plan'}
              </span>
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
              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setUsername('octocat')}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '999px',
                    color: '#22c55e',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Use demo username
                </button>
              </div>
            </div>

            {/* Strategy Controls */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
                README Goal
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px' }}>
                {goalOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setGoal(option.id)}
                    style={{
                      padding: '12px 14px',
                      background: goal === option.id ? 'rgba(34, 197, 94, 0.15)' : '#0d0d0d',
                      border: `1px solid ${goal === option.id ? '#22c55e' : '#2a2a2a'}`,
                      borderRadius: '10px',
                      color: goal === option.id ? '#22c55e' : '#aaa',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {option.label}
                    <span style={{ display: 'block', marginTop: 5, color: '#666', fontSize: 11, fontWeight: 400, lineHeight: 1.35 }}>
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '12px' }}>
                Structure & Tone
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 14 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {structureOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setStructure(option.id)}
                      title={option.description}
                      style={{
                        padding: '9px 12px',
                        background: structure === option.id ? 'rgba(34, 197, 94, 0.15)' : '#0d0d0d',
                        border: `1px solid ${structure === option.id ? '#22c55e' : '#2a2a2a'}`,
                        borderRadius: '999px',
                        color: structure === option.id ? '#22c55e' : '#888',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {toneOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTone(option.id)}
                      style={{
                        padding: '9px 12px',
                        background: tone === option.id ? 'rgba(34, 197, 94, 0.15)' : '#0d0d0d',
                        border: `1px solid ${tone === option.id ? '#22c55e' : '#2a2a2a'}`,
                        borderRadius: '999px',
                        color: tone === option.id ? '#22c55e' : '#888',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
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

            {/* Career Mode */}
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
                Career Mode
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <button
                  onClick={() => setCareerMode(!careerMode)}
                  style={{
                    padding: '12px 20px',
                    background: careerMode ? 'rgba(34, 197, 94, 0.15)' : '#0d0d0d',
                    border: `1px solid ${careerMode ? '#22c55e' : '#2a2a2a'}`,
                    borderRadius: '10px',
                    color: careerMode ? '#22c55e' : '#888',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {careerMode ? 'Enabled' : 'Disabled'}
                </button>
                <button
                  onClick={() => setAgentLoop(!agentLoop)}
                  style={{
                    padding: '12px 20px',
                    background: agentLoop ? 'rgba(34, 197, 94, 0.15)' : '#0d0d0d',
                    border: `1px solid ${agentLoop ? '#22c55e' : '#2a2a2a'}`,
                    borderRadius: '10px',
                    color: agentLoop ? '#22c55e' : '#888',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {agentLoop ? 'Agent Refinement On' : 'Agent Refinement Off'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {careerRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setCareerRole(role.id)}
                    disabled={!careerMode}
                    style={{
                      padding: '10px 16px',
                      background: careerRole === role.id ? 'rgba(34, 197, 94, 0.15)' : '#0d0d0d',
                      border: `1px solid ${careerRole === role.id ? '#22c55e' : '#2a2a2a'}`,
                      borderRadius: '10px',
                      color: careerRole === role.id ? '#22c55e' : '#888',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: careerMode ? 'pointer' : 'not-allowed',
                      opacity: careerMode ? 1 : 0.6,
                    }}
                  >
                    {role.label}
                    <span style={{ display: 'block', fontSize: '11px', fontWeight: 400, color: '#666', marginTop: '4px' }}>
                      {role.description}
                    </span>
                  </button>
                ))}
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

            {isLoading && (
              <div style={{ marginBottom: '16px' }}>
                <ThinkingProgress
                  steps={readmeProgress.steps}
                  activeIndex={readmeProgress.activeIndex}
                  variant="card"
                />
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateReadme}
              disabled={isLoading || !username.trim() || (authenticated && !usageAllowed)}
              style={{
                width: '100%',
                padding: '16px 32px',
                background: isLoading ? '#1a5f35' : authenticated && !usageAllowed ? '#333' : '#22c55e',
                border: 'none',
                borderRadius: '12px',
                color: authenticated && !usageAllowed ? '#888' : '#000',
                fontSize: '16px',
                fontWeight: 700,
                cursor: isLoading || !username.trim() || (authenticated && !usageAllowed) ? 'not-allowed' : 'pointer',
                opacity: !username.trim() ? 0.5 : 1,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              {isLoading ? (
                <>Generating…</>
              ) : !authenticated ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Sign in for 5 free generations
                </>
              ) : !usageAllowed ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Limit Reached — Upgrade to Pro
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
              </div>
            )}
          </div>

          {/* Generated README Output */}
          {generatedReadme && (
            <div
              style={{
                background: '#111',
                borderRadius: '16px',
                border: '1px solid #1f1f1f',
                overflow: 'hidden',
              }}
            >
              {/* Output Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderBottom: '1px solid #1f1f1f',
                  background: '#0a0a0a',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* View Mode Toggle */}
                  <div
                    style={{
                      display: 'flex',
                      background: '#161616',
                      borderRadius: '8px',
                      padding: '4px',
                    }}
                  >
                    <button
                      onClick={() => setViewMode('preview')}
                      style={{
                        padding: '6px 14px',
                        background: viewMode === 'preview' ? '#22c55e' : 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        color: viewMode === 'preview' ? '#050505' : '#888',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setViewMode('code')}
                      style={{
                        padding: '6px 14px',
                        background: viewMode === 'code' ? '#22c55e' : 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        color: viewMode === 'code' ? '#050505' : '#888',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      Code
                    </button>
                  </div>
                  
                  <span style={{ color: '#666', fontSize: '13px' }}>README.md</span>
                  
                  {aiProvider && (
                    <span
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        borderRadius: '100px',
                        color: '#22c55e',
                        fontSize: '11px',
                        fontWeight: 500,
                      }}
                    >
                      {aiProvider === 'gemini_refined' ? 'AI refined' : aiProvider === 'gemini' ? 'AI generated' : aiProvider}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      padding: '8px 16px',
                      background: copied ? '#22c55e' : '#161616',
                      border: '1px solid #1f1f1f',
                      borderRadius: '8px',
                      color: copied ? '#050505' : '#fafafa',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadReadme}
                    style={{
                      padding: '8px 16px',
                      background: '#161616',
                      border: '1px solid #1f1f1f',
                      borderRadius: '8px',
                      color: '#fafafa',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>

              {/* Profile Agent focus (Career Mode reasoning) */}
              {agentReasoning && (
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #1f1f1f',
                    background: 'rgba(34, 197, 94, 0.06)',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#22c55e', marginBottom: '6px' }}>
                    Profile Agent focus
                  </div>
                  <p style={{ margin: 0, color: '#a1a1a1', fontSize: '13px', lineHeight: 1.5 }}>{agentReasoning}</p>
                </div>
              )}

              {/* Strategy and score */}
              {(strategy || readmeScore) && (
                <div style={{ padding: '18px 20px', borderBottom: '1px solid #1f1f1f', background: '#0d0d0d' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 14 }}>
                    {readmeScore && (
                      <div style={{ padding: 16, borderRadius: 14, background: '#151515', border: '1px solid #242424' }}>
                        <div style={{ color: '#777', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>README Score</div>
                        <div style={{ color: '#22c55e', fontSize: 42, lineHeight: 1, fontWeight: 900, letterSpacing: '-0.06em' }}>{readmeScore.overall}</div>
                        <div style={{ color: '#888', fontSize: 12, marginTop: 8 }}>
                          Clarity {readmeScore.profileClarity} · Proof {readmeScore.projectProof} · Visual {readmeScore.visualConsistency} · Scan {readmeScore.recruiterScanability}
                        </div>
                      </div>
                    )}
                    {strategy && (
                      <div style={{ padding: 16, borderRadius: 14, background: '#151515', border: '1px solid #242424' }}>
                        <div style={{ color: '#777', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Profile Strategy</div>
                        <div style={{ color: '#fff', fontSize: 15, fontWeight: 800, marginBottom: 8 }}>{strategy.primaryRole}</div>
                        <div style={{ color: '#999', fontSize: 13, lineHeight: 1.55 }}>{strategy.profileGoal}</div>
                      </div>
                    )}
                  </div>
                  {readmeScore?.suggestions?.length ? (
                    <ul style={{ margin: '14px 0 0', paddingLeft: 18, color: '#a1a1a1', fontSize: 13, lineHeight: 1.6 }}>
                      {readmeScore.suggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}
                    </ul>
                  ) : null}
                </div>
              )}

              {/* Agent refinements (when Career Mode + agent loop ran) */}
              {refinementNotes && refinementNotes.length > 0 && (
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #1f1f1f',
                    background: 'rgba(34, 197, 94, 0.06)',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#22c55e', marginBottom: '8px' }}>
                    Profile Agent applied {refinementNotes.length} improvement{refinementNotes.length !== 1 ? 's' : ''}:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#a1a1a1', fontSize: '13px', lineHeight: 1.6 }}>
                    {refinementNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Preview Mode */}
              {viewMode === 'preview' && (
                <div
                  className="markdown-preview"
                  style={{
                    padding: '32px',
                    background: '#0d1117',
                    maxHeight: '700px',
                    overflow: 'auto',
                  }}
                >
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: ({ children }) => (
                        <h1 style={{ fontSize: '28px', fontWeight: 700, borderBottom: '1px solid #21262d', paddingBottom: '12px', marginBottom: '16px', color: '#e6edf3' }}>
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 style={{ fontSize: '22px', fontWeight: 600, borderBottom: '1px solid #21262d', paddingBottom: '8px', marginTop: '24px', marginBottom: '16px', color: '#e6edf3' }}>
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginTop: '20px', marginBottom: '12px', color: '#e6edf3' }}>
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p style={{ marginBottom: '16px', lineHeight: 1.7, color: '#8b949e' }}>
                          {children}
                        </p>
                      ),
                      a: ({ href, children }) => (
                        <a href={href} style={{ color: '#58a6ff', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                      img: ({ src, alt }) => (
                        <img src={src} alt={alt || ''} style={{ maxWidth: '100%', borderRadius: '8px', margin: '8px 0' }} />
                      ),
                      ul: ({ children }) => (
                        <ul style={{ paddingLeft: '24px', marginBottom: '16px', color: '#8b949e' }}>
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol style={{ paddingLeft: '24px', marginBottom: '16px', color: '#8b949e' }}>
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li style={{ marginBottom: '6px', lineHeight: 1.6 }}>
                          {children}
                        </li>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code style={{ background: '#161b22', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', color: '#e6edf3' }}>
                            {children}
                          </code>
                        ) : (
                          <code style={{ display: 'block', background: '#161b22', padding: '16px', borderRadius: '8px', fontSize: '13px', overflow: 'auto', color: '#e6edf3' }}>
                            {children}
                          </code>
                        );
                      },
                      pre: ({ children }) => (
                        <pre style={{ background: '#161b22', padding: '16px', borderRadius: '8px', overflow: 'auto', marginBottom: '16px' }}>
                          {children}
                        </pre>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote style={{ borderLeft: '4px solid #3b434b', paddingLeft: '16px', margin: '16px 0', color: '#8b949e' }}>
                          {children}
                        </blockquote>
                      ),
                      hr: () => (
                        <hr style={{ border: 'none', borderTop: '1px solid #21262d', margin: '24px 0' }} />
                      ),
                      table: ({ children }) => (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
                          {children}
                        </table>
                      ),
                      th: ({ children }) => (
                        <th style={{ border: '1px solid #30363d', padding: '8px 12px', background: '#161b22', color: '#e6edf3', textAlign: 'left' }}>
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td style={{ border: '1px solid #30363d', padding: '8px 12px', color: '#8b949e' }}>
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {generatedReadme}
                  </ReactMarkdown>
                </div>
              )}

              {/* Code Mode */}
              {viewMode === 'code' && (
                <pre
                  style={{
                    margin: 0,
                    padding: '24px',
                    background: '#0a0a0a',
                    fontSize: '13px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    lineHeight: 1.6,
                    color: '#a1a1a1',
                    overflow: 'auto',
                    maxHeight: '700px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {generatedReadme}
                </pre>
              )}

              {/* Collapsible Agent log */}
              <div style={{ borderTop: '1px solid #1f1f1f' }}>
                <button
                  type="button"
                  onClick={() => setAgentLogExpanded(!agentLogExpanded)}
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    background: 'transparent',
                    border: 'none',
                    color: '#666',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                  }}
                >
                  Agent log
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: agentLogExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {agentLogExpanded && (
                  <div
                    style={{
                      padding: '12px 20px 16px',
                      background: '#0a0a0a',
                      fontSize: '13px',
                      color: '#a1a1a1',
                      lineHeight: 1.8,
                    }}
                  >
                    <div>1. Fetched GitHub profile.</div>
                    <div>2. Generated README draft.</div>
                    {aiProvider === 'gemini_refined' && refinementNotes && refinementNotes.length > 0 && (
                      <>
                        <div>3. Critiqued for {careerRole}.</div>
                        <div>4. Refined README.</div>
                      </>
                    )}
                    {aiProvider !== 'gemini_refined' && <div>3. Done.</div>}
                  </div>
                )}
              </div>
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
