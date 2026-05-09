'use client';

import { useState } from 'react';

interface AdminUser {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  createdAt: string;
  plan: 'free' | 'pro';
  subscriptionStatus: string | null;
  credits: number;
  readmeGenerationsUsed: number;
}

export default function AdminClient() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [actingUserId, setActingUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [creditAmount, setCreditAmount] = useState(10);

  async function searchUsers() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Search failed');
      setUsers(data.users ?? []);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  async function action(path: string, userId: string, body: Record<string, unknown> = {}) {
    setActingUserId(userId);
    setMessage(null);
    try {
      const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Action failed');
      setMessage(data.message ?? 'Updated');
      await searchUsers();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActingUserId(null);
    }
  }

  return (
    <section style={{ padding: 22, borderRadius: 22, background: '#0b0b0b', border: '1px solid #1f1f1f' }}>
      <h2 style={{ margin: '0 0 16px', fontSize: 22, letterSpacing: '-0.035em' }}>User lookup</h2>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') searchUsers();
          }}
          placeholder="Search email, username, or name"
          style={{ flex: '1 1 280px', minHeight: 44, borderRadius: 12, border: '1px solid #2a2a2a', background: '#111', color: '#fafafa', padding: '0 14px', outline: 'none' }}
        />
        <button type="button" onClick={searchUsers} disabled={loading || query.trim().length < 2} style={primaryButton}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {message ? <p style={{ margin: '0 0 16px', color: message.toLowerCase().includes('fail') || message.toLowerCase().includes('error') ? '#ef4444' : '#4ade80', fontSize: 14 }}>{message}</p> : null}

      <div style={{ display: 'grid', gap: 12 }}>
        {users.map((user) => (
          <article key={user.id} style={{ padding: 16, borderRadius: 16, background: '#111', border: '1px solid #232323' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 12, alignItems: 'start', marginBottom: 14 }}>
              <div>
                <div style={{ color: '#f5f5f5', fontWeight: 900 }}>{user.name || user.username || user.email || user.id}</div>
                <div style={{ color: '#777', fontSize: 13, lineHeight: 1.6 }}>
                  {user.email || 'No email'} {user.username ? `· @${user.username}` : ''} · {user.readmeGenerationsUsed} README uses this month
                </div>
              </div>
              <span style={{ color: user.plan === 'pro' ? '#22c55e' : '#888', fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>
                {user.plan}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <button type="button" onClick={() => action('/api/admin/users/grant-pro', user.id)} disabled={actingUserId === user.id} style={primaryButton}>
                Grant Pro
              </button>
              <button type="button" onClick={() => action('/api/admin/users/revoke-pro', user.id)} disabled={actingUserId === user.id} style={secondaryButton}>
                Revoke Pro
              </button>
              <input
                type="number"
                min={1}
                max={1000}
                value={creditAmount}
                onChange={(event) => setCreditAmount(Number(event.target.value))}
                style={{ width: 92, minHeight: 40, borderRadius: 10, border: '1px solid #2a2a2a', background: '#0b0b0b', color: '#fafafa', padding: '0 10px' }}
              />
              <button type="button" onClick={() => action('/api/admin/users/grant-credits', user.id, { amount: creditAmount })} disabled={actingUserId === user.id} style={secondaryButton}>
                Grant credits
              </button>
              <span style={{ color: '#777', fontSize: 13 }}>{user.credits} current credits</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const primaryButton = {
  minHeight: 42,
  padding: '10px 14px',
  borderRadius: 12,
  border: 'none',
  background: '#22c55e',
  color: '#041007',
  fontSize: 14,
  fontWeight: 900,
  cursor: 'pointer',
};

const secondaryButton = {
  ...primaryButton,
  border: '1px solid #2a2a2a',
  background: '#171717',
  color: '#f5f5f5',
};
