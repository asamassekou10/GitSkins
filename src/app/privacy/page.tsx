'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)',
        color: '#e5e5e5',
        padding: '80px 20px 60px',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
          Privacy Policy
        </h1>

        <p style={{ color: '#888', marginBottom: '40px' }}>
          Last updated: January 25, 2026
        </p>

        {/* Content */}
        <div style={{ lineHeight: 1.8, color: '#a3a3a3' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              1. Information We Collect
            </h2>
            <p style={{ marginBottom: '12px' }}>We collect information in the following ways:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>GitHub Data:</strong> When you use our service, we access
                publicly available GitHub profile data including your username, avatar, bio, repositories,
                and contribution statistics.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>Account Information:</strong> If you sign in with GitHub,
                we receive your email address and basic profile information.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>Usage Data:</strong> We collect anonymous analytics data
                about how you use our service to improve user experience.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>Payment Information:</strong> Payment processing is handled
                by Stripe. We do not store your credit card details.
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              2. How We Use Your Information
            </h2>
            <p style={{ marginBottom: '12px' }}>We use collected information to:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>Generate your GitHub profile widgets and cards</li>
              <li style={{ marginBottom: '8px' }}>Create AI-powered README files for your profile</li>
              <li style={{ marginBottom: '8px' }}>Process payments and manage subscriptions</li>
              <li style={{ marginBottom: '8px' }}>Improve our services and develop new features</li>
              <li style={{ marginBottom: '8px' }}>Communicate with you about updates and support</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              3. Data Storage and Security
            </h2>
            <p>
              We take reasonable measures to protect your information. Data is stored securely using
              industry-standard encryption. We use local storage in your browser to save preferences
              and usage statistics. We do not sell your personal information to third parties.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              4. Third-Party Services
            </h2>
            <p style={{ marginBottom: '12px' }}>We use the following third-party services:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>GitHub API:</strong> To fetch your profile data
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>Stripe:</strong> For secure payment processing
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>OpenAI:</strong> For AI-powered README generation
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>Vercel:</strong> For hosting and analytics
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#fff' }}>PostHog:</strong> For product analytics
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              5. Cookies and Tracking
            </h2>
            <p>
              We use essential cookies to maintain your session and preferences. We also use analytics
              cookies to understand how users interact with our service. You can disable cookies in your
              browser settings, though some features may not work properly.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              6. Your Rights
            </h2>
            <p style={{ marginBottom: '12px' }}>You have the right to:</p>
            <ul style={{ paddingLeft: '24px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>Access your personal data we hold</li>
              <li style={{ marginBottom: '8px' }}>Request correction of inaccurate data</li>
              <li style={{ marginBottom: '8px' }}>Request deletion of your data</li>
              <li style={{ marginBottom: '8px' }}>Opt out of marketing communications</li>
              <li style={{ marginBottom: '8px' }}>Withdraw consent at any time</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              7. Data Retention
            </h2>
            <p>
              We retain your data only as long as necessary to provide our services. Widget and card
              images are cached for 24 hours. Account data is retained until you delete your account
              or request data deletion.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              8. Children&apos;s Privacy
            </h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect personal
              information from children under 13. If you believe we have collected such information,
              please contact us immediately.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#fff', marginBottom: '16px' }}>
              10. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@gitskins.com" style={{ color: '#22c55e', textDecoration: 'none' }}>
                privacy@gitskins.com
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
          <Link href="/terms" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
            Terms of Service
          </Link>
          <Link href="/support" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
