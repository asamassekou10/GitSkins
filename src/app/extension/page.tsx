import Link from 'next/link';
import { CHROME_WEB_STORE_URL } from '@/config/external-links';

const steps = [
  'Install GitSkins from the Chrome Web Store.',
  'Open any GitHub profile.',
  'Use the GitSkins action bar to create cards, avatars, README blocks, and profile skins.',
];

const features = [
  {
    title: 'GitHub profile action bar',
    copy: 'Open GitSkins tools directly from a GitHub profile without copy-pasting usernames.',
  },
  {
    title: 'One-click markdown',
    copy: 'Copy a premium card or profile skin README block from the extension popup.',
  },
  {
    title: 'Theme and skin defaults',
    copy: 'Save your preferred card theme and hosted profile skin across browser sessions.',
  },
  {
    title: 'SaaS-backed Pro flow',
    copy: 'The extension stays lightweight while GitSkins handles auth, billing, generation, and Pro gating.',
  },
];

export default function ExtensionPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa', overflow: 'hidden' }}>
      <section style={{ position: 'relative', padding: '120px 24px 84px', borderBottom: '1px solid #111' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 12%, rgba(34,197,94,0.22), transparent 34%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 48, alignItems: 'center' }} className="extension-hero">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.24)', color: '#4ade80', fontSize: 12, fontWeight: 850, letterSpacing: 0.4, marginBottom: 18 }}>
              Browser extension
            </div>
            <h1 style={{ margin: '0 0 20px', fontSize: 'clamp(42px, 7vw, 86px)', lineHeight: 0.9, letterSpacing: '-0.06em', maxWidth: 790 }}>
              Bring GitSkins into GitHub.
            </h1>
            <p style={{ margin: '0 0 30px', color: '#a1a1a1', fontSize: 18, lineHeight: 1.7, maxWidth: 650 }}>
              The GitSkins extension is now live on the Chrome Web Store. Add profile cards, avatar links, README actions, and hosted profile skin previews directly where developers already work: GitHub profile pages.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href={CHROME_WEB_STORE_URL} target="_blank" rel="noreferrer" style={{ padding: '14px 20px', borderRadius: 13, background: '#22c55e', color: '#050505', textDecoration: 'none', fontWeight: 900 }}>
                Install from Chrome Web Store
              </a>
              <Link href="/showcase/octocat?skin=studio" style={{ padding: '14px 20px', borderRadius: 13, background: '#101010', border: '1px solid #252525', color: '#fafafa', textDecoration: 'none', fontWeight: 850 }}>
                Preview a profile skin
              </Link>
              <a href="https://github.com/asamassekou10/GitSkins/tree/main/extension" target="_blank" rel="noreferrer" style={{ padding: '14px 20px', borderRadius: 13, background: '#101010', border: '1px solid #252525', color: '#fafafa', textDecoration: 'none', fontWeight: 850 }}>
                View extension source
              </a>
            </div>
          </div>

          <div style={{ borderRadius: 28, padding: 18, background: 'linear-gradient(145deg, rgba(34,197,94,0.16), rgba(255,255,255,0.04))', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 30px 100px rgba(0,0,0,0.42)' }}>
            <div style={{ borderRadius: 22, background: '#080808', border: '1px solid #242424', padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, display: 'grid', placeItems: 'center', background: '#22c55e', color: '#050505', fontWeight: 950, fontSize: 20 }}>G</div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>GitSkins</div>
                  <div style={{ color: '#777', fontSize: 12 }}>Detected @octocat</div>
                </div>
              </div>
              {['GitHub username', 'Theme', 'Profile skin'].map((label, index) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ color: '#888', fontSize: 11, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7 }}>{label}</div>
                  <div style={{ height: 42, borderRadius: 12, border: '1px solid #242424', background: '#101010', display: 'flex', alignItems: 'center', padding: '0 12px', color: '#fafafa', fontWeight: 800 }}>
                    {index === 0 ? 'octocat' : index === 1 ? 'Studio' : 'Studio skin'}
                  </div>
                </div>
              ))}
              <div style={{ display: 'grid', gap: 9, marginTop: 16 }}>
                <div style={{ height: 40, borderRadius: 12, background: '#22c55e', color: '#050505', display: 'grid', placeItems: 'center', fontWeight: 900 }}>Copy card markdown</div>
                <div style={{ height: 40, borderRadius: 12, background: '#111', border: '1px solid #242424', display: 'grid', placeItems: 'center', fontWeight: 850 }}>Open profile skin</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '76px 24px', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(30px, 5vw, 56px)', lineHeight: 1, letterSpacing: '-0.045em', margin: '0 0 28px' }}>
            Built for the GitHub workflow.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 16 }}>
            {features.map((feature) => (
              <div key={feature.title} style={{ minHeight: 190, padding: 22, borderRadius: 22, background: '#0b0b0b', border: '1px solid #1e1e1e' }}>
                <h3 style={{ margin: '0 0 10px', fontSize: 20, letterSpacing: '-0.02em' }}>{feature.title}</h3>
                <p style={{ margin: 0, color: '#888', fontSize: 14, lineHeight: 1.65 }}>{feature.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '76px 24px' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', padding: 28, borderRadius: 26, background: '#0b0b0b', border: '1px solid #1f1f1f' }}>
          <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 12 }}>
            Chrome Web Store
          </div>
          <h2 style={{ margin: '0 0 18px', fontSize: 34, letterSpacing: '-0.04em' }}>Install it in a few clicks.</h2>
          <ol style={{ margin: 0, paddingLeft: 20, color: '#a1a1a1', lineHeight: 1.9 }}>
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <a href={CHROME_WEB_STORE_URL} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', marginTop: 22, padding: '13px 18px', borderRadius: 12, background: '#22c55e', color: '#050505', textDecoration: 'none', fontWeight: 900 }}>
            Open Chrome Web Store listing
          </a>
          <p style={{ color: '#666', fontSize: 13, lineHeight: 1.7, margin: '20px 0 0' }}>
            The extension helps you create and publish GitSkins assets. It does not permanently modify how your GitHub profile appears to other visitors.
          </p>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .extension-hero {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
