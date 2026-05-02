import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Profile Lab',
  description: 'Analyze your GitHub profile, find stronger positioning, recommend themes, and turn repositories into portfolio-ready stories.',
  openGraph: {
    title: 'GitSkins AI Profile Lab',
    description: 'AI tools for developer profile strategy, theme recommendations, portfolio stories, and GitHub positioning.',
  },
};

export default function AILayout({ children }: { children: React.ReactNode }) {
  return children;
}
