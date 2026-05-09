'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import JSZip from 'jszip';
import { ThinkingProgress } from '@/components/ThinkingProgress';
import { useThinkingProgress } from '@/hooks/useThinkingProgress';
import {
  portfolioGoals,
  portfolioTemplates,
  portfolioTones,
  type PortfolioGoal,
  type PortfolioTemplateId,
  type PortfolioTone,
} from '@/lib/portfolio-templates';

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

interface SavedPortfolioBuild {
  id: string;
  username: string;
  title: string;
  template: PortfolioTemplateId;
  goal: PortfolioGoal;
  tone: PortfolioTone;
  html: string;
  css: string;
  createdAt: string;
  updatedAt: string;
}

const EDIT_SUGGESTIONS = [
  'Rewrite the hero for hiring managers',
  'Make the project cards more premium',
  'Add stronger product CTAs',
  'Add smooth CSS-only animations',
  'Make the layout more minimal',
  'Improve the mobile spacing',
];

const previewWidths: Record<PreviewMode, string> = {
  desktop: '100%',
  tablet: '760px',
  mobile: '390px',
};

export default function PortfolioBuildPage() {
  const router = useRouter();
  const params = useParams();
  const rawUsername = (params.username as string) || '';
  const username = rawUsername.startsWith('@') ? rawUsername.slice(1) : rawUsername;

  const [inputUsername, setInputUsername] = useState(username);
  const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplateId>('terminal-pro');
  const [selectedGoal, setSelectedGoal] = useState<PortfolioGoal>('get-hired');
  const [selectedTone, setSelectedTone] = useState<PortfolioTone>('premium');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState<SavedPortfolioBuild[]>([]);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState('');

  const selectedTemplateDetails = useMemo(
    () => portfolioTemplates.find((template) => template.id === selectedTemplate) ?? portfolioTemplates[0],
    [selectedTemplate]
  );

  const {
    activeIndex: websiteActiveIndex,
    steps: websiteSteps,
    start: websiteStart,
    complete: websiteComplete,
    reset: websiteReset,
  } = useThinkingProgress(
    ['Reading GitHub signal', 'Ranking projects', 'Writing case studies', 'Designing portfolio system'],
    { intervalMs: 1400 }
  );
  const {
    activeIndex: editActiveIndex,
    steps: editSteps,
    start: editStart,
    complete: editComplete,
    reset: editReset,
  } = useThinkingProgress(['Understanding edit', 'Rewriting section', 'Refreshing preview'], { intervalMs: 900 });

  const handleUsernameChange = (e: React.FormEvent) => {
    e.preventDefault();
    const nextUsername = inputUsername.trim().replace(/^@/, '');
    if (nextUsername && nextUsername !== username) {
      router.push(`/portfolio/${nextUsername}/build`);
    }
  };

  const loadSavedBuilds = useCallback(async () => {
    try {
      const response = await fetch(`/api/portfolio-builds?username=${encodeURIComponent(username)}`);
      if (!response.ok) return;
      const data = await response.json();
      setSavedBuilds(data.builds ?? []);
    } catch {
      // Saved builds are a convenience layer; generation should still work if loading fails.
    }
  }, [username]);

  useEffect(() => {
    loadSavedBuilds();
  }, [loadSavedBuilds]);

  const generateWebsite = useCallback(async () => {
    setError(null);
    websiteStart();
    setLoading(true);
    try {
      const res = await fetch('/api/ai/portfolio-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          template: selectedTemplate,
          goal: selectedGoal,
          tone: selectedTone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate website');
      setHtml(data.html || '');
      setCss(data.css || '');
      setSavedMessage(null);
      websiteComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate website');
      websiteReset();
    } finally {
      setLoading(false);
    }
  }, [username, selectedTemplate, selectedGoal, selectedTone, websiteStart, websiteComplete, websiteReset]);

  const applyEdit = useCallback(async () => {
    if (!editMessage.trim() || !html) return;
    setError(null);
    editStart();
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
      editComplete();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to apply edit');
      editReset();
    } finally {
      setEditLoading(false);
    }
  }, [html, css, editMessage, editStart, editComplete, editReset]);

  const downloadZip = useCallback(async () => {
    if (!html) return;
    const fullHtml = css
      ? html.replace('</head>', `<style>${css}</style></head>`)
      : html;
    const zip = new JSZip();
    zip.file('index.html', fullHtml);
    zip.file('README.txt', `Portfolio generated by GitSkins for @${username}\nTemplate: ${selectedTemplateDetails.name}\n`);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${username}-portfolio.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }, [html, css, username, selectedTemplateDetails.name]);

  const saveCurrentBuild = useCallback(async () => {
    if (!html) return;
    setSaveLoading(true);
    setError(null);
    setSavedMessage(null);
    try {
      const response = await fetch('/api/portfolio-builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          title: `${selectedTemplateDetails.name} portfolio for @${username}`,
          template: selectedTemplate,
          goal: selectedGoal,
          tone: selectedTone,
          html,
          css,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save portfolio');
      setSavedBuilds((current) => [data.build, ...current.filter((build) => build.id !== data.build.id)].slice(0, 20));
      setSavedMessage('Portfolio version saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save portfolio');
    } finally {
      setSaveLoading(false);
    }
  }, [html, css, username, selectedTemplate, selectedGoal, selectedTone, selectedTemplateDetails.name]);

  const restoreBuild = useCallback((build: SavedPortfolioBuild) => {
    setSelectedTemplate(build.template);
    setSelectedGoal(build.goal);
    setSelectedTone(build.tone);
    setHtml(build.html);
    setCss(build.css);
    setSavedMessage(`Loaded ${build.title}`);
    setError(null);
  }, []);

  const previewDoc = html
    ? (() => {
        const cspMeta =
          '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src https: data:; style-src \'unsafe-inline\'; font-src data:;">';
        const withStyle = css
          ? html.replace('</head>', `<style>${css}</style></head>`)
          : html;
        return withStyle.replace('</head>', `${cspMeta}</head>`);
      })()
    : '';

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <div style={styles.topBar}>
          <Link href={`/portfolio/${username}`} style={styles.backLink}>← Case studies</Link>
          <div style={styles.topActions}>
            {(['desktop', 'tablet', 'mobile'] as PreviewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPreviewMode(mode)}
                style={{
                  ...styles.modeButton,
                  ...(previewMode === mode ? styles.modeButtonActive : {}),
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <header style={styles.hero}>
          <div>
            <div style={styles.eyebrow}>Portfolio Studio</div>
            <h1 style={styles.title}>Turn @{username} into a polished developer portfolio.</h1>
            <p style={styles.subtitle}>
              Pick a direction, let GitSkins read the strongest GitHub signals, then generate an editable portfolio with case studies, proof points, and production-ready HTML/CSS.
            </p>
          </div>
          <form onSubmit={handleUsernameChange} style={styles.userForm}>
            <label style={styles.label} htmlFor="portfolio-username">GitHub username</label>
            <div style={styles.userInputRow}>
              <input
                id="portfolio-username"
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="octocat"
                style={styles.input}
              />
              <button type="submit" style={styles.smallButton}>Load</button>
            </div>
          </form>
        </header>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <div style={styles.workspace}>
          <aside style={styles.sidebar}>
            <section style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelKicker}>1</span>
                <div>
                  <h2 style={styles.panelTitle}>Choose a template</h2>
                  <p style={styles.panelCopy}>Start with a clear portfolio strategy.</p>
                </div>
              </div>
              <div style={styles.templateGrid}>
                {portfolioTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplate(template.id)}
                    style={{
                      ...styles.templateCard,
                      borderColor: selectedTemplate === template.id ? template.accent : '#232323',
                      background: selectedTemplate === template.id ? 'rgba(255,255,255,0.055)' : '#0d0d0d',
                    }}
                  >
                    <span style={{ ...styles.templateSwatch, background: template.accent }} />
                    <span style={styles.templateName}>{template.name}</span>
                    <span style={styles.templateBestFor}>{template.bestFor}</span>
                    <span style={styles.templateTagline}>{template.tagline}</span>
                  </button>
                ))}
              </div>
            </section>

            <section style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelKicker}>2</span>
                <div>
                  <h2 style={styles.panelTitle}>Set the goal</h2>
                  <p style={styles.panelCopy}>The copy should optimize for the outcome.</p>
                </div>
              </div>
              <SegmentedControl
                items={portfolioGoals}
                value={selectedGoal}
                onChange={(value) => setSelectedGoal(value as PortfolioGoal)}
              />
            </section>

            <section style={styles.panel}>
              <div style={styles.panelHeader}>
                <span style={styles.panelKicker}>3</span>
                <div>
                  <h2 style={styles.panelTitle}>Pick the voice</h2>
                  <p style={styles.panelCopy}>Keep it aligned with the audience.</p>
                </div>
              </div>
              <SegmentedControl
                items={portfolioTones}
                value={selectedTone}
                onChange={(value) => setSelectedTone(value as PortfolioTone)}
              />
            </section>

            <button
              type="button"
              onClick={generateWebsite}
              disabled={loading}
              style={{
                ...styles.generateButton,
                background: loading ? '#242424' : selectedTemplateDetails.accent,
                color: selectedTemplateDetails.accent === '#e5e7eb' ? '#050505' : '#050505',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Generating portfolio...' : 'Generate premium portfolio'}
            </button>

            {html && (
              <button type="button" onClick={downloadZip} style={styles.downloadButton}>
                Download HTML/CSS ZIP
              </button>
            )}

            {html && (
              <button
                type="button"
                onClick={saveCurrentBuild}
                disabled={saveLoading}
                style={{
                  ...styles.downloadButton,
                  opacity: saveLoading ? 0.55 : 1,
                  cursor: saveLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {saveLoading ? 'Saving...' : 'Save version'}
              </button>
            )}

            {savedMessage && <div style={styles.successBanner}>{savedMessage}</div>}

            {savedBuilds.length > 0 && (
              <section style={styles.panel}>
                <div style={styles.panelHeader}>
                  <span style={styles.panelKicker}>↺</span>
                  <div>
                    <h2 style={styles.panelTitle}>Saved versions</h2>
                    <p style={styles.panelCopy}>Restore a previous portfolio draft.</p>
                  </div>
                </div>
                <div style={styles.savedList}>
                  {savedBuilds.map((build) => (
                    <button key={build.id} type="button" onClick={() => restoreBuild(build)} style={styles.savedItem}>
                      <span style={styles.savedTitle}>{build.title}</span>
                      <span style={styles.savedMeta}>
                        {build.template} · {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(build.updatedAt))}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </aside>

          <section style={styles.previewColumn}>
            {loading && (
              <div style={styles.progressCard}>
                <ThinkingProgress steps={websiteSteps} activeIndex={websiteActiveIndex} variant="card" />
              </div>
            )}

            {html && (
              <div style={styles.editorPanel}>
                <div style={styles.editorHeader}>
                  <div>
                    <h2 style={styles.panelTitle}>Edit with AI</h2>
                    <p style={styles.panelCopy}>Ask for section rewrites, layout changes, animation polish, or stronger CTAs.</p>
                  </div>
                  {editLoading && <ThinkingProgress steps={editSteps} activeIndex={editActiveIndex} variant="inline" />}
                </div>
                <div style={styles.suggestionRow}>
                  {EDIT_SUGGESTIONS.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => setEditMessage(suggestion)} style={styles.suggestionChip}>
                      {suggestion}
                    </button>
                  ))}
                </div>
                <div style={styles.editRow}>
                  <textarea
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        applyEdit();
                      }
                    }}
                    placeholder="Example: Rewrite the hero for a senior frontend role and make the project cards more editorial."
                    style={styles.textarea}
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={applyEdit}
                    disabled={editLoading || !editMessage.trim()}
                    style={{
                      ...styles.applyButton,
                      opacity: editLoading || !editMessage.trim() ? 0.45 : 1,
                      cursor: editLoading || !editMessage.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {editLoading ? 'Applying...' : 'Apply edit'}
                  </button>
                </div>
              </div>
            )}

            <div style={styles.previewChrome}>
              <div style={styles.previewHeader}>
                <div style={styles.windowDots}>
                  <span style={{ ...styles.dot, background: '#ef4444' }} />
                  <span style={{ ...styles.dot, background: '#f59e0b' }} />
                  <span style={{ ...styles.dot, background: '#22c55e' }} />
                </div>
                <span style={styles.previewUrl}>gitskins.dev/{username}</span>
                <span style={{ ...styles.previewBadge, borderColor: selectedTemplateDetails.accent, color: selectedTemplateDetails.accent }}>
                  {selectedTemplateDetails.name}
                </span>
              </div>
              <div style={styles.previewStage}>
                {previewDoc ? (
                  <iframe
                    title="Portfolio preview"
                    srcDoc={previewDoc}
                    style={{
                      width: previewWidths[previewMode],
                      maxWidth: '100%',
                      height: 'clamp(520px, 72vh, 860px)',
                      border: 'none',
                      borderRadius: previewMode === 'desktop' ? 0 : 24,
                      display: 'block',
                      background: '#000',
                      boxShadow: previewMode === 'desktop' ? 'none' : '0 24px 80px rgba(0,0,0,0.45)',
                      transition: 'width 0.28s ease, border-radius 0.28s ease',
                    }}
                    sandbox=""
                  />
                ) : (
                  <div style={styles.emptyState}>
                    <div style={{ ...styles.emptyOrb, background: selectedTemplateDetails.accent }} />
                    <h2 style={styles.emptyTitle}>Your generated portfolio preview will appear here.</h2>
                    <p style={styles.emptyCopy}>
                      Choose a template and generate a portfolio. You can edit the result with natural language and export it as a ZIP.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function SegmentedControl({
  items,
  value,
  onChange,
}: {
  items: Array<{ id: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div style={styles.segmentWrap}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          style={{
            ...styles.segmentButton,
            ...(value === item.id ? styles.segmentButtonActive : {}),
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at 12% 6%, rgba(34,197,94,0.12), transparent 26%), radial-gradient(circle at 88% 12%, rgba(139,92,246,0.13), transparent 30%), #050505',
    color: '#f7f7f7',
  },
  shell: {
    width: 'min(1480px, 100%)',
    margin: '0 auto',
    padding: '112px 22px 72px',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 28,
  },
  backLink: {
    color: '#9ca3af',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 800,
  },
  topActions: {
    display: 'flex',
    gap: 8,
    padding: 5,
    borderRadius: 999,
    border: '1px solid #202020',
    background: 'rgba(255,255,255,0.04)',
  },
  modeButton: {
    border: 'none',
    borderRadius: 999,
    background: 'transparent',
    color: '#7d7d7d',
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 900,
    textTransform: 'capitalize',
    cursor: 'pointer',
  },
  modeButtonActive: {
    background: '#f5f5f5',
    color: '#050505',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
    gap: 24,
    alignItems: 'end',
    marginBottom: 26,
  },
  eyebrow: {
    display: 'inline-flex',
    marginBottom: 14,
    color: '#4ade80',
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    margin: 0,
    maxWidth: 900,
    fontSize: 'clamp(42px, 6vw, 86px)',
    lineHeight: 0.92,
    letterSpacing: '-0.065em',
    fontWeight: 950,
  },
  subtitle: {
    margin: '18px 0 0',
    maxWidth: 790,
    color: '#a3a3a3',
    fontSize: 17,
    lineHeight: 1.7,
  },
  userForm: {
    padding: 16,
    borderRadius: 20,
    background: 'rgba(255,255,255,0.045)',
    border: '1px solid #222',
  },
  label: {
    display: 'block',
    color: '#777',
    fontSize: 11,
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  userInputRow: {
    display: 'flex',
    gap: 8,
  },
  input: {
    minWidth: 0,
    flex: 1,
    padding: '12px 13px',
    borderRadius: 12,
    border: '1px solid #303030',
    background: '#0b0b0b',
    color: '#fafafa',
    outline: 'none',
  },
  smallButton: {
    border: 'none',
    borderRadius: 12,
    padding: '0 14px',
    background: '#f5f5f5',
    color: '#050505',
    fontWeight: 900,
    cursor: 'pointer',
  },
  errorBanner: {
    marginBottom: 18,
    padding: '13px 16px',
    borderRadius: 14,
    border: '1px solid rgba(239,68,68,0.4)',
    background: 'rgba(239,68,68,0.12)',
    color: '#fca5a5',
    fontSize: 14,
  },
  successBanner: {
    padding: '12px 14px',
    borderRadius: 14,
    border: '1px solid rgba(34,197,94,0.32)',
    background: 'rgba(34,197,94,0.1)',
    color: '#86efac',
    fontSize: 13,
    fontWeight: 850,
  },
  workspace: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 390px), 1fr))',
    gap: 18,
    alignItems: 'start',
  },
  sidebar: {
    display: 'grid',
    gap: 14,
    position: 'sticky',
    top: 94,
  },
  panel: {
    padding: 16,
    borderRadius: 22,
    background: 'rgba(12,12,12,0.92)',
    border: '1px solid #222',
    boxShadow: '0 20px 80px rgba(0,0,0,0.22)',
  },
  panelHeader: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  panelKicker: {
    width: 28,
    height: 28,
    borderRadius: 10,
    display: 'grid',
    placeItems: 'center',
    background: '#f5f5f5',
    color: '#050505',
    fontSize: 12,
    fontWeight: 950,
    flexShrink: 0,
  },
  panelTitle: {
    margin: 0,
    fontSize: 17,
    lineHeight: 1.12,
    letterSpacing: '-0.035em',
  },
  panelCopy: {
    margin: '5px 0 0',
    color: '#888',
    fontSize: 13,
    lineHeight: 1.45,
  },
  templateGrid: {
    display: 'grid',
    gap: 9,
  },
  templateCard: {
    display: 'grid',
    gridTemplateColumns: '18px minmax(0, 1fr)',
    gap: '4px 10px',
    width: '100%',
    textAlign: 'left',
    border: '1px solid #232323',
    borderRadius: 16,
    padding: 13,
    color: '#fafafa',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, transform 0.2s ease, background 0.2s ease',
  },
  templateSwatch: {
    width: 14,
    height: 14,
    borderRadius: 999,
    marginTop: 2,
  },
  templateName: {
    fontSize: 14,
    fontWeight: 950,
  },
  templateBestFor: {
    gridColumn: '2',
    color: '#7d7d7d',
    fontSize: 12,
    fontWeight: 800,
  },
  templateTagline: {
    gridColumn: '2',
    color: '#a3a3a3',
    fontSize: 12,
    lineHeight: 1.45,
  },
  segmentWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  segmentButton: {
    border: '1px solid #2a2a2a',
    borderRadius: 999,
    background: '#101010',
    color: '#999',
    padding: '9px 12px',
    fontSize: 12,
    fontWeight: 900,
    cursor: 'pointer',
  },
  segmentButtonActive: {
    background: '#f5f5f5',
    color: '#050505',
    borderColor: '#f5f5f5',
  },
  generateButton: {
    minHeight: 54,
    border: 'none',
    borderRadius: 16,
    fontSize: 15,
    fontWeight: 950,
    cursor: 'pointer',
    boxShadow: '0 18px 60px rgba(34,197,94,0.12)',
  },
  downloadButton: {
    minHeight: 50,
    border: '1px solid #2a2a2a',
    borderRadius: 16,
    background: '#111',
    color: '#fafafa',
    fontSize: 14,
    fontWeight: 900,
    cursor: 'pointer',
  },
  savedList: {
    display: 'grid',
    gap: 8,
  },
  savedItem: {
    width: '100%',
    display: 'grid',
    gap: 5,
    textAlign: 'left',
    border: '1px solid #242424',
    borderRadius: 14,
    background: '#0e0e0e',
    color: '#fafafa',
    padding: 12,
    cursor: 'pointer',
  },
  savedTitle: {
    fontSize: 13,
    fontWeight: 900,
    lineHeight: 1.25,
  },
  savedMeta: {
    color: '#777',
    fontSize: 11,
    fontWeight: 750,
  },
  previewColumn: {
    display: 'grid',
    gap: 14,
    minWidth: 0,
  },
  progressCard: {
    borderRadius: 20,
    border: '1px solid #222',
    overflow: 'hidden',
  },
  editorPanel: {
    padding: 16,
    borderRadius: 22,
    border: '1px solid #222',
    background: 'rgba(12,12,12,0.92)',
  },
  editorHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 14,
  },
  suggestionRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  suggestionChip: {
    border: '1px solid #2b2b2b',
    borderRadius: 999,
    background: '#111',
    color: '#b4b4b4',
    padding: '8px 12px',
    fontSize: 12,
    fontWeight: 850,
    cursor: 'pointer',
  },
  editRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
    gap: 10,
    alignItems: 'stretch',
  },
  textarea: {
    minHeight: 82,
    resize: 'vertical',
    border: '1px solid #303030',
    borderRadius: 15,
    background: '#090909',
    color: '#fafafa',
    outline: 'none',
    padding: '13px 14px',
    fontFamily: 'inherit',
    fontSize: 14,
    lineHeight: 1.5,
  },
  applyButton: {
    border: 'none',
    borderRadius: 15,
    background: '#f5f5f5',
    color: '#050505',
    fontSize: 14,
    fontWeight: 950,
    cursor: 'pointer',
  },
  previewChrome: {
    border: '1px solid #222',
    borderRadius: 24,
    background: '#0b0b0b',
    overflow: 'hidden',
    boxShadow: '0 30px 110px rgba(0,0,0,0.34)',
  },
  previewHeader: {
    minHeight: 48,
    display: 'grid',
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    alignItems: 'center',
    gap: 12,
    padding: '0 15px',
    borderBottom: '1px solid #202020',
    background: '#111',
  },
  windowDots: {
    display: 'flex',
    gap: 7,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  previewUrl: {
    minWidth: 0,
    color: '#777',
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  previewBadge: {
    border: '1px solid',
    borderRadius: 999,
    padding: '5px 9px',
    fontSize: 11,
    fontWeight: 950,
  },
  previewStage: {
    minHeight: 560,
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #070707, #111)',
    overflow: 'auto',
    padding: 0,
  },
  emptyState: {
    maxWidth: 520,
    padding: 34,
    textAlign: 'center',
  },
  emptyOrb: {
    width: 66,
    height: 66,
    borderRadius: 24,
    margin: '0 auto 20px',
    opacity: 0.95,
    boxShadow: '0 0 80px currentColor',
  },
  emptyTitle: {
    margin: '0 0 10px',
    fontSize: 32,
    lineHeight: 1,
    letterSpacing: '-0.05em',
  },
  emptyCopy: {
    margin: 0,
    color: '#8d8d8d',
    lineHeight: 1.7,
  },
};
