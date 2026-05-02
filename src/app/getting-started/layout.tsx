import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Getting Started',
  description: 'Learn how to create a polished GitHub profile kit with GitSkins cards, avatars, widgets, and README embeds.',
  openGraph: {
    title: 'GitSkins Getting Started',
    description: 'A practical guide to building a polished GitHub profile with cards, avatars, and README widgets.',
  },
};

export default function GettingStartedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
