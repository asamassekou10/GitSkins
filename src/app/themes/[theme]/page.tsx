import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { landingThemes } from '@/lib/landing-themes';
import { getPremiumTheme, premiumThemeExists } from '@/registry/themes/premium-registry';
import type { PremiumThemeName } from '@/types/premium-theme';

interface ThemePageProps {
  params: Promise<{ theme: string }>;
}

export function generateStaticParams() {
  return landingThemes.map((theme) => ({ theme: theme.id }));
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { theme } = await params;
  const meta = landingThemes.find((item) => item.id === theme);
  if (!meta) return {};

  return {
    title: `${meta.name} GitHub Profile Theme | GitSkins`,
    description: `Preview the ${meta.name} GitSkins theme across profile cards, stats, languages, avatars, README assets, and hosted profile skins.`,
  };
}

const surfaces = [
  { title: 'Premium Card', path: '/api/premium-card', params: '&variant=persona&avatar=persona', ratio: '1200 / 630' },
  { title: 'Stats', path: '/api/stats', params: '', ratio: '600 / 240' },
  { title: 'Languages', path: '/api/languages', params: '', ratio: '600 / 260' },
  { title: 'Streak', path: '/api/streak', params: '', ratio: '600 / 260' },
] as const;

function assetUrl(path: string, theme: string, params = '') {
  return `${path}?username=octocat&theme=${theme}${params}`;
}

export default async function ThemeDetailPage({ params }: ThemePageProps) {
  const { theme } = await params;
  if (!premiumThemeExists(theme)) notFound();

  const themeName = theme as PremiumThemeName;
  const meta = landingThemes.find((item) => item.id === themeName);
  const premium = getPremiumTheme(themeName);
  if (!meta) notFound();

  const colors = [
    ['Background', premium.colors.bg],
    ['Card', premium.colors.cardBg],
    ['Border', premium.colors.border],
    ['Primary', premium.colors.primary],
    ['Secondary', premium.colors.secondary],
    ['Accent', premium.colors.accent],
    ['Ring', premium.colors.ring],
  ];

  return (
    <main style={{ minHeight: '100vh', background: premium.colors.bg, color: premium.colors.primary, overflow: 'hidden' }}>
      <section style={{ position: 'relative', padding: '120px 24px 56px', borderBottom: `1px solid ${premium.colors.border}` }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 74% 12%, ${premium.colors.accent}26, transparent 34%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto' }}>
          <Link href="/themes" style={{ color: premium.colors.secondary, textDecoration: 'none', fontSize: 14, fontWeight: 750 }}>
            ← Theme catalog
          </Link>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 38, alignItems: 'end', marginTop: 28 }} className="theme-hero">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: `${premium.colors.accent}14`, border: `1px solid ${premium.colors.accent}34`, color: premium.colors.accent, fontSize: 12, fontWeight: 850, letterSpacing: 0.4, marginBottom: 18 }}>
                {meta.free ? 'Free theme' : 'Pro theme'} · {meta.category}
              </div>
              <h1 style={{ margin: '0 0 16px', fontSize: 'clamp(42px, 7vw, 88px)', lineHeight: 0.88, letterSpacing: '-0.06em' }}>
                {premium.label}
              </h1>
              <p style={{ color: premium.colors.secondary, fontSize: 18, lineHeight: 1.7, margin: 0, maxWidth: 700 }}>
                {meta.description}. A complete GitSkins identity system for cards, avatars, README motion, hosted profile skins, and local browser profile previews.
              </p>
            </div>
            <div style={{ padding: 18, borderRadius: 26, background: premium.colors.cardBg, border: `1px solid ${premium.colors.border}`, boxShadow: premium.effects.cardShadow ?? `0 28px 90px ${premium.colors.accent}22` }}>
              <img
                src={`/api/avatar?username=octocat&family=character&theme=${themeName}&size=400`}
                alt={`${premium.label} avatar`}
                style={{ width: '100%', borderRadius: 22, display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '42px 24px 96px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gap: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 14 }}>
            {colors.map(([label, color]) => (
              <div key={label} style={{ padding: 16, borderRadius: 18, background: premium.colors.cardBg, border: `1px solid ${premium.colors.border}` }}>
                <div style={{ width: '100%', height: 54, borderRadius: 14, background: color, marginBottom: 12, border: `1px solid ${premium.colors.border}` }} />
                <div style={{ color: premium.colors.primary, fontSize: 14, fontWeight: 850 }}>{label}</div>
                <div style={{ color: premium.colors.secondary, fontSize: 12, marginTop: 3, wordBreak: 'break-all' }}>{color}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 20 }} className="theme-preview-grid">
            <div style={{ padding: 18, borderRadius: 24, background: premium.colors.cardBg, border: `1px solid ${premium.colors.border}` }}>
              <img
                src={assetUrl('/api/premium-card', themeName, '&variant=persona&avatar=persona')}
                alt={`${premium.label} premium card`}
                style={{ width: '100%', borderRadius: 18, display: 'block', boxShadow: premium.effects.cardShadow }}
              />
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              <Link href={`/showcase/octocat?skin=${themeName === 'matrix' ? 'cyber' : themeName === 'satan' ? 'inferno' : themeName === 'winter' ? 'frosted' : 'studio'}`} style={{ minHeight: 150, padding: 22, borderRadius: 24, background: premium.colors.cardBg, border: `1px solid ${premium.colors.border}`, color: premium.colors.primary, textDecoration: 'none' }}>
                <div style={{ color: premium.colors.accent, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>Hosted profile skin</div>
                <h2 style={{ margin: '0 0 8px', fontSize: 28, letterSpacing: '-0.04em' }}>See it as a full profile page.</h2>
                <p style={{ margin: 0, color: premium.colors.secondary, lineHeight: 1.55 }}>Preview how this visual direction carries into a shareable GitSkins profile skin.</p>
              </Link>
              <Link href={`/readme-generator?theme=${themeName}`} style={{ minHeight: 150, padding: 22, borderRadius: 24, background: premium.colors.cardBg, border: `1px solid ${premium.colors.border}`, color: premium.colors.primary, textDecoration: 'none' }}>
                <div style={{ color: premium.colors.accent, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 }}>README pack</div>
                <h2 style={{ margin: '0 0 8px', fontSize: 28, letterSpacing: '-0.04em' }}>Generate matching README assets.</h2>
                <p style={{ margin: 0, color: premium.colors.secondary, lineHeight: 1.55 }}>Use the theme across typing headers, cards, dividers, avatars, and profile sections.</p>
              </Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
            {surfaces.slice(1).map((surface) => (
              <div key={surface.title} style={{ padding: 16, borderRadius: 22, background: premium.colors.cardBg, border: `1px solid ${premium.colors.border}` }}>
                <div style={{ color: premium.colors.secondary, fontSize: 12, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 1.1, marginBottom: 10 }}>{surface.title}</div>
                <img
                  src={assetUrl(surface.path, themeName, surface.params)}
                  alt={`${premium.label} ${surface.title}`}
                  loading="lazy"
                  style={{ width: '100%', aspectRatio: surface.ratio, objectFit: 'contain', borderRadius: 14, display: 'block' }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', paddingTop: 12 }}>
            <Link href="/pricing" style={{ padding: '14px 20px', borderRadius: 13, background: premium.colors.accent, color: '#050505', textDecoration: 'none', fontWeight: 900 }}>
              Unlock full theme system
            </Link>
            <Link href="/extension" style={{ padding: '14px 20px', borderRadius: 13, background: premium.colors.cardBg, border: `1px solid ${premium.colors.border}`, color: premium.colors.primary, textDecoration: 'none', fontWeight: 850 }}>
              Use in browser extension
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 920px) {
          .theme-hero,
          .theme-preview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
