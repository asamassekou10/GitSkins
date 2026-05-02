import Link from 'next/link';
import type { CSSProperties } from 'react';
import { blogPosts } from './posts';

export default function BlogIndexPage() {
  const featured = blogPosts[0];
  const remaining = blogPosts.slice(1);

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '126px 24px 64px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.24)', color: '#4ade80', fontSize: 12, fontWeight: 850, letterSpacing: 0.4, marginBottom: 22 }}>
          Guides
        </div>
        <h1 style={{ margin: '0 0 18px', maxWidth: 760, fontSize: 'clamp(44px, 7vw, 78px)', lineHeight: 0.94, letterSpacing: '-0.06em', fontWeight: 950 }}>
          Practical ways to improve your GitHub profile.
        </h1>
        <p style={{ margin: 0, maxWidth: 680, color: '#9f9f9f', fontSize: 18, lineHeight: 1.7 }}>
          Professional guides on README structure, profile cards, developer avatars, and visual polish. Written to help, not to pad the sitemap.
        </p>
      </section>

      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 96px' }}>
        <Link href={`/blog/${featured.slug}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 18, alignItems: 'stretch', textDecoration: 'none', color: 'inherit', marginBottom: 18 }}>
          <article style={{ border: '1px solid rgba(34,197,94,0.28)', borderRadius: 30, padding: 28, background: 'linear-gradient(145deg, rgba(34,197,94,0.12), #0b0b0b 42%)', minHeight: 360, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={metaStyle}>{featured.category} · {featured.readTime}</div>
              <h2 style={{ margin: '16px 0 14px', fontSize: 'clamp(32px, 4vw, 50px)', lineHeight: 1, letterSpacing: '-0.05em' }}>
                {featured.title}
              </h2>
              <p style={{ margin: 0, color: '#a1a1a1', fontSize: 16, lineHeight: 1.7 }}>{featured.description}</p>
            </div>
            <span style={{ color: '#22c55e', fontSize: 14, fontWeight: 900 }}>Read guide →</span>
          </article>
          <div style={{ border: '1px solid #1d1d1d', borderRadius: 30, padding: 18, background: '#0b0b0b', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
            <img src={featured.hero} alt="" style={{ width: '100%', maxWidth: 650, height: 'auto', borderRadius: 18 }} />
          </div>
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 18 }}>
          {remaining.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{ height: '100%', border: '1px solid #1d1d1d', borderRadius: 24, background: '#0b0b0b', padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 260 }}>
                <div>
                  <div style={metaStyle}>{post.category} · {post.readTime}</div>
                  <h2 style={{ margin: '14px 0 10px', fontSize: 25, lineHeight: 1.08, letterSpacing: '-0.04em' }}>{post.title}</h2>
                  <p style={{ margin: 0, color: '#8f8f8f', fontSize: 14, lineHeight: 1.6 }}>{post.description}</p>
                </div>
                <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 900, marginTop: 22 }}>Read article →</span>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

const metaStyle: CSSProperties = {
  color: '#4ade80',
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.5,
  textTransform: 'uppercase',
};
