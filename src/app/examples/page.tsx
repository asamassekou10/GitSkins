'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const users = ['octocat', 'torvalds', 'gaearon'];
const themes = [
  { id: 'github-dark', name: 'GitHub Dark', color: '#58a6ff' },
  { id: 'matrix', name: 'Matrix', color: '#22c55e' },
  { id: 'dracula', name: 'Dracula', color: '#bd93f9' },
];
const avatars = ['open-peeps', 'bottts', 'pixel-art', 'toon-head'];

export default function ExamplesPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <section style={{ maxWidth: 1160, margin: '0 auto', padding: '120px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: 'center', marginBottom: 58 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.24)', color: '#4ade80', fontSize: 12, fontWeight: 850, letterSpacing: 0.4, marginBottom: 20 }}>
            GitSkins gallery
          </div>
          <h1 style={{ margin: '0 auto 18px', maxWidth: 820, fontSize: 'clamp(40px, 7vw, 78px)', lineHeight: 0.94, letterSpacing: '-0.06em', fontWeight: 900 }}>
            Browse real card, avatar, and theme examples.
          </h1>
          <p style={{ margin: '0 auto', maxWidth: 640, color: '#9b9b9b', fontSize: 18, lineHeight: 1.65 }}>
            See what GitSkins generates before you open a builder. Every preview below is rendered by the same public image APIs used in GitHub READMEs.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
            <Link href="/cards" style={{ padding: '14px 18px', borderRadius: 12, background: '#22c55e', color: '#050505', textDecoration: 'none', fontWeight: 850 }}>
              Open Card Studio
            </Link>
            <Link href="/avatar" style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid #262626', color: '#fafafa', textDecoration: 'none', fontWeight: 800 }}>
              Open Avatar Studio
            </Link>
          </div>
        </motion.div>

        <section style={{ marginBottom: 70 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'end', flexWrap: 'wrap', marginBottom: 22 }}>
            <div>
              <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Premium cards</div>
              <h2 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 46px)', lineHeight: 1, letterSpacing: '-0.045em' }}>Profile cards built for README attention.</h2>
            </div>
            <Link href="/pricing" style={{ color: '#4ade80', textDecoration: 'none', fontSize: 14, fontWeight: 800 }}>Compare Free vs Pro →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))', gap: 18 }}>
            {users.map((username, index) => {
              const theme = themes[index % themes.length];
              return (
                <motion.div key={username} whileHover={{ y: -4 }} style={{ borderRadius: 22, border: '1px solid #1d1d1d', background: 'radial-gradient(circle at 80% 10%, rgba(34,197,94,0.14), transparent 40%), #0b0b0b', padding: 16, overflow: 'hidden' }}>
                  <img src={`/api/premium-card?username=${username}&theme=${theme.id}&variant=glass&avatar=persona`} alt={`${username} GitSkins card`} style={{ width: '100%', borderRadius: 14, boxShadow: '0 24px 70px rgba(0,0,0,0.42)' }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 14 }}>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 850 }}>@{username}</div>
                      <div style={{ color: '#666', fontSize: 13 }}>{theme.name}</div>
                    </div>
                    <span style={{ width: 18, height: 18, borderRadius: 999, background: theme.color, boxShadow: `0 0 18px ${theme.color}66` }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section style={{ marginBottom: 70 }}>
          <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Avatar systems</div>
          <h2 style={{ margin: '0 0 22px', fontSize: 'clamp(28px, 4vw, 46px)', lineHeight: 1, letterSpacing: '-0.045em' }}>Profile pictures that match the theme.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            {avatars.map((style, index) => (
              <Link key={style} href={`/avatar?style=${style}`} style={{ padding: 12, borderRadius: 22, border: '1px solid #1d1d1d', background: '#0b0b0b', textDecoration: 'none', color: '#fafafa' }}>
                <img src={`/api/avatar?username=gitskins-${style}&theme=${themes[index % themes.length].id}&family=dicebear&dicebearStyle=${style}&size=400`} alt={`${style} avatar example`} style={{ width: '100%', aspectRatio: '1', borderRadius: 18, objectFit: 'cover' }} />
                <div style={{ marginTop: 10, fontSize: 13, fontWeight: 800, textTransform: 'capitalize' }}>{style.replace('-', ' ')}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div style={{ color: '#22c55e', fontSize: 12, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 }}>Classic widgets</div>
          <h2 style={{ margin: '0 0 22px', fontSize: 'clamp(28px, 4vw, 46px)', lineHeight: 1, letterSpacing: '-0.045em' }}>Stats, language, and streak cards for any layout.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 290px), 1fr))', gap: 18 }}>
            {[
              ['/api/stats', 'Stats Card'],
              ['/api/languages', 'Languages Card'],
              ['/api/streak', 'Streak Card'],
            ].map(([path, label]) => (
              <div key={path} style={{ borderRadius: 20, border: '1px solid #1d1d1d', background: '#0b0b0b', padding: 16 }}>
                <img src={`${path}?username=octocat&theme=github-dark`} alt={label} style={{ width: '100%', borderRadius: 12 }} />
                <div style={{ color: '#aaa', fontSize: 13, fontWeight: 800, marginTop: 12 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
