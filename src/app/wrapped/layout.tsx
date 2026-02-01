import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitHub Wrapped | GitSkins',
  description: 'Your AI-narrated year in code. See your GitHub year in review powered by Gemini 3 with Extended Thinking and Google Search grounding.',
  openGraph: {
    title: 'GitHub Wrapped | GitSkins',
    description: 'AI-narrated developer year in review with stats, personality analysis, and industry benchmarks.',
  },
};

export default function WrappedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
