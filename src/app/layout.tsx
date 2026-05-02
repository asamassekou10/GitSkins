import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google';
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

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

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
  description: 'Transform your GitHub profile with premium widgets, AI-generated READMEs, profile intelligence, avatars, and portfolio case studies.',
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
        url: '/opengraph-image',
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
    images: ['/opengraph-image'],
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
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}>
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
