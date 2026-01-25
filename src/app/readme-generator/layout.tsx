import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI README Generator | GitSkins',
  description: 'Create a stunning GitHub profile README in seconds with AI assistance. Generate professional, customizable README.md files for your GitHub profile.',
  keywords: [
    'GitHub README generator',
    'profile README',
    'AI README',
    'GitHub profile',
    'markdown generator',
    'developer profile',
  ],
  openGraph: {
    title: 'AI README Generator | GitSkins',
    description: 'Create a stunning GitHub profile README in seconds with AI assistance.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI README Generator | GitSkins',
    description: 'Create a stunning GitHub profile README in seconds with AI assistance.',
  },
};

export default function ReadmeGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
