import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getAdminAuthState } from '@/lib/admin';
import { db } from '@/lib/db';
import AdminClient from './AdminClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Admin | GitSkins',
  robots: {
    index: false,
    follow: false,
  },
};

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default async function AdminPage() {
  const adminState = await getAdminAuthState();

  if (adminState.status === 'unauthenticated') {
    redirect('/auth?callbackUrl=/admin');
  }

  if (adminState.status === 'forbidden') {
    return (
      <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa', display: 'grid', placeItems: 'center', padding: 24 }}>
        <section style={{ maxWidth: 520, textAlign: 'center', border: '1px solid #1f1f1f', borderRadius: 26, background: '#0b0b0b', padding: 34 }}>
          <div style={{ color: '#ef4444', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>
            403
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: 40, letterSpacing: '-0.05em' }}>Admin access required.</h1>
          <p style={{ color: '#888', lineHeight: 1.65, margin: '0 0 22px' }}>
            This workspace is restricted to GitSkins administrators.
          </p>
          <Link href="/dashboard" style={{ color: '#22c55e', fontWeight: 850, textDecoration: 'none' }}>Back to dashboard</Link>
        </section>
      </main>
    );
  }

  const month = currentMonth();
  const [
    totalUsers,
    proUsers,
    readmeUsage,
    readmeGenerations,
    creditAggregate,
    recentUsers,
  ] = await Promise.all([
    db.user.count(),
    db.subscription.count({ where: { plan: 'pro', status: 'active' } }),
    db.usage.aggregate({
      where: { month },
      _sum: { readmeGenerationsUsed: true },
    }),
    db.readmeGeneration.count(),
    db.creditBalance.aggregate({ _sum: { credits: true } }),
    db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true,
        subscription: { select: { plan: true, status: true } },
        creditBalance: { select: { credits: true } },
      },
    }),
  ]);

  const stats = [
    { label: 'Total users', value: totalUsers.toLocaleString() },
    { label: 'Pro users', value: proUsers.toLocaleString() },
    { label: 'Free users', value: Math.max(0, totalUsers - proUsers).toLocaleString() },
    { label: `README uses (${month})`, value: (readmeUsage._sum.readmeGenerationsUsed ?? 0).toLocaleString() },
    { label: 'Saved README generations', value: readmeGenerations.toLocaleString() },
    { label: 'Outstanding credits', value: (creditAggregate._sum.credits ?? 0).toLocaleString() },
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fafafa' }}>
      <section style={{ maxWidth: 1120, margin: '0 auto', padding: '126px 24px 96px' }}>
        <div style={{ marginBottom: 34 }}>
          <div style={{ display: 'inline-flex', padding: '7px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.24)', color: '#4ade80', fontSize: 12, fontWeight: 850, letterSpacing: 0.4, marginBottom: 18 }}>
            Admin
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 0.95, letterSpacing: '-0.06em' }}>
            GitSkins operations
          </h1>
          <p style={{ margin: 0, maxWidth: 680, color: '#9b9b9b', fontSize: 17, lineHeight: 1.65 }}>
            Search users, grant Pro access, grant credits, and check usage without touching the database manually.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))', gap: 14, marginBottom: 24 }}>
          {stats.map((stat) => (
            <article key={stat.label} style={{ padding: 18, borderRadius: 18, background: '#0b0b0b', border: '1px solid #1f1f1f' }}>
              <div style={{ color: '#666', fontSize: 11, fontWeight: 850, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 30, fontWeight: 950, letterSpacing: '-0.05em' }}>{stat.value}</div>
            </article>
          ))}
        </div>

        <AdminClient />

        <section style={{ marginTop: 24, padding: 22, borderRadius: 22, background: '#0b0b0b', border: '1px solid #1f1f1f' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 22, letterSpacing: '-0.035em' }}>Recent users</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {recentUsers.map((user) => (
              <div key={user.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto auto', gap: 12, alignItems: 'center', padding: 14, borderRadius: 14, background: '#111', border: '1px solid #202020' }}>
                <div>
                  <div style={{ color: '#f5f5f5', fontWeight: 850 }}>{user.name || user.username || user.email || user.id}</div>
                  <div style={{ color: '#777', fontSize: 13 }}>{user.email || 'No email'} {user.username ? `· @${user.username}` : ''}</div>
                </div>
                <span style={{ color: user.subscription?.plan === 'pro' ? '#22c55e' : '#888', fontSize: 12, fontWeight: 850, textTransform: 'uppercase' }}>
                  {user.subscription?.plan === 'pro' && user.subscription.status === 'active' ? 'Pro' : 'Free'}
                </span>
                <span style={{ color: '#777', fontSize: 12 }}>{user.creditBalance?.credits ?? 0} credits</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{ marginTop: 24 }}>
          <Link href="/dashboard" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>← Back to dashboard</Link>
        </div>
      </section>
    </main>
  );
}
