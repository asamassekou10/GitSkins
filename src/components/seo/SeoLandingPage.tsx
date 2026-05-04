import Link from 'next/link';
import type { CSSProperties } from 'react';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import type { SeoLandingPageContent } from '@/lib/seo-content/landing-pages';

interface SeoLandingPageProps {
  content: SeoLandingPageContent;
}

export function SeoLandingPage({ content }: SeoLandingPageProps) {
  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: content.title, path: `/${content.slug}` }])} />
      <JsonLd data={faqJsonLd(content.faqs)} />

      <section style={{ padding: '132px 24px 78px', borderBottom: '1px solid #121212', background: 'radial-gradient(circle at 78% 16%, rgba(34,197,94,0.18), transparent 34%), #050505' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(280px, 430px)', gap: 44, alignItems: 'center' }} className="seo-hero">
          <div>
            <div style={{ color: '#4ade80', fontSize: 12, fontWeight: 900, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 16 }}>
              {content.eyebrow}
            </div>
            <h1 style={{ margin: '0 0 20px', fontSize: 'clamp(42px, 7vw, 82px)', lineHeight: 0.92, letterSpacing: '-0.06em', fontWeight: 950 }}>
              {content.heroTitle}
            </h1>
            <p style={{ margin: '0 0 30px', color: '#a3a3a3', fontSize: 18, lineHeight: 1.75, maxWidth: 710 }}>
              {content.heroCopy}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={content.primaryCta.href} style={primaryButton}>
                {content.primaryCta.label}
              </Link>
              <Link href={content.secondaryCta.href} style={secondaryButton}>
                {content.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div style={{ borderRadius: 30, padding: 16, background: 'linear-gradient(145deg, rgba(34,197,94,0.14), rgba(255,255,255,0.04))', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 120px rgba(0,0,0,0.45)' }}>
            <img src={content.preview.src} alt={content.preview.alt} style={{ width: '100%', height: 'auto', borderRadius: 20, display: 'block' }} />
          </div>
        </div>
      </section>

      <section style={{ padding: '74px 24px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <h2 style={sectionTitle}>Why developers use it</h2>
          <div style={cardGrid}>
            {content.benefits.map((benefit) => (
              <article key={benefit.title} style={cardStyle}>
                <h3 style={cardTitle}>{benefit.title}</h3>
                <p style={cardCopy}>{benefit.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '74px 24px', borderBottom: '1px solid #111', background: '#080808' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <h2 style={sectionTitle}>How it works</h2>
          <div style={{ display: 'grid', gap: 14 }}>
            {content.steps.map((step, index) => (
              <article key={step.title} style={{ ...cardStyle, display: 'grid', gridTemplateColumns: '48px minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: '#22c55e', color: '#050505', display: 'grid', placeItems: 'center', fontWeight: 950 }}>
                  {index + 1}
                </div>
                <div>
                  <h3 style={cardTitle}>{step.title}</h3>
                  <p style={cardCopy}>{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '74px 24px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <h2 style={sectionTitle}>Useful next reads</h2>
          <div style={cardGrid}>
            {content.examples.map((example) => (
              <Link key={example.title} href={example.href} style={{ ...cardStyle, textDecoration: 'none', color: 'inherit' }}>
                <h3 style={cardTitle}>{example.title}</h3>
                <p style={cardCopy}>{example.copy}</p>
                <span style={{ display: 'inline-flex', marginTop: 16, color: '#4ade80', fontSize: 13, fontWeight: 900 }}>
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '74px 24px 112px', background: '#080808' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <h2 style={sectionTitle}>Questions people ask</h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {content.faqs.map((faq) => (
              <article key={faq.question} style={cardStyle}>
                <h3 style={cardTitle}>{faq.question}</h3>
                <p style={cardCopy}>{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .seo-hero {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

const primaryButton: CSSProperties = {
  display: 'inline-flex',
  minHeight: 48,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '13px 18px',
  borderRadius: 12,
  background: '#22c55e',
  color: '#050505',
  textDecoration: 'none',
  fontWeight: 900,
};

const secondaryButton: CSSProperties = {
  ...primaryButton,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid #2a2a2a',
  color: '#fafafa',
};

const sectionTitle: CSSProperties = {
  margin: '0 0 24px',
  fontSize: 'clamp(30px, 5vw, 52px)',
  lineHeight: 1,
  letterSpacing: '-0.045em',
  fontWeight: 950,
};

const cardGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
  gap: 16,
};

const cardStyle: CSSProperties = {
  padding: 22,
  borderRadius: 22,
  background: '#0b0b0b',
  border: '1px solid #1f1f1f',
};

const cardTitle: CSSProperties = {
  margin: '0 0 10px',
  fontSize: 20,
  lineHeight: 1.12,
  letterSpacing: '-0.03em',
};

const cardCopy: CSSProperties = {
  margin: 0,
  color: '#a1a1a1',
  fontSize: 15,
  lineHeight: 1.72,
};
