import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Card Studio',
  description: 'Design premium GitHub README cards with live previews, themes, avatars, Markdown embeds, and HTML snippets.',
  openGraph: {
    title: 'GitSkins Card Studio',
    description: 'Create premium GitHub profile cards and copy-ready README embeds.',
  },
};

export default function CardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
