import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Dev Card | GitSkins',
  description: 'Generate a shareable daily dev card for #BuildInPublic. Show what you built today with AI-powered summaries and premium themes.',
  openGraph: {
    title: 'Daily Dev Card | GitSkins',
    description: 'Generate a shareable daily dev card for #BuildInPublic.',
  },
};

export default function DailyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
