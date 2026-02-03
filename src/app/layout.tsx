import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Suspense } from 'react';
import { PostHogProvider } from '@/components/providers/posthog-provider';
import { SessionProvider } from '@/components/providers/session-provider';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { Navigation } from '@/components/landing/Navigation';
import { CommandPaletteWrapper } from '@/components/CommandPaletteWrapper';
import { siteConfig } from '@/config/site';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'GitSkins - AI-Powered GitHub Profile Tools',
    template: '%s | GitSkins',
  },
  description: 'Transform your GitHub profile with AI. Dynamic widgets, AI-generated READMEs, profile intelligence, and portfolio case studies. Powered by Google Gemini.',
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
    title: 'GitSkins - AI-Powered GitHub Profile Tools',
    description: 'Transform your GitHub profile with AI. Dynamic widgets, AI-generated READMEs, profile intelligence, and portfolio case studies.',
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
    title: 'GitSkins - AI-Powered GitHub Profile Tools',
    description: 'Transform your GitHub profile with AI. Widgets, READMEs, profile intelligence, and portfolio case studies.',
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
        <link rel="preconnect" href="https://fonts.cdnfonts.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <SessionProvider>
          <PostHogProvider>
            <Suspense fallback={null}>
              <AnalyticsProvider>
                <Navigation />
                <main className="animate-fade-in">
                  {children}
                </main>
              </AnalyticsProvider>
            </Suspense>
            <CommandPaletteWrapper />
            <Analytics />
            <SpeedInsights />
          </PostHogProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
