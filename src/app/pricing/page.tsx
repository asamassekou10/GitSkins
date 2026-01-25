'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/landing/Navigation';
import { AuroraBackground } from '@/components/landing/AuroraBackground';
import { PLANS, CREDIT_PACKS } from '@/config/subscription';
import { getUserPlan, checkGenerationAllowed, formatResetDate, getDaysUntilReset } from '@/lib/usage-tracker';
import type { PlanType } from '@/types/subscription';

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [usageInfo, setUsageInfo] = useState<{
    remaining: number;
    limit: number;
    resetDate: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check for success/cancel params
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setShowSuccess(true);
      // Clear the URL params
      window.history.replaceState({}, '', '/pricing');
    }

    // Load current plan and usage
    setCurrentPlan(getUserPlan());
    const check = checkGenerationAllowed();
    setUsageInfo({
      remaining: check.remaining,
      limit: check.limit,
      resetDate: check.resetDate,
    });
  }, []);

  const handleUpgrade = async (priceId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <Navigation />

      <main style={{ paddingTop: '120px', paddingBottom: '80px' }}>
        {/* Hero Section */}
        <section
          style={{
            position: 'relative',
            padding: '20px 20px 60px',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <AuroraBackground intensity="medium" position="top" />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
            {showSuccess && (
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid #22c55e',
                  borderRadius: '12px',
                  padding: '16px 24px',
                  marginBottom: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span style={{ color: '#22c55e', fontWeight: 600 }}>
                  Payment successful! You now have Pro access.
                </span>
              </div>
            )}

            <h1
              style={{
                fontSize: 'clamp(36px, 6vw, 56px)',
                fontWeight: 800,
                margin: 0,
                marginBottom: '16px',
                letterSpacing: '-1px',
              }}
            >
              Simple,{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Transparent
              </span>{' '}
              Pricing
            </h1>

            <p
              style={{
                fontSize: '18px',
                color: '#888',
                margin: '0 auto',
                maxWidth: '500px',
                lineHeight: 1.6,
              }}
            >
              Start for free, upgrade when you need more. One-time payment, lifetime access.
            </p>
          </div>
        </section>

        {/* Current Usage Banner (for logged in users) */}
        {usageInfo && (
          <section style={{ maxWidth: '600px', margin: '0 auto 40px', padding: '0 20px' }}>
            <div
              style={{
                background: '#161616',
                border: '1px solid #2a2a2a',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>
                  Your Plan: <span style={{ color: currentPlan === 'pro' ? '#22c55e' : '#fff', fontWeight: 600 }}>
                    {currentPlan === 'pro' ? 'Pro' : 'Free'}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>
                  README Generations: <span style={{ color: usageInfo.remaining > 0 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                    {usageInfo.remaining}/{usageInfo.limit}
                  </span>
                  <span style={{ color: '#666', marginLeft: '8px' }}>
                    (resets {formatResetDate(usageInfo.resetDate)})
                  </span>
                </div>
              </div>
              {currentPlan === 'free' && usageInfo.remaining === 0 && (
                <span
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#ef4444',
                    fontWeight: 500,
                  }}
                >
                  Limit reached - {getDaysUntilReset(usageInfo.resetDate)} days until reset
                </span>
              )}
            </div>
          </section>
        )}

        {/* Pricing Cards */}
        <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Free Plan */}
            <div
              style={{
                background: '#161616',
                border: currentPlan === 'free' ? '2px solid #22c55e' : '1px solid #2a2a2a',
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
              }}
            >
              {currentPlan === 'free' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#22c55e',
                    color: '#000',
                    padding: '4px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  Current Plan
                </div>
              )}

              <h3 style={{ fontSize: '24px', fontWeight: 700, margin: 0, marginBottom: '8px' }}>
                {PLANS.free.name}
              </h3>
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>
                {PLANS.free.description}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '48px', fontWeight: 800 }}>$0</span>
                <span style={{ color: '#888', marginLeft: '8px' }}>forever</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '32px' }}>
                {PLANS.free.features.map((feature, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '12px',
                      fontSize: '14px',
                      color: '#ccc',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '14px 24px',
                  background: 'transparent',
                  border: '1px solid #2a2a2a',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div
              style={{
                background: 'linear-gradient(145deg, #1a2e1a 0%, #161616 100%)',
                border: currentPlan === 'pro' ? '2px solid #22c55e' : '2px solid #22c55e50',
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
              }}
            >
              {currentPlan === 'pro' ? (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#22c55e',
                    color: '#000',
                    padding: '4px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  Current Plan
                </div>
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
                    color: '#000',
                    padding: '4px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  Most Popular
                </div>
              )}

              <h3 style={{ fontSize: '24px', fontWeight: 700, margin: 0, marginBottom: '8px' }}>
                {PLANS.pro.name}
              </h3>
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>
                {PLANS.pro.description}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '48px', fontWeight: 800, color: '#22c55e' }}>$29</span>
                <span style={{ color: '#888', marginLeft: '8px' }}>one-time</span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '32px' }}>
                {PLANS.pro.features.map((feature, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '12px',
                      fontSize: '14px',
                      color: '#ccc',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {currentPlan === 'pro' ? (
                <button
                  disabled
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px 24px',
                    background: '#1a1a1a',
                    border: '1px solid #2a2a2a',
                    borderRadius: '12px',
                    color: '#666',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'not-allowed',
                  }}
                >
                  Already Pro
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade('pro_lifetime')}
                  disabled={isLoading}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px 24px',
                    background: isLoading ? '#1a5f35' : '#22c55e',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#000',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: isLoading ? 'wait' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {isLoading ? 'Processing...' : 'Upgrade to Pro'}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Credit Packs Section */}
        <section style={{ maxWidth: '900px', margin: '60px auto 0', padding: '0 20px' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            Need More README Generations?
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: '#888',
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            Buy credit packs for additional generations. Credits never expire.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            {CREDIT_PACKS.map((pack) => (
              <div
                key={pack.id}
                style={{
                  background: '#161616',
                  border: '1px solid #2a2a2a',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '4px' }}>
                  {pack.credits}
                </div>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
                  credits
                </div>
                <button
                  onClick={() => handleUpgrade(pack.id)}
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1px solid #22c55e',
                    borderRadius: '8px',
                    color: '#22c55e',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: isLoading ? 'wait' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {pack.priceLabel}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ maxWidth: '700px', margin: '80px auto 0', padding: '0 20px' }}>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '32px',
              textAlign: 'center',
            }}
          >
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              {
                q: 'Is the Pro plan really lifetime?',
                a: 'Yes! Pay once, use forever. No subscriptions, no hidden fees. You get lifetime access to all current and future Pro features.',
              },
              {
                q: 'What happens when I use all my README generations?',
                a: 'Free users get 3 generations per month, Pro users get 10. When you run out, you can either wait for the monthly reset or purchase a credit pack.',
              },
              {
                q: 'Do credits expire?',
                a: 'No, credits never expire. They roll over month to month until you use them.',
              },
              {
                q: 'Can I upgrade later?',
                a: 'Absolutely! You can upgrade to Pro at any time. Your existing usage and credits will be preserved.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, Apple Pay, Google Pay, and more through our secure Stripe checkout.',
              },
            ].map((faq, i) => (
              <div
                key={i}
                style={{
                  background: '#161616',
                  border: '1px solid #2a2a2a',
                  borderRadius: '12px',
                  padding: '20px 24px',
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, marginBottom: '8px' }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: '14px', color: '#888', margin: 0, lineHeight: 1.6 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '40px 20px',
          borderTop: '1px solid #1a1a1a',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#444', fontSize: '14px', margin: 0 }}>
          GitSkins - Beautiful GitHub README Widgets
        </p>
      </footer>
    </div>
  );
}
