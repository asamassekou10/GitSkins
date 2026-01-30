'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navigation } from '@/components/landing/Navigation';

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

export default function PortfolioPage() {
  const params = useParams();
  const rawUsername = params.username as string;
  const username = rawUsername.startsWith('@') ? rawUsername.slice(1) : rawUsername;

  const [caseStudies, setCaseStudies] = useState<PortfolioCaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/ai/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load portfolio');
        }
        setCaseStudies(data.caseStudies || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [username]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <Navigation />

      <main style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 800, marginBottom: '12px' }}>
              AI Portfolio for @{username}
            </h1>
            <p style={{ color: '#888', fontSize: '18px', marginBottom: '24px' }}>
              Gemini-generated case studies highlighting your most impactful work.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href={`/showcase/${username}`}
                style={{
                  padding: '10px 20px',
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '10px',
                  color: '#888',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                View Showcase
              </Link>
              <Link
                href={`/portfolio/${username}/build`}
                style={{
                  padding: '10px 20px',
                  background: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '10px',
                  color: '#888',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Build website
              </Link>
              <Link
                href="/readme-generator"
                style={{
                  padding: '10px 20px',
                  background: '#22c55e',
                  borderRadius: '10px',
                  color: '#000',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Generate README
              </Link>
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', color: '#888' }}>Building portfolio…</div>
          )}
          {error && (
            <div style={{ textAlign: 'center', color: '#ef4444' }}>{error}</div>
          )}

          {!loading && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {caseStudies.map((caseStudy, index) => (
                <div key={`${caseStudy.repo}-${index}`} style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: '18px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 700 }}>{caseStudy.title}</div>
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
      </main>
    </div>
  );
}
