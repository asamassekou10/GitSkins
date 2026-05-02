import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Professional guides for improving GitHub profiles, README design, developer avatars, and profile widgets.',
  openGraph: {
    title: 'GitSkins Blog',
    description: 'Practical guides for better GitHub profiles, README design, avatar branding, and profile widgets.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
