import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitHub Wrapped | GitSkins',
  description: 'Your AI-narrated year in code with GitHub stats, personality analysis, and industry benchmarks.',
  openGraph: {
    title: 'GitHub Wrapped | GitSkins',
    description: 'AI-narrated developer year in review with stats, personality analysis, and industry benchmarks.',
  },
};

export default function WrappedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
