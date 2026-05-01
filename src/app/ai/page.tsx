'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useUserPlan } from '@/hooks/useUserPlan';
import { ProGate } from '@/components/ProGate';
import { ThinkingProgress } from '@/components/ThinkingProgress';
import { useThinkingProgress } from '@/hooks/useThinkingProgress';
import { AnalyzeTab } from './features/AnalyzeTab';
import { ThemesTab } from './features/ThemesTab';
import { IntelTab } from './features/IntelTab';
import { PortfolioTab } from './features/PortfolioTab';
import { ChatTab } from './features/ChatTab';
import type {
  ProfileAnalysis,
  ThemeRecommendation,
  ProfileIntel,
  PortfolioCaseStudy,
  ChatMessage,
  ProfileData,
} from './features/types';

type TabId = 'analyze' | 'themes' | 'intel' | 'portfolio' | 'chat';

const TABS: { id: TabId; label: string }[] = [
  { id: 'analyze', label: 'Profile Analysis' },
  { id: 'themes', label: 'Theme Recommendations' },
  { id: 'intel', label: 'Profile Intelligence' },
  { id: 'portfolio', label: 'Portfolio Builder' },
  { id: 'chat', label: 'AI Assistant' },
];

const INITIAL_CHAT: ChatMessage[] = [{
  role: 'assistant',
  content: 'Hi! I\'m GitSkins AI Assistant powered by Google Gemini. I can help you customize your GitHub profile widgets, recommend themes, and answer questions about GitSkins features. What would you like to know?',
  timestamp: new Date(),
}];

export default function AIFeaturesPage() {
  const prefersReducedMotion = useReducedMotion();
  const { plan, loading: planLoading } = useUserPlan();

  const [username, setUsername] = useState('octocat');
  const [activeTab, setActiveTab] = useState<TabId>('analyze');
  const [error, setError] = useState('');

  // Per-tab state
  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const [recommendations, setRecommendations] = useState<ThemeRecommendation[]>([]);
  const [loadingThemes, setLoadingThemes] = useState(false);

  const [profileIntel, setProfileIntel] = useState<ProfileIntel | null>(null);
  const [loadingIntel, setLoadingIntel] = useState(false);

  const [portfolio, setPortfolio] = useState<PortfolioCaseStudy[]>([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  const [explainSummary, setExplainSummary] = useState<string | null>(null);
  const [loadingExplain, setLoadingExplain] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Progress hooks
  const analyzeProgress = useThinkingProgress(['Fetching profile', 'Analyzing with Gemini'], { intervalMs: 1200 });
  const themesProgress = useThinkingProgress(['Fetching profile', 'Matching themes'], { intervalMs: 1200 });
  const intelProgress = useThinkingProgress(['Fetching profile', 'Searching benchmarks', 'Generating insights'], { intervalMs: 1400 });
  const portfolioProgress = useThinkingProgress(['Fetching profile', 'Analyzing repos', 'Writing case studies'], { intervalMs: 1500 });
  const explainProgress = useThinkingProgress(['Fetching profile', 'Explaining profile'], { intervalMs: 1200 });

  // Pro gate
  if (planLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (plan !== 'pro') {
    return (
      <ProGate
        feature="AI Profile Tools"
        tagline="Unlock AI-powered analysis, theme recommendations, portfolio case studies, and more — all driven by your GitHub data."
        benefits={[
          'Profile personality analysis with Gemini AI',
          'AI-matched theme recommendations',
          'Deep profile intelligence & benchmarks',
          'Auto-generated portfolio case studies',
          'GitHub profile AI chat assistant',
          'Unlimited AI requests',
        ]}
      />
    );
  }

  // Handlers
  async function handleAnalyze(overrideUsername?: string) {
    const target = (overrideUsername ?? username).trim();
    if (!target) { setError('Please enter a GitHub username'); return; }
    setError(''); setAnalyzing(true); setAnalysis(null);
    analyzeProgress.start();
    try {
      const res = await fetch('/api/ai/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: target }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze profile');
      setAnalysis(data.analysis); setProfileData(data.profile);
      analyzeProgress.complete();
    } catch (err: any) { setError(err.message); analyzeProgress.reset(); }
    finally { setAnalyzing(false); }
  }

  async function handleGetThemes(overrideUsername?: string) {
    const target = (overrideUsername ?? username).trim();
    if (!target) { setError('Please enter a GitHub username'); return; }
    setError(''); themesProgress.start(); setLoadingThemes(true); setRecommendations([]);
    try {
      const res = await fetch('/api/ai/recommend-themes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: target }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get recommendations');
      setRecommendations(data.recommendations); setProfileData(data.profile);
      themesProgress.complete();
    } catch (err: any) { setError(err.message); themesProgress.reset(); }
    finally { setLoadingThemes(false); }
  }

  async function handleGetIntel(overrideUsername?: string) {
    const target = (overrideUsername ?? username).trim();
    if (!target) { setError('Please enter a GitHub username'); return; }
    setError(''); intelProgress.start(); setLoadingIntel(true); setProfileIntel(null);
    try {
      const res = await fetch('/api/ai/profile-intel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: target }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get profile intelligence');
      setProfileIntel(data.intel); setProfileData(data.profile);
      intelProgress.complete();
    } catch (err: any) { setError(err.message); intelProgress.reset(); }
    finally { setLoadingIntel(false); }
  }

  async function handleGetPortfolio(overrideUsername?: string) {
    const target = (overrideUsername ?? username).trim();
    if (!target) { setError('Please enter a GitHub username'); return; }
    setError(''); portfolioProgress.start(); setLoadingPortfolio(true); setPortfolio([]);
    try {
      const res = await fetch('/api/ai/portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: target }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to build portfolio');
      setPortfolio(data.caseStudies || []); setProfileData(data.profile);
      portfolioProgress.complete();
    } catch (err: any) { setError(err.message); portfolioProgress.reset(); }
    finally { setLoadingPortfolio(false); }
  }

  async function handleExplainProfile() {
    const target = username.trim();
    if (!target) { setError('Please enter a GitHub username'); return; }
    setError(''); explainProgress.start(); setLoadingExplain(true); setExplainSummary(null);
    try {
      const res = await fetch('/api/ai/explain-profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: target }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to explain profile');
      setExplainSummary(data.summary);
      explainProgress.complete();
    } catch (err: any) { setError(err.message); explainProgress.reset(); }
    finally { setLoadingExplain(false); }
  }

  async function handleSendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: 'user', content: chatInput.trim(), timestamp: new Date() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userMsg.content, context: { username: username || undefined, profileData: profileData || undefined } }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get response');
      setChatMessages((prev) => [...prev, { role: 'assistant', content: data.response, timestamp: new Date() }]);
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() }]);
    } finally {
      setChatLoading(false);
    }
  }

  function runDemo() {
    const demo = 'octocat';
    setUsername(demo);
    if (activeTab === 'analyze') void handleAnalyze(demo);
    else if (activeTab === 'themes') void handleGetThemes(demo);
    else if (activeTab === 'intel') void handleGetIntel(demo);
    else if (activeTab === 'portfolio') void handleGetPortfolio(demo);
  }

  function handleEnterKey(e: React.KeyboardEvent) {
    if (e.key !== 'Enter') return;
    if (activeTab === 'analyze') void handleAnalyze();
    else if (activeTab === 'themes') void handleGetThemes();
    else if (activeTab === 'intel') void handleGetIntel();
    else if (activeTab === 'portfolio') void handleGetPortfolio();
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px clamp(16px, 4vw, 24px) 60px', position: 'relative', zIndex: 1, width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '24px', marginBottom: '16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
            <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: 500 }}>Powered by Gemini 3 Pro · Extended Thinking</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, background: 'linear-gradient(135deg, #fff 0%, #22c55e 50%, #4ade80 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '16px' }}>
            AI-Powered Features
          </h1>
          <p style={{ color: '#888', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            The Profile Agent discovers your coding personality, recommends themes, and powers the AI assistant.
          </p>
        </div>

        {/* Username Input */}
        <div style={{ maxWidth: '500px', margin: '0 auto 32px', display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', background: '#161616', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '12px 16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleEnterKey}
              placeholder="Enter GitHub username"
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '16px' }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={handleExplainProfile} disabled={loadingExplain || !username.trim()} style={{ padding: '8px 16px', background: loadingExplain ? '#1a1a1a' : 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '999px', color: loadingExplain ? '#666' : '#22c55e', fontSize: '13px', fontWeight: 600, cursor: loadingExplain ? 'not-allowed' : 'pointer' }}>
            {loadingExplain ? 'Explaining...' : 'Explain this profile'}
          </button>
          <button type="button" onClick={runDemo} style={{ padding: '8px 16px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '999px', color: '#22c55e', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            Run demo with octocat
          </button>
        </div>

        {loadingExplain && (
          <div style={{ maxWidth: '360px', margin: '0 auto 24px' }}>
            <ThinkingProgress steps={explainProgress.steps} activeIndex={explainProgress.activeIndex} variant="card" />
          </div>
        )}

        {explainSummary && (
          <div style={{ maxWidth: '600px', margin: '0 auto 24px', padding: '16px 20px', background: '#161616', border: '1px solid #2a2a2a', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Profile summary</div>
            <p style={{ color: '#e5e5e5', lineHeight: 1.6, margin: 0 }}>{explainSummary}</p>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '32px', flexWrap: 'wrap', padding: '6px', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '12px', maxWidth: 'fit-content', margin: '0 auto 32px' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ position: 'relative', padding: '9px 18px', background: 'transparent', border: 'none', borderRadius: '8px', color: activeTab === tab.id ? '#050505' : '#666', fontSize: '13px', fontWeight: 500, cursor: 'pointer', zIndex: 1, transition: 'color 0.2s' }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="ai-tab-indicator"
                  style={{ position: 'absolute', inset: 0, background: '#22c55e', borderRadius: '8px', zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ maxWidth: '600px', margin: '0 auto 24px', padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {activeTab === 'analyze' && (
              <AnalyzeTab username={username} analyzing={analyzing} analysis={analysis} profileData={profileData} analyzeSteps={analyzeProgress.steps} analyzeActiveIndex={analyzeProgress.activeIndex} onAnalyze={() => void handleAnalyze()} />
            )}
            {activeTab === 'themes' && (
              <ThemesTab username={username} loading={loadingThemes} recommendations={recommendations} themesSteps={themesProgress.steps} themesActiveIndex={themesProgress.activeIndex} onGetThemes={() => void handleGetThemes()} />
            )}
            {activeTab === 'intel' && (
              <IntelTab username={username} loading={loadingIntel} intel={profileIntel} intelSteps={intelProgress.steps} intelActiveIndex={intelProgress.activeIndex} onGetIntel={() => void handleGetIntel()} />
            )}
            {activeTab === 'portfolio' && (
              <PortfolioTab username={username} loading={loadingPortfolio} portfolio={portfolio} portfolioSteps={portfolioProgress.steps} portfolioActiveIndex={portfolioProgress.activeIndex} onGetPortfolio={() => void handleGetPortfolio()} />
            )}
            {activeTab === 'chat' && (
              <ChatTab messages={chatMessages} input={chatInput} loading={chatLoading} username={username} profileData={profileData} onInputChange={setChatInput} onSend={handleSendChat} />
            )}
          </motion.div>
        </AnimatePresence>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            AI features powered by <span style={{ color: '#22c55e', fontWeight: 600 }}>Gemini 3 Pro</span>
            <span style={{ color: '#444', fontSize: '12px', display: 'block', marginTop: '4px' }}>Extended Thinking · Google Search Grounding · Streaming</span>
          </p>
        </div>
      </div>
    </div>
  );
}
