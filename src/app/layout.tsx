import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { PostHogProvider } from '@/components/providers/posthog-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'GitSkins - Beautiful GitHub README Widgets',
  description: 'Generate dynamic, custom-themed widgets for your GitHub profile. Stats, languages, streaks, and more.',
  keywords: 'GitHub, README, widgets, profile, stats, themes, developer',
  openGraph: {
    title: 'GitSkins - Beautiful GitHub README Widgets',
    description: 'Generate dynamic, custom-themed widgets for your GitHub profile.',
    type: 'website',
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
          {children}
          <Analytics />
          <SpeedInsights />
        </PostHogProvider>
      </body>
    </html>
  );
}
