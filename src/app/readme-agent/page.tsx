'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Navigation } from '@/components/landing/Navigation';

type ReadmeStyle = 'minimal' | 'detailed' | 'creative';
type CareerRole = 'frontend' | 'backend' | 'fullstack' | 'data' | 'mobile' | 'devops' | 'product';

const careerRoles: { id: CareerRole; label: string }[] = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'fullstack', label: 'Full-Stack' },
  { id: 'data', label: 'Data/ML' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'devops', label: 'DevOps' },
  { id: 'product', label: 'Product' },
];

const styleOptions: { id: ReadmeStyle; label: string }[] = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'detailed', label: 'Detailed' },
  { id: 'creative', label: 'Creative' },
];

interface StreamChunk {
  type: 'thought' | 'text' | 'status';
  content: string;
  timestamp: number;
}

export default function ReadmeAgentPage() {
  const searchParams = useSearchParams();
  const [username, setUsername] = useState(searchParams.get('username') || '');
  const [style, setStyle] = useState<ReadmeStyle>('detailed');
  const [careerMode, setCareerMode] = useState(false);
  const [careerRole, setCareerRole] = useState<CareerRole>('fullstack');
  const [streaming, setStreaming] = useState(false);
  const [thoughts, setThoughts] = useState<StreamChunk[]>([]);
  const [markdown, setMarkdown] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const thoughtsRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll thoughts panel
  useEffect(() => {
    if (thoughtsRef.current) {
      thoughtsRef.current.scrollTop = thoughtsRef.current.scrollHeight;
    }
  }, [thoughts, status]);

  const startGeneration = useCallback(async () => {
    if (!username.trim() || streaming) return;

    setStreaming(true);
    setThoughts([]);
    setMarkdown('');
    setStatus('Fetching profile...');
    setError('');

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/readme-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          style,
          theme: 'satan',
          careerMode,
          careerRole: careerMode ? careerRole : undefined,
          sections: ['header', 'about', 'skills', 'stats', 'projects', 'connect'],
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to start generation');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream available');

      const decoder = new TextDecoder();
      let buffer = '';

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
            const chunk = JSON.parse(data) as { type: 'thought' | 'text' | 'status'; content: string };
            if (chunk.type === 'thought') {
              setThoughts((prev) => [...prev, { ...chunk, timestamp: Date.now() }]);
            } else if (chunk.type === 'text') {
              if (chunk.content.includes('<!-- REFINED VERSION -->')) {
                // Agent loop: replace draft with refined version
                setMarkdown('');
              } else {
                setMarkdown((prev) => prev + chunk.content);
              }
            } else if (chunk.type === 'status') {
              setStatus(chunk.content);
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }

      setStatus('Complete');
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setStatus('Cancelled');
      } else {
        setError(e instanceof Error ? e.message : 'Generation failed');
        setStatus('');
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [username, style, careerMode, careerRole, streaming]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleCopy = useCallback(async () => {
    if (!markdown) return;
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [markdown]);

  const isComplete = status === 'Complete' && markdown.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa', fontFamily: 'var(--font-sans, system-ui)' }}>
      <Navigation />

      <main style={{ paddingTop: '80px', paddingBottom: '60px', paddingLeft: 'clamp(12px, 3vw, 24px)', paddingRight: 'clamp(12px, 3vw, 24px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <Link href="/readme-generator" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
                ← README Generator
              </Link>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '100px', fontSize: '12px', fontWeight: 500, color: '#22c55e' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                Gemini 3 Pro · Extended Thinking
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Live README Agent
            </h1>
            <p style={{ color: '#666', fontSize: '15px', maxWidth: '600px' }}>
              Watch Gemini 3 think, draft, and refine your README in real-time. Extended Thinking lets you see the AI's reasoning process.
            </p>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px', fontWeight: 500 }}>GitHub Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startGeneration()}
                placeholder="octocat"
                style={{ width: '100%', padding: '10px 14px', background: '#111', border: '1px solid #222', borderRadius: '10px', color: '#fafafa', fontSize: '15px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px', fontWeight: 500 }}>Style</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {styleOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setStyle(opt.id)}
                    style={{
                      padding: '8px 14px',
                      background: style === opt.id ? 'rgba(34, 197, 94, 0.15)' : '#111',
                      border: `1px solid ${style === opt.id ? 'rgba(34, 197, 94, 0.4)' : '#222'}`,
                      borderRadius: '8px',
                      color: style === opt.id ? '#22c55e' : '#888',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#666', fontWeight: 500, cursor: 'pointer', marginBottom: '6px' }}>
                <input
                  type="checkbox"
                  checked={careerMode}
                  onChange={(e) => setCareerMode(e.target.checked)}
                  style={{ accentColor: '#22c55e' }}
                />
                Career Mode
              </label>
              {careerMode && (
                <select
                  value={careerRole}
                  onChange={(e) => setCareerRole(e.target.value as CareerRole)}
                  style={{ padding: '8px 12px', background: '#111', border: '1px solid #222', borderRadius: '8px', color: '#fafafa', fontSize: '13px' }}
                >
                  {careerRoles.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={streaming ? handleStop : startGeneration}
                disabled={!username.trim() && !streaming}
                style={{
                  padding: '10px 24px',
                  background: streaming ? '#dc2626' : '#22c55e',
                  color: streaming ? '#fff' : '#050505',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: !username.trim() && !streaming ? 'not-allowed' : 'pointer',
                  opacity: !username.trim() && !streaming ? 0.5 : 1,
                }}
              >
                {streaming ? 'Stop' : 'Generate'}
              </button>
              {isComplete && (
                <button
                  onClick={handleCopy}
                  style={{ padding: '10px 18px', background: '#111', border: '1px solid #222', borderRadius: '10px', color: copied ? '#22c55e' : '#ccc', fontWeight: 500, fontSize: '14px', cursor: 'pointer' }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', color: '#fca5a5', fontSize: '14px' }}>
              {error}
            </div>
          )}

          {/* Split Pane */}
          {(streaming || markdown || thoughts.length > 0) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '16px', minHeight: '500px' }}>
              {/* Left: Thinking Panel */}
              <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 16px', background: '#111', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#888' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a8 8 0 0 0-8 8c0 3.4 2 6 5 7.5V20h6v-2.5c3-1.5 5-4.1 5-7.5a8 8 0 0 0-8-8z" />
                    <path d="M10 22h4" />
                  </svg>
                  AI Thinking
                  {streaming && (
                    <span style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  )}
                </div>
                <div
                  ref={thoughtsRef}
                  style={{ flex: 1, padding: '16px', overflowY: 'auto', fontSize: '13px', lineHeight: 1.7, color: '#888', fontFamily: 'var(--font-mono, monospace)' }}
                >
                  {status && (
                    <div style={{ marginBottom: '12px', color: status === 'Complete' ? '#22c55e' : '#666', fontWeight: 500, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {status === 'Complete' ? '--- Generation complete ---' : status}
                    </div>
                  )}
                  {thoughts.map((t, i) => (
                    <div key={i} style={{ marginBottom: '8px', paddingLeft: '12px', borderLeft: '2px solid #1a1a1a', color: '#666' }}>
                      {t.content}
                    </div>
                  ))}
                  {streaming && thoughts.length === 0 && !status.includes('thinking') && (
                    <div style={{ color: '#444', fontStyle: 'italic' }}>Waiting for thoughts...</div>
                  )}
                </div>
              </div>

              {/* Right: README Preview */}
              <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 16px', background: '#111', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#888' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  README Preview
                  {markdown && (
                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#444', fontWeight: 400 }}>
                      {markdown.length.toLocaleString()} chars
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', fontSize: '14px', lineHeight: 1.7, color: '#d4d4d4' }}>
                  {markdown ? (
                    <div className="readme-preview" style={{ maxWidth: '720px' }}>
                      <ReactMarkdown>{markdown}</ReactMarkdown>
                    </div>
                  ) : streaming ? (
                    <div style={{ color: '#444', fontStyle: 'italic' }}>README will appear here as it streams...</div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!streaming && !markdown && thoughts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px dashed #222', borderRadius: '16px', color: '#444' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', display: 'block', color: '#333' }}>
                <path d="M12 2a8 8 0 0 0-8 8c0 3.4 2 6 5 7.5V20h6v-2.5c3-1.5 5-4.1 5-7.5a8 8 0 0 0-8-8z" />
                <path d="M10 22h4" />
              </svg>
              <p style={{ fontSize: '15px', marginBottom: '8px' }}>Enter a GitHub username and click Generate</p>
              <p style={{ fontSize: '13px', color: '#333' }}>Watch Gemini 3 think through your profile and generate a README in real-time</p>
            </div>
          )}

          {/* Footer badge */}
          {isComplete && (
            <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(34, 197, 94, 0.06)', border: '1px solid rgba(34, 197, 94, 0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#666' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>
                Generated with <strong style={{ color: '#22c55e' }}>Gemini 3 Pro</strong> (Extended Thinking)
                {thoughts.length > 0 && ` · ${thoughts.length} thought${thoughts.length === 1 ? '' : 's'} surfaced`}
              </span>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .readme-preview h1 { font-size: 28px; font-weight: 700; margin: 0 0 16px; color: #fafafa; border-bottom: 1px solid #222; padding-bottom: 12px; }
        .readme-preview h2 { font-size: 22px; font-weight: 600; margin: 24px 0 12px; color: #e5e5e5; }
        .readme-preview h3 { font-size: 18px; font-weight: 600; margin: 20px 0 8px; color: #d4d4d4; }
        .readme-preview p { margin: 0 0 12px; }
        .readme-preview a { color: #22c55e; text-decoration: underline; }
        .readme-preview img { max-width: 100%; border-radius: 8px; margin: 8px 0; }
        .readme-preview code { background: #1a1a1a; padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: var(--font-mono, monospace); }
        .readme-preview pre { background: #111; border: 1px solid #1a1a1a; border-radius: 8px; padding: 16px; overflow-x: auto; margin: 12px 0; }
        .readme-preview pre code { background: none; padding: 0; }
        .readme-preview ul, .readme-preview ol { padding-left: 24px; margin: 0 0 12px; }
        .readme-preview li { margin-bottom: 4px; }
        .readme-preview blockquote { border-left: 3px solid #22c55e; padding-left: 16px; color: #888; margin: 12px 0; }
        .readme-preview hr { border: none; border-top: 1px solid #222; margin: 24px 0; }
        .readme-preview table { width: 100%; border-collapse: collapse; margin: 12px 0; }
        .readme-preview th, .readme-preview td { border: 1px solid #222; padding: 8px 12px; text-align: left; }
        .readme-preview th { background: #111; font-weight: 600; }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
