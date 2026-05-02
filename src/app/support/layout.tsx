import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help with GitSkins cards, avatars, README embeds, Pro billing, subscriptions, and feature requests.',
  openGraph: {
    title: 'GitSkins Support',
    description: 'Support for GitSkins cards, avatars, README embeds, billing, and Pro access.',
  },
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
