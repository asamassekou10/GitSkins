'use client';

import Link from 'next/link';
import { Navigation } from '@/components/landing/Navigation';

export default function TermsPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
        color: '#e5e5e5',
      }}
    >
      <Navigation />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '100px 20px 60px' }}>
        {/* Header */}
        <Link
          href="/"
          style={{
            display: 'inline-block',
            fontSize: '24px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
            marginBottom: '40px',
          }}
        >
          GitSkins
        </Link>

        <h1
          style={{
            fontSize: '36px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '16px',
          }}
        >
          Terms of Service
        </h1>

        <p style={{ color: '#888', marginBottom: '40px' }}>
          Last updated: January 25, 2026
        </p>

        {/* Content */}
        <div style={{ lineHeight: 1.8, color: '#a3a3a3' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using GitSkins (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              2. Description of Service
            </h2>
            <p>
              GitSkins provides GitHub profile widgets, statistics cards, and an AI-powered README generator.
              The Service allows users to create visual representations of their GitHub activity and generate
              professional README files for their profiles.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              3. AI Features and Output
            </h2>
            <p style={{ marginBottom: '12px' }}>
              GitSkins uses Google Gemini to generate README content and provide profile insights. AI output may be
              inaccurate or incomplete and should be reviewed before use. You are responsible for ensuring generated
              content is appropriate for your profile and complies with applicable policies.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              4. User Accounts
            </h2>
            <p style={{ marginBottom: '12px' }}>
              To access certain features, you may need to authenticate with your GitHub account. You are responsible for:
            </p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>Maintaining the security of your account credentials</li>
              <li style={{ marginBottom: '8px' }}>All activities that occur under your account</li>
              <li style={{ marginBottom: '8px' }}>Notifying us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              5. Acceptable Use
            </h2>
            <p style={{ marginBottom: '12px' }}>You agree not to:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>Use the Service for any illegal purpose</li>
              <li style={{ marginBottom: '8px' }}>Attempt to gain unauthorized access to any part of the Service</li>
              <li style={{ marginBottom: '8px' }}>Interfere with or disrupt the Service</li>
              <li style={{ marginBottom: '8px' }}>Use automated means to access the Service beyond intended use</li>
              <li style={{ marginBottom: '8px' }}>Impersonate another person or entity</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              6. Payment and Subscriptions
            </h2>
            <p>
              GitSkins offers both free and paid tiers. Paid features are accessible through one-time purchases
              or credit packs. All payments are processed securely through Stripe. Refunds are handled on a
              case-by-case basis within 30 days of purchase.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              7. Intellectual Property
            </h2>
            <p>
              The Service, including its original content, features, and functionality, is owned by GitSkins
              and protected by international copyright, trademark, and other intellectual property laws.
              Widgets and README files you generate are for your personal or professional use.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              8. Limitation of Liability
            </h2>
            <p>
              GitSkins shall not be liable for any indirect, incidental, special, consequential, or punitive damages
              resulting from your use of or inability to use the Service. The Service is provided &quot;as is&quot;
              without warranties of any kind.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              9. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of significant changes
              via email or through the Service. Continued use of the Service after changes constitutes acceptance
              of the new terms.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              10. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:support@gitskins.com" style={{ color: '#22c55e', textDecoration: 'none' }}>
                support@gitskins.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div
          style={{
            marginTop: '60px',
            paddingTop: '24px',
            borderTop: '1px solid #2a2a2a',
            display: 'flex',
            gap: '24px',
          }}
        >
          <Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
            Home
          </Link>
          <Link href="/privacy" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
            Privacy Policy
          </Link>
          <Link href="/support" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
