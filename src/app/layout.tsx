import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Suspense } from 'react';
import { PostHogProvider } from '@/components/providers/posthog-provider';
import { SessionProvider } from '@/components/providers/session-provider';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { siteConfig } from '@/config/site';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SessionProvider>
          <PostHogProvider>
            <Suspense fallback={null}>
              <AnalyticsProvider>
                <main className="animate-fade-in">
                  {children}
                </main>
              </AnalyticsProvider>
            </Suspense>
            <Analytics />
            <SpeedInsights />
          </PostHogProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
