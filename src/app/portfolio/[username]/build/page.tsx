'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { Navigation } from '@/components/landing/Navigation';
import JSZip from 'jszip';

const EDIT_SUGGESTIONS = [
  'Make the header bigger',
  'Use a blue accent color',
  'Add a contact section',
  'Make it more minimal',
  'Increase font sizes for readability',
];

export default function PortfolioBuildPage() {
  const params = useParams();
  const rawUsername = (params.username as string) || '';
  const username = rawUsername.startsWith('@') ? rawUsername.slice(1) : rawUsername;

  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState('');

  const generateWebsite = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/portfolio-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate website');
      setHtml(data.html || '');
      setCss(data.css || '');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate website');
    } finally {
      setLoading(false);
    }
  }, [username]);

  const applyEdit = useCallback(async () => {
    if (!editMessage.trim() || !html) return;
    setError(null);
    setEditLoading(true);
    try {
      const res = await fetch('/api/ai/portfolio-website-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, css, message: editMessage.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to apply edit');
      setHtml(data.html ?? html);
      setCss(data.css ?? css);
      setEditMessage('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to apply edit');
    } finally {
      setEditLoading(false);
    }
  }, [html, css, editMessage]);

  const setSuggestion = useCallback((text: string) => {
    setEditMessage(text);
  }, []);

  const downloadZip = useCallback(async () => {
    if (!html) return;
    const fullHtml = css
      ? html.replace('</head>', `<style>${css}</style></head>`)
      : html;
    const zip = new JSZip();
    zip.file('index.html', fullHtml);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${username}-portfolio.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }, [html, css, username]);

  const previewDoc = html
    ? css
      ? html.replace('</head>', `<style>${css}</style></head>`)
      : html
    : '';

  const baseStyles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    },
    main: {
      paddingTop: '100px',
      paddingBottom: '80px',
      paddingLeft: 'clamp(16px, 4vw, 24px)',
      paddingRight: 'clamp(16px, 4vw, 24px)',
    },
    container: {
      maxWidth: '1100px',
      margin: '0 auto' as const,
    },
    breadcrumb: {
      marginBottom: '24px',
      display: 'flex' as const,
      alignItems: 'center' as const,
      gap: '12px',
      flexWrap: 'wrap' as const,
    },
    title: {
      fontSize: 'clamp(26px, 5vw, 40px)',
      fontWeight: 700,
      marginBottom: '8px',
    },
    subtitle: {
      color: '#888',
      fontSize: 'clamp(14px, 2vw, 16px)',
      lineHeight: 1.5,
    },
    errorBanner: {
      marginBottom: '16px',
      padding: '12px 16px',
      background: 'rgba(239,68,68,0.15)',
      border: '1px solid rgba(239,68,68,0.4)',
      borderRadius: '12px',
      color: '#fca5a5',
      fontSize: '14px',
    },
    toolbar: {
      display: 'flex' as const,
      gap: '12px',
      flexWrap: 'wrap' as const,
      marginBottom: '24px',
    },
    btnPrimary: {
      padding: '14px 24px',
      minHeight: '48px',
      background: '#22c55e',
      color: '#000',
      border: 'none',
      borderRadius: '12px',
      fontWeight: 600,
      fontSize: '15px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    btnSecondary: {
      padding: '14px 24px',
      minHeight: '48px',
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '12px',
      color: '#e5e5e5',
      fontWeight: 600,
      fontSize: '15px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    chatCard: {
      background: '#111',
      border: '1px solid #2a2a2a',
      borderRadius: '16px',
      overflow: 'hidden' as const,
      marginBottom: '24px',
    },
    chatHeader: {
      padding: '16px 20px',
      background: '#161616',
      borderBottom: '1px solid #2a2a2a',
      fontSize: '14px',
      fontWeight: 600,
      color: '#e5e5e5',
      display: 'flex' as const,
      alignItems: 'center' as const,
      gap: '8px',
    },
    chatInputRow: {
      display: 'flex' as const,
      gap: '12px',
      flexWrap: 'wrap' as const,
      padding: '16px 20px',
      alignItems: 'flex-end' as const,
    },
    textarea: {
      flex: '1 1 280px',
      minHeight: '88px',
      padding: '14px 16px',
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '12px',
      color: '#fff',
      fontSize: '15px',
      resize: 'vertical' as const,
      outline: 'none',
      fontFamily: 'inherit',
    },
    chipRow: {
      display: 'flex' as const,
      flexWrap: 'wrap' as const,
      gap: '8px',
      padding: '0 20px 16px',
    },
    chip: {
      padding: '8px 14px',
      background: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '999px',
      color: '#a1a1a1',
      fontSize: '13px',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    },
    previewWrapper: {
      border: '1px solid #2a2a2a',
      borderRadius: '16px',
      overflow: 'hidden' as const,
      background: '#0a0a0a',
    },
    previewLabel: {
      padding: '12px 16px',
      background: '#161616',
      color: '#888',
      fontSize: '13px',
      fontWeight: 500,
    },
    emptyState: {
      padding: 'clamp(40px, 8vw, 60px) 20px',
      textAlign: 'center' as const,
      color: '#666',
      border: '1px dashed #333',
      borderRadius: '16px',
      fontSize: '15px',
    },
  };

  return (
    <div style={baseStyles.page}>
      <Navigation />

      <main style={baseStyles.main}>
        <div style={baseStyles.container}>
          <div style={baseStyles.breadcrumb}>
            <Link
              href={`/portfolio/${username}`}
              style={{ color: '#888', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}
            >
              ← Portfolio
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={baseStyles.title}>Portfolio Website Builder</h1>
            <p style={baseStyles.subtitle}>
              Generate a one-page site for @{username}, edit with natural language, then download as ZIP.
            </p>
          </div>

          {error && <div style={baseStyles.errorBanner}>{error}</div>}

          <div style={baseStyles.toolbar}>
            <button
              type="button"
              onClick={generateWebsite}
              disabled={loading}
              style={{
                ...baseStyles.btnPrimary,
                background: loading ? '#333' : '#22c55e',
                color: loading ? '#666' : '#000',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Generating…' : 'Generate website'}
            </button>
            {html && (
              <button type="button" onClick={downloadZip} style={baseStyles.btnSecondary}>
                Download ZIP
              </button>
            )}
          </div>

          {html && (
            <div style={baseStyles.chatCard}>
              <div style={baseStyles.chatHeader}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Edit with AI
              </div>
              <div style={baseStyles.chipRow}>
                {EDIT_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSuggestion(s)}
                    style={baseStyles.chip}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#22c55e';
                      e.currentTarget.style.color = '#22c55e';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#333';
                      e.currentTarget.style.color = '#a1a1a1';
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div style={baseStyles.chatInputRow}>
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      applyEdit();
                    }
                  }}
                  placeholder="Describe the change you want, e.g. Make the header bigger and use a blue accent"
                  style={baseStyles.textarea}
                  rows={3}
                />
                <button
                  type="button"
                  onClick={applyEdit}
                  disabled={editLoading || !editMessage.trim()}
                  style={{
                    ...baseStyles.btnPrimary,
                    padding: '14px 28px',
                    minWidth: '120px',
                    background: editLoading || !editMessage.trim() ? '#333' : '#22c55e',
                    color: editLoading || !editMessage.trim() ? '#666' : '#000',
                    cursor: editLoading || !editMessage.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  {editLoading ? 'Applying…' : 'Apply'}
                </button>
              </div>
            </div>
          )}

          {previewDoc ? (
            <div style={baseStyles.previewWrapper}>
              <div style={baseStyles.previewLabel}>Live preview</div>
              <iframe
                title="Portfolio preview"
                srcDoc={previewDoc}
                style={{
                  width: '100%',
                  height: 'clamp(400px, 70vh, 800px)',
                  minHeight: '400px',
                  border: 'none',
                  display: 'block',
                }}
                sandbox="allow-same-origin"
              />
            </div>
          ) : (
            <div style={baseStyles.emptyState}>
              Click “Generate website” to create your portfolio page. You can then edit it with natural language and download it as a ZIP file.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
