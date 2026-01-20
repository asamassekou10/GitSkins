import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Suspense } from 'react';
import { PostHogProvider } from '@/components/providers/posthog-provider';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { siteConfig } from '@/config/site';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'GitSkins - Beautiful GitHub README Widgets',
    template: '%s | GitSkins',
  },
  description: 'Generate dynamic, custom-themed widgets for your GitHub profile. Stats, languages, streaks, and more. Free, open-source, and beautiful.',
  keywords: ['GitHub', 'README', 'widgets', 'profile', 'stats', 'themes', 'developer', 'open source', 'GitHub profile', 'contribution graph'],
  authors: [{ name: 'GitSkins' }],
  creator: 'GitSkins',
  publisher: 'GitSkins',
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: 'GitSkins',
    title: 'GitSkins - Beautiful GitHub README Widgets',
    description: 'Generate dynamic, custom-themed widgets for your GitHub profile. Stats, languages, streaks, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GitSkins - GitHub Profile Widgets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitSkins - Beautiful GitHub README Widgets',
    description: 'Generate dynamic, custom-themed widgets for your GitHub profile.',
    images: ['/og-image.png'],
    creator: '@gitskins',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 0;
            background: #0a0a0a;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          ::selection {
            background: #ff450040;
          }
          input:focus {
            border-color: #ff4500 !important;
          }
          button:hover {
            opacity: 0.9;
          }
          img {
            max-width: 100%;
          }
        `}</style>
      </head>
      <body>
        <PostHogProvider>
          <Suspense fallback={null}>
            <AnalyticsProvider>
              {children}
              <FeedbackWidget />
            </AnalyticsProvider>
          </Suspense>
          <Analytics />
          <SpeedInsights />
        </PostHogProvider>
      </body>
    </html>
  );
}
