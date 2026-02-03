'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const accent = '#22c55e';

export default function VisualizePage() {
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [thoughts, setThoughts] = useState<Array<{ content: string; timestamp: number }>>([]);
  const [rawText, setRawText] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [copiedDiagram, setCopiedDiagram] = useState(false);
  const [mermaidRendered, setMermaidRendered] = useState(false);
  const thoughtsRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Extract sections from raw text
  const mermaidMatch = rawText.match(/```mermaid\s*([\s\S]*?)```/);
  const mermaidCode = mermaidMatch ? mermaidMatch[1].trim() : '';

  const explanationMatch = rawText.match(/## Architecture Overview\s*([\s\S]*?)(?=## Key Patterns|$)/);
  const explanation = explanationMatch ? explanationMatch[1].trim() : '';

  const patternsMatch = rawText.match(/## Key Patterns\s*([\s\S]*?)$/);
  const patterns = patternsMatch ? patternsMatch[1].trim() : '';

  // Render Mermaid diagram
  useEffect(() => {
    if (!mermaidCode || mermaidRendered) return;

    const container = document.getElementById('mermaid-diagram');
    if (!container) return;

    let cancelled = false;

    import('mermaid').then((mod) => {
      if (cancelled) return;
      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#22c55e',
          primaryTextColor: '#fafafa',
          primaryBorderColor: '#22c55e',
          lineColor: '#444',
          secondaryColor: '#111',
          tertiaryColor: '#0a0a0a',
          background: '#0a0a0a',
          mainBkg: '#111',
          nodeBorder: '#22c55e',
          clusterBkg: '#0a0a0a',
          clusterBorder: '#1f1f1f',
          titleColor: '#fafafa',
          edgeLabelBackground: '#0a0a0a',
        },
      });
      mermaid.render('mermaid-svg', mermaidCode).then(({ svg }) => {
        if (!cancelled && container) {
          container.innerHTML = svg;
          setMermaidRendered(true);
        }
      }).catch(() => {
        if (!cancelled && container) {
          container.innerHTML = `<pre style="color: #666; font-size: 13px; white-space: pre-wrap;">${mermaidCode}</pre>`;
        }
      });
    });

    return () => { cancelled = true; };
  }, [mermaidCode, mermaidRendered]);

  // Reset mermaid render state when text changes substantially
  useEffect(() => {
    if (!streaming) return;
    setMermaidRendered(false);
  }, [rawText, streaming]);

  // Auto-scroll thoughts
  useEffect(() => {
    if (thoughtsRef.current) {
      thoughtsRef.current.scrollTop = thoughtsRef.current.scrollHeight;
    }
  }, [thoughts]);

  const handleAnalyze = useCallback(async () => {
    const trimmed = input.trim();
    const parts = trimmed.split('/');
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      setError('Enter a valid owner/repo format (e.g. vercel/next.js)');
      return;
    }

    const [owner, repo] = parts;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStreaming(true);
    setError('');
    setRawText('');
    setThoughts([]);
    setStatus('');
    setMermaidRendered(false);

    try {
      const res = await fetch('/api/visualize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo }),
        signal: controller.signal,
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
            if (chunk.type === 'thought') {
              setThoughts((prev) => [...prev, { content: chunk.content, timestamp: Date.now() }]);
            } else if (chunk.type === 'text') {
              accumulated += chunk.content;
              setRawText(accumulated);
            } else if (chunk.type === 'status') {
              setStatus(chunk.content);
            }
          } catch {
            // Skip malformed
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setStreaming(false);
      setMermaidRendered(false); // trigger final render
    }
  }, [input]);

  const handleStop = () => {
    if (abortRef.current) abortRef.current.abort();
    setStreaming(false);
  };

  const copyMermaid = async () => {
    if (!mermaidCode) return;
    await navigator.clipboard.writeText('```mermaid\n' + mermaidCode + '\n```');
    setCopiedDiagram(true);
    setTimeout(() => setCopiedDiagram(false), 2000);
  };

  const hasResults = rawText.length > 0;

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 48px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
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
              color: accent,
              marginBottom: 16,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Powered by Gemini 3 Pro -- Extended Thinking
          </div>
          <h1
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 700,
              margin: 0,
              marginBottom: 8,
              letterSpacing: '-0.02em',
            }}
          >
            Repo Architecture Visualizer
          </h1>
          <p style={{ color: '#a1a1a1', fontSize: 16, margin: 0 }}>
            AI-generated architecture diagrams and analysis for any GitHub repository.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 8, maxWidth: 500, margin: '0 auto 32px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="owner/repo (e.g. vercel/next.js)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !streaming && handleAnalyze()}
            style={{
              flex: 1,
              minWidth: 200,
              padding: '12px 16px',
              background: '#111',
              border: '1px solid #1f1f1f',
              borderRadius: 10,
              color: '#fafafa',
              fontSize: 15,
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = accent; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#1f1f1f'; }}
          />
          {streaming ? (
            <button
              onClick={handleStop}
              style={{
                padding: '12px 24px',
                background: '#dc2626',
                border: 'none',
                borderRadius: 10,
                color: '#fafafa',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              Stop
            </button>
          ) : (
            <button
              onClick={handleAnalyze}
              style={{
                padding: '12px 24px',
                background: accent,
                border: 'none',
                borderRadius: 10,
                color: '#050505',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#4ade80'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = accent; }}
            >
              Analyze
            </button>
          )}
        </div>

        {error && (
          <div style={{ textAlign: 'center', color: '#ef4444', fontSize: 14, marginBottom: 24 }}>{error}</div>
        )}

        {/* Results: split pane */}
        {(hasResults || streaming) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.8fr)',
              gap: 16,
              minHeight: 500,
            }}
          >
            {/* Left: Thinking */}
            <div
              style={{
                background: '#0a0a0a',
                border: '1px solid #1f1f1f',
                borderRadius: 14,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #1f1f1f',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#a1a1a1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {streaming && (
                  <div
                    className="animate-pulse"
                    style={{ width: 8, height: 8, borderRadius: '50%', background: accent }}
                  />
                )}
                AI Thinking
              </div>
              <div
                ref={thoughtsRef}
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: 16,
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: '#666',
                  lineHeight: 1.6,
                }}
              >
                {status && (
                  <div style={{ color: accent, marginBottom: 12, fontWeight: 500 }}>{status}</div>
                )}
                {thoughts.map((t, i) => (
                  <div key={i} style={{ marginBottom: 8, borderBottom: '1px solid #111', paddingBottom: 8 }}>
                    {t.content}
                  </div>
                ))}
                {streaming && thoughts.length === 0 && (
                  <div style={{ color: '#444', fontStyle: 'italic' }}>Waiting for thoughts...</div>
                )}
              </div>
            </div>

            {/* Right: Results */}
            <div
              style={{
                background: '#0a0a0a',
                border: '1px solid #1f1f1f',
                borderRadius: 14,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #1f1f1f',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#a1a1a1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>Architecture Analysis</span>
                {mermaidCode && (
                  <button
                    onClick={copyMermaid}
                    style={{
                      padding: '4px 10px',
                      fontSize: 12,
                      background: copiedDiagram ? '#16a34a' : '#161616',
                      border: '1px solid #2a2a2a',
                      borderRadius: 6,
                      color: copiedDiagram ? '#fafafa' : '#a1a1a1',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedDiagram ? 'Copied!' : 'Copy Mermaid'}
                  </button>
                )}
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {/* Mermaid diagram */}
                {mermaidCode && (
                  <div style={{ marginBottom: 24 }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: '#666',
                        fontWeight: 500,
                        marginBottom: 12,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      Dependency Graph
                    </div>
                    <div
                      id="mermaid-diagram"
                      style={{
                        background: '#111',
                        border: '1px solid #1f1f1f',
                        borderRadius: 12,
                        padding: 16,
                        overflowX: 'auto',
                        minHeight: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div className="animate-spin" style={{ width: 24, height: 24, border: '2px solid #1f1f1f', borderTopColor: accent, borderRadius: '50%' }} />
                    </div>
                  </div>
                )}

                {/* Architecture explanation */}
                {explanation && (
                  <div style={{ marginBottom: 24 }}>
                    <div className="readme-preview" style={{ fontSize: 14, lineHeight: 1.7, color: '#d4d4d4' }}>
                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{'## Architecture Overview\n\n' + explanation}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Key patterns */}
                {patterns && (
                  <div>
                    <div className="readme-preview" style={{ fontSize: 14, lineHeight: 1.7, color: '#d4d4d4' }}>
                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{'## Key Patterns\n\n' + patterns}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* Streaming placeholder */}
                {streaming && !mermaidCode && !explanation && (
                  <div style={{ color: '#444', textAlign: 'center', padding: 40 }}>
                    <div
                      className="animate-spin"
                      style={{ width: 32, height: 32, border: '3px solid #1f1f1f', borderTopColor: accent, borderRadius: '50%', margin: '0 auto 16px' }}
                    />
                    Analysis will appear here as it streams...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Responsive override for mobile */}
        <style>{`
          @media (max-width: 768px) {
            div[style*="gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.8fr)'"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
