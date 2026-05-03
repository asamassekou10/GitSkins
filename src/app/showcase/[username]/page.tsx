'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { analytics } from '@/components/AnalyticsProvider';
import { ShareMenu } from '@/components/ShareMenu';
import { getProfileSkin, profileSkins, type ProfileSkin } from '@/lib/profile-skins';

const productionUrl = 'https://gitskins.com';

interface ShowcaseRepo {
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string; color: string } | null;
}

interface ShowcaseData {
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  stats: {
    totalStars: number;
    totalContributions: number;
    totalRepos: number;
    followers: number;
  };
  pinnedRepos: ShowcaseRepo[];
  contributionCalendar: {
    weeks: Array<{
      contributionDays: Array<{
        contributionCount: number;
        date: string;
      }>;
    }>;
  };
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createFallbackCells(username: string, skinId: string) {
  const seed = hashString(`${username}:${skinId}`);
  return Array.from({ length: 154 }, (_, index) => {
    const value = Math.abs(Math.sin(seed * (index + 7)) * 10000) % 1;
    if (value > 0.82) return 4;
    if (value > 0.68) return 3;
    if (value > 0.52) return 2;
    if (value > 0.38) return 1;
    return 0;
  });
}

function createCellsFromCalendar(data: ShowcaseData | null, username: string, skinId: string) {
  if (!data?.contributionCalendar?.weeks?.length) {
    return createFallbackCells(username, skinId);
  }

  const days = data.contributionCalendar.weeks
    .slice(-22)
    .flatMap((week) => week.contributionDays)
    .slice(-154);
  const max = Math.max(...days.map((day) => day.contributionCount), 1);

  return days.map((day) => {
    if (day.contributionCount === 0) return 0;
    const intensity = day.contributionCount / max;
    if (intensity > 0.78) return 4;
    if (intensity > 0.5) return 3;
    if (intensity > 0.22) return 2;
    return 1;
  });
}

function PatternLayer({ skin }: { skin: ProfileSkin }) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: skin.pattern === 'manuscript' ? 0.16 : skin.pattern === 'scanline' ? 0.22 : 0.12,
          backgroundImage:
            skin.pattern === 'scanline'
              ? 'linear-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)'
              : skin.pattern === 'grid'
                ? 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)'
                : skin.pattern === 'ember'
                  ? `radial-gradient(circle at 20% 30%, ${skin.accent} 0 1px, transparent 2px), radial-gradient(circle at 80% 65%, ${skin.accent2} 0 1px, transparent 2px)`
                  : `linear-gradient(120deg, ${skin.accent}18 1px, transparent 1px), linear-gradient(30deg, ${skin.accent2}12 1px, transparent 1px)`,
          backgroundSize: skin.pattern === 'scanline' ? '100% 7px' : '42px 42px',
          pointerEvents: 'none',
        }}
      />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.05, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: 420,
          height: 420,
          right: -120,
          top: -140,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${skin.glow}, transparent 70%)`,
          filter: 'blur(10px)',
        }}
      />
    </>
  );
}

function ContributionGraph({ username, skin, data }: { username: string; skin: ProfileSkin; data: ShowcaseData | null }) {
  const cells = useMemo(() => createCellsFromCalendar(data, username, skin.id), [data, username, skin.id]);
  const colors = ['rgba(255,255,255,0.08)', `${skin.accent}38`, `${skin.accent}66`, skin.accent, skin.accent2];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ color: skin.text, fontSize: 18, fontWeight: 800 }}>Contribution signal</div>
        <div style={{ color: skin.muted, fontSize: 12 }}>{data ? `${data.stats.totalContributions.toLocaleString()} contributions` : 'last 22 weeks'}</div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(22, 1fr)',
          gap: 5,
          padding: 14,
          borderRadius: 18,
          background: skin.surfaceStrong,
          border: `1px solid ${skin.border}`,
        }}
      >
        {cells.map((level, index) => (
          <motion.div
            key={`${skin.id}-${index}`}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.002, duration: 0.18 }}
            style={{
              aspectRatio: '1',
              minWidth: 6,
              borderRadius: 4,
              background: colors[level],
              boxShadow: level > 2 ? `0 0 12px ${colors[level]}` : 'none',
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5, marginTop: 10, color: skin.muted, fontSize: 11 }}>
        Less
        {colors.map((color, index) => (
          <span key={color} style={{ width: 10, height: 10, borderRadius: 3, background: color, display: 'inline-block' }} />
        ))}
        More
      </div>
    </div>
  );
}

function RepoCard({
  name,
  description,
  language,
  stars,
  forks,
  skin,
  delay,
}: {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  skin: ProfileSkin;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -3, borderColor: skin.accent }}
      style={{
        minHeight: 132,
        padding: 18,
        borderRadius: 18,
        background: skin.surface,
        border: `1px solid ${skin.border}`,
        boxShadow: `0 18px 70px rgba(0,0,0,0.22)`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ color: skin.text, fontSize: 16, fontWeight: 850 }}>{name}</div>
        <span style={{ color: skin.accent, fontSize: 12, border: `1px solid ${skin.border}`, borderRadius: 999, padding: '3px 8px' }}>Public</span>
      </div>
      <p style={{ color: skin.muted, margin: '10px 0 18px', fontSize: 13, lineHeight: 1.5 }}>{description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: skin.muted, fontSize: 12 }}>
        <span><span style={{ display: 'inline-block', width: 9, height: 9, borderRadius: '50%', background: skin.accent, marginRight: 7 }} />{language}</span>
        <span>★ {stars.toLocaleString()} · ⑂ {forks.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}

function ShowcaseContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawUsername = params.username as string;
  const username = rawUsername?.startsWith('@') ? rawUsername.slice(1) : (rawUsername || '');
  const [selectedSkinId, setSelectedSkinId] = useState(searchParams.get('skin') ?? 'renaissance');
  const [draftUsername, setDraftUsername] = useState(username);
  const [density, setDensity] = useState<'editorial' | 'compact'>('editorial');
  const [showcaseData, setShowcaseData] = useState<ShowcaseData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [showCopied, setShowCopied] = useState(false);
  const [copiedReadmeBlock, setCopiedReadmeBlock] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const skin = getProfileSkin(selectedSkinId);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const avatarUrl = `${baseUrl}/api/avatar?username=${encodeURIComponent(username)}&family=character&character=${skin.character}&theme=${skin.theme}&expression=${skin.expression}&size=400`;
  const premiumCardUrl = `${baseUrl}/api/premium-card?username=${encodeURIComponent(username)}&theme=${skin.theme}&variant=persona&avatar=persona`;
  const statsUrl = `${baseUrl}/api/stats?username=${encodeURIComponent(username)}&theme=${skin.theme}`;
  const languagesUrl = `${baseUrl}/api/languages?username=${encodeURIComponent(username)}&theme=${skin.theme}`;
  const shareUrl = `${baseUrl}/showcase/${username}?skin=${skin.id}`;

  useEffect(() => {
    setDraftUsername(username);
  }, [username]);

  useEffect(() => {
    let cancelled = false;
    setDataLoading(true);
    fetch(`/api/showcase-data?username=${encodeURIComponent(username)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((data: ShowcaseData | null) => {
        if (!cancelled) setShowcaseData(data);
      })
      .catch(() => {
        if (!cancelled) setShowcaseData(null);
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const repoCards = useMemo(() => {
    const realRepos = showcaseData?.pinnedRepos?.filter((repo) => repo.name).slice(0, density === 'compact' ? 4 : 6) ?? [];
    if (realRepos.length > 0) {
      return realRepos.map((repo) => ({
        name: repo.name,
        description: repo.description ?? 'A featured repository from this GitHub profile.',
        language: repo.primaryLanguage?.name ?? 'Code',
        stars: repo.stargazerCount,
        forks: repo.forkCount,
      }));
    }

    return [
      { name: `${username}-profile-kit`, description: 'A polished developer identity system with cards, avatars, and README motion.', language: 'TypeScript', stars: 128, forks: 18 },
      { name: 'project-persona', description: 'AI-generated project character and visual story for GitHub portfolios.', language: 'Python', stars: 84, forks: 12 },
      { name: 'animated-readme', description: 'Markdown sections, banners, dividers, and tasteful profile animations.', language: 'Markdown', stars: 63, forks: 9 },
      { name: 'profile-skin', description: 'A hosted GitHub-style showcase with theme-aware cards and contribution art.', language: 'Next.js', stars: 42, forks: 7 },
    ];
  }, [density, showcaseData, username]);

  const displayName = showcaseData?.name || username;
  const bio = showcaseData?.bio || 'Building public proof through expressive cards, character avatars, and a GitHub profile that finally has a visual point of view.';

  const copyShowcase = useCallback(async () => {
    await navigator.clipboard.writeText(shareUrl);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
    analytics.trackMarkdownCopy('profile-skin', skin.id, username, 'showcase');
  }, [shareUrl, skin.id, username]);

  const copyReadmeBlock = useCallback(async () => {
    const markdown = `[![${username}'s GitSkins profile skin](${productionUrl}/api/premium-card?username=${encodeURIComponent(username)}&theme=${skin.theme}&variant=persona&avatar=persona)](${productionUrl}/showcase/${encodeURIComponent(username)}?skin=${skin.id})`;
    await navigator.clipboard.writeText(markdown);
    setCopiedReadmeBlock(true);
    setTimeout(() => setCopiedReadmeBlock(false), 2000);
    analytics.trackMarkdownCopy('profile-skin-readme-block', skin.id, username, 'showcase');
  }, [skin.id, skin.theme, username]);

  const downloadPreview = useCallback(async () => {
    try {
      setDownloading(true);
      const response = await fetch(premiumCardUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `gitskins-${username}-${skin.id}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
    } finally {
      setDownloading(false);
    }
  }, [premiumCardUrl, skin.id, username]);

  const applyUsername = useCallback(() => {
    const cleaned = draftUsername.trim().replace(/^@/, '');
    if (!cleaned) return;
    window.location.href = `/showcase/${encodeURIComponent(cleaned)}?skin=${skin.id}`;
  }, [draftUsername, skin.id]);

  if (!username) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#050505', color: '#fafafa' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Missing username</h1>
          <Link href="/" style={{ color: '#22c55e' }}>Go home</Link>
        </div>
      </div>
    );
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: skin.background,
        color: skin.text,
        fontFamily: skin.font,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <PatternLayer skin={skin} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1440, margin: '0 auto', padding: '96px 24px 72px' }}>
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 20,
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ color: skin.accent, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.8 }}>Profile Skin Preview</div>
            <h1 style={{ margin: '8px 0 6px', fontSize: 'clamp(34px, 5vw, 76px)', lineHeight: 0.92, letterSpacing: '-0.045em' }}>
              @{username}, fully skinned.
            </h1>
            <p style={{ margin: 0, color: skin.muted, fontSize: 16, maxWidth: 620 }}>
              A hosted GitSkins profile page inspired by GitHub, rebuilt with theme art, character avatars, animated cards, and shareable polish.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={copyShowcase}
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                border: `1px solid ${skin.border}`,
                background: skin.surface,
                color: skin.text,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {showCopied ? 'Copied link' : 'Copy skin link'}
            </button>
            <button
              type="button"
              onClick={copyReadmeBlock}
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                border: `1px solid ${skin.border}`,
                background: skin.surface,
                color: skin.text,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {copiedReadmeBlock ? 'README block copied' : 'Copy README block'}
            </button>
            <button
              type="button"
              onClick={downloadPreview}
              disabled={downloading}
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                border: `1px solid ${skin.border}`,
                background: skin.surface,
                color: downloading ? skin.muted : skin.text,
                fontWeight: 800,
                cursor: downloading ? 'wait' : 'pointer',
              }}
            >
              {downloading ? 'Preparing...' : 'Download preview'}
            </button>
            <Link
              href="/pricing"
              style={{
                padding: '12px 18px',
                borderRadius: 12,
                background: skin.accent,
                color: '#050505',
                fontWeight: 900,
                textDecoration: 'none',
                boxShadow: `0 14px 44px ${skin.glow}`,
              }}
            >
              Unlock Pro Skins
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(240px, 1fr) auto auto',
            gap: 10,
            padding: 12,
            borderRadius: 18,
            background: 'rgba(0,0,0,0.22)',
            border: `1px solid ${skin.border}`,
            marginBottom: 14,
            backdropFilter: 'blur(18px)',
          }}
          className="showcase-builder"
        >
          <input
            value={draftUsername}
            onChange={(event) => setDraftUsername(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') applyUsername();
            }}
            aria-label="GitHub username"
            style={{
              minWidth: 0,
              padding: '12px 14px',
              borderRadius: 12,
              border: `1px solid ${skin.border}`,
              background: skin.surface,
              color: skin.text,
              font: 'inherit',
              fontWeight: 800,
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={applyUsername}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: `1px solid ${skin.border}`,
              background: skin.surface,
              color: skin.text,
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            Preview
          </button>
          <div style={{ display: 'flex', padding: 4, borderRadius: 12, background: skin.surface, border: `1px solid ${skin.border}` }}>
            {(['editorial', 'compact'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setDensity(mode)}
                style={{
                  padding: '8px 11px',
                  borderRadius: 9,
                  border: 'none',
                  background: density === mode ? skin.accent : 'transparent',
                  color: density === mode ? '#050505' : skin.muted,
                  fontSize: 12,
                  fontWeight: 900,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{
            display: 'flex',
            gap: 10,
            overflowX: 'auto',
            padding: '8px 0 24px',
            marginBottom: 8,
          }}
        >
          {profileSkins.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setSelectedSkinId(option.id);
                analytics.trackThemeSelection(option.id, 'showcase', username);
              }}
              style={{
                flex: '0 0 auto',
                padding: '10px 14px',
                borderRadius: 999,
                border: `1px solid ${option.id === skin.id ? skin.accent : skin.border}`,
                background: option.id === skin.id ? `${skin.accent}24` : skin.surface,
                color: option.id === skin.id ? skin.text : skin.muted,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {option.label}
            </button>
          ))}
        </motion.div>

        <motion.section
          layout
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          style={{
            border: `1px solid ${skin.border}`,
            borderRadius: 30,
            background: 'rgba(0,0,0,0.24)',
            boxShadow: `0 30px 120px rgba(0,0,0,0.38), 0 0 80px ${skin.glow}`,
            overflow: 'hidden',
            backdropFilter: 'blur(22px)',
          }}
        >
          <div
            style={{
              height: 70,
              borderBottom: `1px solid ${skin.border}`,
              background: 'rgba(0,0,0,0.34)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 900 }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', background: skin.surfaceStrong, color: skin.accent }}>⌘</span>
              GitSkins Profile
            </div>
            <div style={{ display: 'flex', gap: 8, color: skin.muted, fontSize: 13 }}>
              <span>Overview</span>
              <span>Repositories</span>
              <span>Stars</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 360px) 1fr',
              gap: 28,
              padding: 28,
            }}
            className="showcase-shell"
          >
            <aside>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.16, type: 'spring', stiffness: 120, damping: 16 }}
                style={{
                  width: 'min(100%, 300px)',
                  aspectRatio: '1',
                  borderRadius: skin.id === 'renaissance' ? 18 : '50%',
                  padding: 8,
                  background: `linear-gradient(135deg, ${skin.accent}, ${skin.accent2})`,
                  boxShadow: `0 18px 70px ${skin.glow}`,
                  marginBottom: 22,
                }}
              >
                <img src={avatarUrl} alt={`${username} avatar`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: skin.id === 'renaissance' ? 12 : '50%' }} />
              </motion.div>
              <h2 style={{ margin: '0 0 4px', fontSize: 31, letterSpacing: '-0.04em' }}>{username}</h2>
              <p style={{ margin: '0 0 18px', color: skin.muted, fontSize: 17 }}>{displayName} · @{username}</p>
              <p style={{ color: skin.text, lineHeight: 1.7, marginBottom: 18 }}>
                {bio}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 18 }}>
                {[
                  ['Stars', showcaseData?.stats.totalStars],
                  ['Repos', showcaseData?.stats.totalRepos],
                  ['Followers', showcaseData?.stats.followers],
                  ['Contribs', showcaseData?.stats.totalContributions],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: '10px 12px', borderRadius: 14, background: skin.surfaceStrong, border: `1px solid ${skin.border}` }}>
                    <div style={{ color: skin.text, fontSize: 20, fontWeight: 950 }}>{typeof value === 'number' ? value.toLocaleString() : dataLoading ? '...' : '0'}</div>
                    <div style={{ color: skin.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {['Profile README system', 'Theme-aware avatar pack', 'Hosted portfolio skin', 'Animated visual kit'].map((item) => (
                  <div key={item} style={{ padding: '12px 14px', borderRadius: 14, background: skin.surface, border: `1px solid ${skin.border}`, color: skin.muted }}>
                    <span style={{ color: skin.accent, marginRight: 8 }}>✦</span>{item}
                  </div>
                ))}
              </div>
            </aside>

            <section style={{ display: 'grid', gap: 22 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: 18 }} className="showcase-grid">
                <div style={{ padding: 18, borderRadius: 22, background: skin.surface, border: `1px solid ${skin.border}` }}>
                  <img src={premiumCardUrl} alt={`${username} premium GitSkins card`} style={{ width: '100%', borderRadius: 16, display: 'block' }} />
                </div>
                <div style={{ padding: 18, borderRadius: 22, background: skin.surface, border: `1px solid ${skin.border}` }}>
                  <div style={{ color: skin.accent, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.4 }}>Skin Template</div>
                  <h3 style={{ margin: '10px 0', fontSize: 30, letterSpacing: '-0.04em' }}>{skin.label}</h3>
                  <p style={{ color: skin.muted, lineHeight: 1.65, margin: 0 }}>{skin.tagline}</p>
                  <ShareMenu
                    shareUrl={shareUrl}
                    shareText={`Check out my ${skin.label} GitSkins profile skin`}
                    imageUrl={premiumCardUrl}
                    downloadFilename={`gitskins-${username}-${skin.id}.png`}
                    context={{ username, theme: skin.id, widget: 'profile-skin', source: 'showcase' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: density === 'compact' ? 'repeat(4, minmax(0, 1fr))' : 'repeat(2, minmax(0, 1fr))', gap: 18 }} className="showcase-grid">
                {repoCards.map((repo, index) => (
                  <RepoCard key={repo.name} name={repo.name} description={repo.description} language={repo.language} stars={repo.stars} forks={repo.forks} skin={skin} delay={0.12 + index * 0.07} />
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="showcase-grid">
                <div style={{ padding: 18, borderRadius: 22, background: skin.surface, border: `1px solid ${skin.border}` }}>
                  <img src={statsUrl} alt={`${username} stats`} style={{ width: '100%', borderRadius: 16, display: 'block' }} />
                </div>
                <div style={{ padding: 18, borderRadius: 22, background: skin.surface, border: `1px solid ${skin.border}` }}>
                  <img src={languagesUrl} alt={`${username} languages`} style={{ width: '100%', borderRadius: 16, display: 'block' }} />
                </div>
              </div>

              <div style={{ padding: 22, borderRadius: 24, background: skin.surface, border: `1px solid ${skin.border}` }}>
                <ContributionGraph username={username} skin={skin} data={showcaseData} />
              </div>
            </section>
          </div>
        </motion.section>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .showcase-shell,
          .showcase-grid,
          .showcase-builder {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

function ShowcaseLoading() {
  return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'grid', placeItems: 'center' }}>
      <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid #2a2a2a', borderTopColor: '#22c55e', borderRadius: '50%' }} />
    </div>
  );
}

export default function ShowcasePage() {
  return (
    <Suspense fallback={<ShowcaseLoading />}>
      <ShowcaseContent />
    </Suspense>
  );
}
