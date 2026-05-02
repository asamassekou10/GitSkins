import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Avatar Studio',
  description: 'Generate theme-matched GitHub profile pictures, developer avatars, character styles, and high-resolution exports.',
  openGraph: {
    title: 'GitSkins Avatar Studio',
    description: 'Create profile pictures that match your GitHub cards, themes, and developer identity.',
  },
};

export default function AvatarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
