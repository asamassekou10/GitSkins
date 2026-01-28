'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/landing/Navigation';
import {
  getUserPlan,
  getUsageData,
  checkGenerationAllowed,
  formatResetDate,
  getDaysUntilReset,
} from '@/lib/usage-tracker';
import { PLANS, isFreeTierTheme, FREE_THEMES } from '@/config/subscription';
import type { PlanType, UsageData } from '@/types/subscription';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plan, setPlan] = useState<PlanType>('free');
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPlan(getUserPlan());
    setUsage(getUsageData());
  }, []);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth?callbackUrl=/dashboard');
    }
  }, [status, router]);

  if (status === 'loading' || !mounted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: '#888', fontSize: '16px' }}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user as { name?: string; email?: string; image?: string; username?: string; avatar?: string };
  const avatarUrl = user.avatar || user.image || `https://github.com/${user.username || 'ghost'}.png`;
  const displayName = user.name || user.username || 'User';
  const isPro = plan === 'pro';
  const generationCheck = checkGenerationAllowed();

  const cardStyle = {
    background: '#161616',
    border: '1px solid #2a2a2a',
    borderRadius: '16px',
    padding: '24px',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
        color: '#e5e5e5',
      }}
    >
      <Navigation />

      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '100px 20px 60px',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '8px',
            }}
          >
            Dashboard
          </h1>
          <p style={{ color: '#888' }}>
            Manage your account, subscription, and usage
          </p>
        </div>

        {/* Profile Card */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <img
              src={avatarUrl}
              alt={displayName}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: isPro ? '3px solid #22c55e' : '3px solid #2a2a2a',
              }}
            />
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#fff', margin: 0 }}>
                  {displayName}
                </h2>
                {isPro && (
                  <span
                    style={{
                      padding: '4px 12px',
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(74, 222, 128, 0.2) 100%)',
                      border: '1px solid #22c55e',
                      borderRadius: '20px',
                      color: '#22c55e',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    PRO
                  </span>
                )}
              </div>
              <p style={{ color: '#888', margin: '4px 0 0', fontSize: '15px' }}>@{user.username}</p>
              <p style={{ color: '#666', margin: '4px 0 0', fontSize: '14px' }}>{user.email}</p>
            </div>
            <Link
              href={`/showcase/${user.username}`}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid #2a2a2a',
                borderRadius: '10px',
                color: '#888',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3a3a3a';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.color = '#888';
              }}
            >
              View Showcase
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '24px',
          }}
        >
          {/* Subscription Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#888', margin: 0 }}>
                Subscription
              </h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: isPro
                  ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(74, 222, 128, 0.2) 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: isPro ? '1px solid #22c55e' : '1px solid #2a2a2a',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            >
              <span style={{ color: isPro ? '#22c55e' : '#fff', fontWeight: 600, fontSize: '18px' }}>
                {isPro ? 'Pro Lifetime' : 'Free Plan'}
              </span>
            </div>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
              {isPro
                ? 'All premium themes and unlimited README generations'
                : `${FREE_THEMES.length} free themes and ${PLANS.free.limits.readmeGenerations} README generations/month`}
            </p>
            {/* All features free for hackathon */}
          </div>

          {/* Usage Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#888', margin: 0 }}>
                README Credits
              </h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>
                {generationCheck.remaining}
              </span>
              <span style={{ fontSize: '16px', color: '#888', marginLeft: '8px' }}>
                / {generationCheck.limit} remaining
              </span>
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: '8px',
                background: '#2a2a2a',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, (generationCheck.remaining / generationCheck.limit) * 100)}%`,
                  background: generationCheck.remaining > 2 ? '#22c55e' : '#ef4444',
                  borderRadius: '4px',
                  transition: 'width 0.3s',
                }}
              />
            </div>
            {usage && (
              <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
                {isPro ? (
                  'Unlimited generations with Pro'
                ) : (
                  <>
                    Resets {formatResetDate(usage.readmeGenerationsReset)} ({getDaysUntilReset(usage.readmeGenerationsReset)} days)
                  </>
                )}
              </p>
            )}
            {/* Credits purchase removed for hackathon */}
          </div>
        </div>

        {/* Theme Access Card */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#888', margin: 0 }}>
              Theme Access
            </h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>
                {isPro ? '20' : FREE_THEMES.length}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                themes available
              </div>
            </div>
            {!isPro && (
              <div
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  minWidth: '200px',
                }}
              >
                <p style={{ color: '#22c55e', fontSize: '14px', fontWeight: 500, margin: '0 0 8px' }}>
                  Unlock 15 more premium themes
                </p>
                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                  Upgrade to Pro for lifetime access to all themes including Satan, Aurora, Neon, and more.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#888', margin: '0 0 20px' }}>
            Quick Actions
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            <Link
              href="/readme-generator"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                color: '#fff',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#22c55e';
                e.currentTarget.style.background = '#1c1c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.background = '#1a1a1a';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>Generate README</div>
                <div style={{ color: '#666', fontSize: '13px' }}>AI-powered profile README</div>
              </div>
            </Link>

            <Link
              href={`/showcase/${user.username}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                color: '#fff',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#22c55e';
                e.currentTarget.style.background = '#1c1c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.background = '#1a1a1a';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>View Showcase</div>
                <div style={{ color: '#666', fontSize: '13px' }}>Your profile widgets</div>
              </div>
            </Link>

            <Link
              href="/#themes"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                color: '#fff',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#22c55e';
                e.currentTarget.style.background = '#1c1c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.background = '#1a1a1a';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>Browse Themes</div>
                <div style={{ color: '#666', fontSize: '13px' }}>Explore all {isPro ? '20' : FREE_THEMES.length} themes</div>
              </div>
            </Link>

            <Link
              href="/ai"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                color: '#fff',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#22c55e';
                e.currentTarget.style.background = '#1c1c1c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#2a2a2a';
                e.currentTarget.style.background = '#1a1a1a';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                <path d="M12 2a10 10 0 0 1 10 10" />
                <circle cx="12" cy="12" r="6" />
              </svg>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>
                  AI Features
                </div>
                <div style={{ color: '#666', fontSize: '13px' }}>
                  Profile analysis & more
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Note about localStorage */}
        <div
          style={{
            marginTop: '40px',
            padding: '16px 20px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid #1a1a1a',
            borderRadius: '12px',
          }}
        >
          <p style={{ color: '#666', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: '#888' }}>Note:</strong> Your subscription status is stored locally on this device.
            If you upgrade on a different device or clear your browser data, please contact{' '}
            <a href="mailto:support@gitskins.com" style={{ color: '#22c55e', textDecoration: 'none' }}>
              support@gitskins.com
            </a>{' '}
            with your payment confirmation to restore access.
          </p>
        </div>
      </div>
    </div>
  );
}
