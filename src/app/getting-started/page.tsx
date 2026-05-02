'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { analytics } from '@/components/AnalyticsProvider';

const guideSteps = [
  {
    title: 'Start with one clear profile card',
    copy: 'Use a card as the visual anchor of your README. Pick a theme that matches the tone of your GitHub profile, portfolio, or personal site.',
    href: '/cards',
    label: 'Open Card Studio',
  },
  {
    title: 'Pair it with a themed avatar',
    copy: 'Create a matching profile picture or project persona so the card, README, and avatar feel like one cohesive identity.',
    href: '/avatar',
    label: 'Create an avatar',
  },
  {
    title: 'Add only the widgets that help',
    copy: 'Stats, languages, and streak cards work best when they support your story. Avoid stacking every widget just because it exists.',
    href: '/examples',
    label: 'View examples',
  },
  {
    title: 'Paste the Markdown into your profile repo',
    copy: 'Your profile repository must be named exactly like your GitHub username. Add the copied Markdown to its README.md file.',
    href: '/blog/how-to-make-github-profile-stand-out',
    label: 'Read the profile guide',
  },
];

const widgets = [
  {
    id: 'profile-card',
    name: 'Profile Card',
    description: 'Best first embed for a polished README header.',
    preview: '/api/premium-card?username=octocat&theme=github-dark&variant=glass&avatar=persona',
    markdown: '![GitHub Profile Card](https://gitskins.com/api/premium-card?username=YOUR_USERNAME&theme=github-dark&variant=glass&avatar=persona)',
  },
  {
    id: 'stats',
    name: 'Stats',
    description: 'A compact snapshot of repos, stars, followers, and contributions.',
    preview: '/api/stats?username=octocat&theme=github-dark',
    markdown: '![GitHub Stats](https://gitskins.com/api/stats?username=YOUR_USERNAME&theme=github-dark)',
  },
  {
    id: 'languages',
    name: 'Languages',
    description: 'Show your strongest languages without overwhelming the page.',
    preview: '/api/languages?username=octocat&theme=github-dark',
    markdown: '![Top Languages](https://gitskins.com/api/languages?username=YOUR_USERNAME&theme=github-dark)',
  },
  {
    id: 'streak',
    name: 'Streak',
    description: 'A focused activity card for builders who commit consistently.',
    preview: '/api/streak?username=octocat&theme=github-dark',
    markdown: '![GitHub Streak](https://gitskins.com/api/streak?username=YOUR_USERNAME&theme=github-dark)',
  },
];

const mistakes = [
  'The profile repository name does not exactly match your GitHub username.',
  'The image URL still contains YOUR_USERNAME instead of your real username.',
  'Too many widgets are competing for attention above your project links.',
  'GitHub cached an older image. Wait a few minutes, then refresh the README.',
];

export default function GettingStartedPage() {
  const [selectedWidget, setSelectedWidget] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const selected = widgets[selectedWidget];
  const previewUrl = useMemo(() => selected.preview, [selected.preview]);

  const copyMarkdown = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
      analytics.track('getting_started_embed_copied', { widget: id });
      analytics.trackConversion('markdown_copied', { source: 'getting_started', widget: id });
    } catch (error) {
      console.error('Failed to copy Markdown:', error);
    }
  };

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#f7f7f7', overflow: 'hidden' }}>
      <section style={{ position: 'relative', padding: '128px 24px 74px' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-20% -10% auto',
            height: 520,
            background: 'radial-gradient(circle at 20% 30%, rgba(34,197,94,0.22), transparent 34%), radial-gradient(circle at 80% 10%, rgba(56,189,248,0.18), transparent 32%)',
            filter: 'blur(12px)',
            opacity: 0.9,
          }}
        />

        <div style={{ position: 'relative', maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 390px), 1fr))', gap: 38, alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.11)', border: '1px solid rgba(34,197,94,0.28)', color: '#4ade80', fontSize: 12, fontWeight: 850, letterSpacing: 0.4, marginBottom: 22 }}>
              Launch guide
            </div>
            <h1 style={{ margin: '0 0 20px', fontSize: 'clamp(42px, 7vw, 78px)', lineHeight: 0.92, letterSpacing: '-0.06em', fontWeight: 950, maxWidth: 780 }}>
              Build a profile kit that looks intentional.
            </h1>
            <p style={{ margin: '0 0 30px', color: '#a3a3a3', fontSize: 18, lineHeight: 1.7, maxWidth: 660 }}>
              Create a GitHub card, match it with a themed avatar, copy the right embeds, and ship a README that feels designed instead of assembled.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link href="/cards" style={primaryButton}>
                Start with a card
              </Link>
              <Link href="/examples" style={secondaryButton}>
                Browse examples
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 30,
              padding: 18,
              background: 'linear-gradient(145deg, rgba(18,18,18,0.94), rgba(8,8,8,0.86))',
              boxShadow: '0 28px 100px rgba(0,0,0,0.45)',
            }}
          >
            <div style={{ borderRadius: 22, overflow: 'hidden', background: '#0a0a0a', border: '1px solid #202020' }}>
              <img src="/api/premium-card?username=octocat&theme=github-dark&variant=glass&avatar=persona" alt="GitSkins profile card preview" style={{ display: 'block', width: '100%', height: 'auto' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12 }}>
              {['/api/avatar?username=octocat&family=character&character=terminal-mage&theme=github-dark&size=200', '/api/stats?username=octocat&theme=github-dark', '/api/languages?username=octocat&theme=github-dark'].map((src) => (
                <div key={src} style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #1f1f1f', background: '#090909', minHeight: 82, display: 'grid', placeItems: 'center' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '24px 24px 72px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 14 }}>
          {guideSteps.map((step, index) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.45, delay: index * 0.05 }} style={stepCard}>
              <div style={{ width: 36, height: 36, borderRadius: 12, display: 'grid', placeItems: 'center', background: '#141414', border: '1px solid #252525', color: '#22c55e', fontWeight: 900, marginBottom: 18 }}>
                {index + 1}
              </div>
              <h2 style={{ margin: '0 0 10px', fontSize: 21, letterSpacing: '-0.03em' }}>{step.title}</h2>
              <p style={{ margin: '0 0 20px', color: '#8a8a8a', fontSize: 14, lineHeight: 1.62 }}>{step.copy}</p>
              <Link href={step.href} style={{ color: '#22c55e', fontSize: 13, fontWeight: 850, textDecoration: 'none' }}>
                {step.label} →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px 82px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 18, alignItems: 'stretch' }}>
          <div style={{ ...panelStyle, padding: 24 }}>
            <p style={eyebrow}>Copy-ready embeds</p>
            <h2 style={{ margin: '0 0 14px', fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 1, letterSpacing: '-0.05em' }}>
              Pick the widget that serves the story.
            </h2>
            <p style={{ margin: '0 0 24px', color: '#9a9a9a', lineHeight: 1.65 }}>
              Start with the card, then add one or two supporting widgets. A profile that is easy to scan usually converts better than a wall of badges.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {widgets.map((widget, index) => (
                <button key={widget.id} type="button" onClick={() => setSelectedWidget(index)} style={{ ...widgetButton, borderColor: selectedWidget === index ? 'rgba(34,197,94,0.72)' : '#242424', background: selectedWidget === index ? 'rgba(34,197,94,0.09)' : '#0d0d0d' }}>
                  <span style={{ fontWeight: 850, color: '#fff' }}>{widget.name}</span>
                  <span style={{ color: '#858585', fontSize: 13, lineHeight: 1.45 }}>{widget.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ ...panelStyle, padding: 18 }}>
            <div style={{ borderRadius: 20, border: '1px solid #202020', background: '#080808', overflow: 'hidden', minHeight: 250, display: 'grid', placeItems: 'center', padding: 16 }}>
              <img src={previewUrl} alt={`${selected.name} preview`} style={{ maxWidth: '100%', width: selected.id === 'languages' ? 450 : 620, height: 'auto', borderRadius: selected.id === 'profile-card' ? 16 : 0 }} />
            </div>
            <div style={{ marginTop: 14, borderRadius: 18, border: '1px solid #202020', background: '#0a0a0a', padding: 16, position: 'relative' }}>
              <code style={{ display: 'block', color: '#d4d4d4', fontSize: 13, lineHeight: 1.65, wordBreak: 'break-all', paddingRight: 88 }}>
                {selected.markdown}
              </code>
              <button type="button" onClick={() => copyMarkdown(selected.markdown, selected.id)} style={{ ...copyButton, background: copied === selected.id ? '#15803d' : '#181818' }}>
                {copied === selected.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px 82px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 18 }}>
          <div style={{ ...panelStyle, padding: 26 }}>
            <p style={eyebrow}>Free plan</p>
            <h2 style={{ margin: '0 0 12px', fontSize: 30, letterSpacing: '-0.04em' }}>Build the foundation.</h2>
            <ul style={listStyle}>
              <li>Core cards and original themes</li>
              <li>Limited README generations</li>
              <li>Public widget embeds</li>
            </ul>
          </div>
          <div style={{ ...panelStyle, padding: 26, borderColor: 'rgba(34,197,94,0.34)', background: 'linear-gradient(145deg, rgba(34,197,94,0.11), #0b0b0b 38%)' }}>
            <p style={eyebrow}>Pro plan</p>
            <h2 style={{ margin: '0 0 12px', fontSize: 30, letterSpacing: '-0.04em' }}>Unlock the full kit.</h2>
            <ul style={listStyle}>
              <li>All premium themes and avatar styles</li>
              <li>AI profile tools and project personas</li>
              <li>Unlimited README generations</li>
            </ul>
            <Link href="/pricing" style={{ ...primaryButton, marginTop: 18, padding: '12px 16px', fontSize: 14 }}>
              Compare plans
            </Link>
          </div>
          <div style={{ ...panelStyle, padding: 26 }}>
            <p style={eyebrow}>Checklist</p>
            <h2 style={{ margin: '0 0 12px', fontSize: 30, letterSpacing: '-0.04em' }}>Avoid the usual README issues.</h2>
            <ul style={listStyle}>
              {mistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 110px', textAlign: 'center' }}>
        <div style={{ borderRadius: 34, border: '1px solid rgba(34,197,94,0.28)', background: 'radial-gradient(circle at 50% 0%, rgba(34,197,94,0.18), transparent 42%), #0a0a0a', padding: '48px 24px' }}>
          <h2 style={{ margin: '0 auto 14px', maxWidth: 700, fontSize: 'clamp(32px, 5vw, 54px)', lineHeight: 1, letterSpacing: '-0.055em' }}>
            Create the profile kit people remember.
          </h2>
          <p style={{ margin: '0 auto 26px', color: '#989898', fontSize: 16, lineHeight: 1.65, maxWidth: 620 }}>
            Start with a card, match the avatar, then use the guide to keep your README sharp and focused.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/cards" style={primaryButton}>Create a card</Link>
            <Link href="/avatar" style={secondaryButton}>Make an avatar</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const primaryButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 48,
  padding: '14px 20px',
  borderRadius: 999,
  background: '#22c55e',
  color: '#031007',
  fontSize: 15,
  fontWeight: 900,
  textDecoration: 'none',
  boxShadow: '0 16px 42px rgba(34,197,94,0.24)',
};

const secondaryButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 48,
  padding: '14px 20px',
  borderRadius: 999,
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#f5f5f5',
  fontSize: 15,
  fontWeight: 850,
  textDecoration: 'none',
};

const panelStyle: CSSProperties = {
  borderRadius: 28,
  border: '1px solid #1d1d1d',
  background: 'rgba(12,12,12,0.92)',
  boxShadow: '0 24px 80px rgba(0,0,0,0.24)',
};

const stepCard: CSSProperties = {
  minHeight: 245,
  padding: 22,
  borderRadius: 24,
  border: '1px solid #1d1d1d',
  background: '#0b0b0b',
};

const eyebrow: CSSProperties = {
  margin: '0 0 14px',
  color: '#4ade80',
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 0.6,
  textTransform: 'uppercase',
};

const widgetButton: CSSProperties = {
  border: '1px solid #242424',
  borderRadius: 16,
  padding: 16,
  color: '#fff',
  textAlign: 'left',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const copyButton: CSSProperties = {
  position: 'absolute',
  top: 12,
  right: 12,
  border: '1px solid #2a2a2a',
  borderRadius: 999,
  color: '#fff',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 850,
  padding: '8px 13px',
};

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  color: '#a3a3a3',
  fontSize: 14,
  lineHeight: 1.8,
};
