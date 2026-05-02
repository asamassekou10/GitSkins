import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPost } from '../posts';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.hero],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <article>
        <header style={{ maxWidth: 1040, margin: '0 auto', padding: '126px 24px 54px' }}>
          <Link href="/blog" style={{ color: '#22c55e', fontSize: 14, fontWeight: 850, textDecoration: 'none' }}>
            ← All guides
          </Link>
          <div style={{ marginTop: 26, color: '#4ade80', fontSize: 12, fontWeight: 900, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            {post.category} · {post.readTime} · Updated {formatDate(post.updated)}
          </div>
          <h1 style={{ margin: '18px 0 18px', maxWidth: 860, fontSize: 'clamp(42px, 7vw, 78px)', lineHeight: 0.94, letterSpacing: '-0.06em', fontWeight: 950 }}>
            {post.title}
          </h1>
          <p style={{ margin: 0, maxWidth: 760, color: '#a3a3a3', fontSize: 19, lineHeight: 1.7 }}>
            {post.description}
          </p>
        </header>

        <section style={{ maxWidth: 1040, margin: '0 auto', padding: '0 24px 56px' }}>
          <div style={{ borderRadius: 30, border: '1px solid #1d1d1d', background: '#0b0b0b', padding: 18, overflow: 'hidden' }}>
            <img src={post.hero} alt="" style={{ width: '100%', height: 'auto', maxHeight: 560, objectFit: 'contain', borderRadius: 18 }} />
          </div>
        </section>

        <section style={{ maxWidth: 790, margin: '0 auto', padding: '0 24px 78px' }}>
          {post.sections.map((section) => (
            <section key={section.heading} style={{ marginBottom: 48 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.05, letterSpacing: '-0.045em' }}>
                {section.heading}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} style={paragraphStyle}>
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul style={{ margin: '18px 0 0', paddingLeft: 22, color: '#b6b6b6', fontSize: 16, lineHeight: 1.85 }}>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
              {section.cta ? (
                <Link href={section.cta.href} style={{ display: 'inline-flex', marginTop: 22, minHeight: 44, alignItems: 'center', justifyContent: 'center', padding: '12px 16px', borderRadius: 999, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.28)', color: '#4ade80', fontSize: 14, fontWeight: 900, textDecoration: 'none' }}>
                  {section.cta.label} →
                </Link>
              ) : null}
            </section>
          ))}
        </section>
      </article>

      <section style={{ maxWidth: 1040, margin: '0 auto', padding: '0 24px 110px' }}>
        <h2 style={{ margin: '0 0 18px', fontSize: 28, letterSpacing: '-0.04em' }}>Keep improving your profile</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 14 }}>
          {related.map((item) => (
            <Link key={item.slug} href={`/blog/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{ minHeight: 190, border: '1px solid #1d1d1d', borderRadius: 20, background: '#0b0b0b', padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: '#4ade80', fontSize: 11, fontWeight: 900, letterSpacing: 0.5, textTransform: 'uppercase' }}>{item.category}</div>
                  <h3 style={{ margin: '12px 0 0', fontSize: 20, lineHeight: 1.12, letterSpacing: '-0.035em' }}>{item.title}</h3>
                </div>
                <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 850 }}>Read next →</span>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

const paragraphStyle: CSSProperties = {
  margin: '0 0 16px',
  color: '#b3b3b3',
  fontSize: 17,
  lineHeight: 1.82,
};
