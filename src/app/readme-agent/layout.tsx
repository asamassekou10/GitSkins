import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live README Agent',
  description:
    'Watch GitSkins draft, refine, and stream a polished GitHub README in real time.',
  openGraph: {
    title: 'Live README Agent | GitSkins',
    description:
      'AI-powered README generation with real-time streaming and profile-aware refinement.',
  },
};

export default function ReadmeAgentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
