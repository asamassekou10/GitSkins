'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { ProGate } from '@/components/ProGate';
import { useUserPlan } from '@/hooks/useUserPlan';

type Persona = {
  username: string;
  displayName: string;
  archetype: string;
  title: string;
  theme: string;
  expression: string;
  summary: string;
  traits: string[];
  evidence: string[];
  languages: string[];
  avatarUrl: string;
};

export default function AvatarPersonaPage() {
  const { data: session } = useSession();
  const { plan, loading } = useUserPlan();
  const sessionUser = session?.user as { username?: string; name?: string } | undefined;

  const [username, setUsername] = useState(sessionUser?.username ?? '');
  const [persona, setPersona] = useState<Persona | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!loading && plan !== 'pro') {
    return (
      <ProGate
        feature="Project Persona Avatars"
        tagline="Turn a GitHub profile into an original developer character based on repos, languages, and project signals."
        benefits={[
          'Generate character avatars from real GitHub project data',
          'Unlock project archetypes like Terminal Mage and AI Alchemist',
          'Export and share profile-ready persona avatars',
        ]}
      />
    );
  }

  async function generatePersona() {
    const cleaned = username.trim().replace(/^@/, '');
    if (!cleaned) return;

    setBusy(true);
    setError(null);
    setPersona(null);

    try {
      const res = await fetch(`/api/avatar/persona?username=${encodeURIComponent(cleaned)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not generate persona');
      setPersona(data.persona);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate persona');
    } finally {
      setBusy(false);
    }
  }

  async function copyUrl() {
    if (!persona) return;
    await navigator.clipboard.writeText(persona.avatarUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '100px clamp(16px, 4vw, 24px) 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ textAlign: 'center', marginBottom: 42 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)', color: '#22c55e', fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
            Pro AI Avatar
          </div>
          <h1 style={{ fontSize: 'clamp(34px, 6vw, 58px)', fontWeight: 850, letterSpacing: '-0.04em', marginBottom: 16 }}>
            What do your projects look like?
          </h1>
          <p style={{ maxWidth: 640, margin: '0 auto', color: '#888', fontSize: 17, lineHeight: 1.65 }}>
            GitSkins analyzes a GitHub profile and turns the project mix into an original developer character.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 380px) 1fr', gap: 28, alignItems: 'start' }}>
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 18, padding: 22 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 750, color: '#666', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 10 }}>
              GitHub Username
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generatePersona()}
                placeholder="octocat"
                style={{ flex: 1, minWidth: 0, background: '#161616', border: '1px solid #242424', borderRadius: 12, color: '#fff', padding: '12px 14px', outline: 'none', fontSize: 15 }}
              />
              <button
                onClick={generatePersona}
                disabled={busy}
                style={{ border: 'none', borderRadius: 12, background: '#22c55e', color: '#020202', fontWeight: 800, padding: '0 16px', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1 }}
              >
                {busy ? 'Reading...' : 'Generate'}
              </button>
            </div>

            {error && (
              <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', color: '#fca5a5', fontSize: 13 }}>
                {error}
              </div>
            )}

            <div style={{ marginTop: 20, padding: 16, borderRadius: 14, background: '#090909', border: '1px solid #171717' }}>
              <div style={{ color: '#ccc', fontSize: 14, fontWeight: 750, marginBottom: 8 }}>How it works</div>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#666', fontSize: 13, lineHeight: 1.7 }}>
                <li>Reads public repos, languages, pinned projects, stars, and bio.</li>
                <li>Maps project signals to a GitSkins character archetype.</li>
                <li>Generates a deterministic themed avatar URL.</li>
              </ul>
            </div>
          </div>

          <div style={{ minHeight: 520, background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 22, padding: 'clamp(20px, 4vw, 34px)', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              {!persona ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  style={{ minHeight: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#555' }}
                >
                  {busy ? 'Analyzing repositories and shaping the character...' : 'Enter a username to generate a project persona.'}
                </motion.div>
              ) : (
                <motion.div
                  key={persona.avatarUrl}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.32 }}
                  style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'center' }}
                >
                  <div>
                    <img
                      src={persona.avatarUrl}
                      alt={`${persona.title} avatar`}
                      width={260}
                      height={260}
                      style={{ width: 260, height: 260, borderRadius: '50%', display: 'block', boxShadow: '0 24px 80px rgba(0,0,0,0.45)' }}
                    />
                    <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
                      <button onClick={copyUrl} style={{ padding: '12px 16px', borderRadius: 12, border: '1px solid #222', background: copied ? 'rgba(34,197,94,0.1)' : '#111', color: copied ? '#22c55e' : '#aaa', fontWeight: 750, cursor: 'pointer' }}>
                        {copied ? 'Copied!' : 'Copy Avatar URL'}
                      </button>
                      <a href={persona.avatarUrl.replace('size=400', 'size=1024')} target="_blank" rel="noreferrer" style={{ padding: '12px 16px', borderRadius: 12, background: '#22c55e', color: '#050505', fontWeight: 850, textAlign: 'center', textDecoration: 'none' }}>
                        Open 1024px PNG
                      </a>
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#22c55e', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 10 }}>
                      {persona.displayName}'s Persona
                    </div>
                    <h2 style={{ margin: '0 0 12px', fontSize: 'clamp(30px, 5vw, 46px)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                      {persona.title}
                    </h2>
                    <p style={{ color: '#aaa', fontSize: 16, lineHeight: 1.65, margin: '0 0 22px' }}>
                      {persona.summary}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                      {persona.traits.map((trait) => (
                        <span key={trait} style={{ padding: '7px 10px', borderRadius: 999, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)', color: '#86efac', fontSize: 12, fontWeight: 700 }}>
                          {trait}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gap: 10 }}>
                      {persona.evidence.map((item) => (
                        <div key={item} style={{ padding: 12, borderRadius: 12, background: '#090909', border: '1px solid #171717', color: '#777', fontSize: 13 }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
