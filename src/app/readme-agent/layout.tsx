import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live README Agent',
  description:
    'Watch Gemini 3 Pro think, draft, and refine your GitHub README in real-time with Extended Thinking and streaming.',
  openGraph: {
    title: 'Live README Agent | GitSkins',
    description:
      'AI-powered README generation with real-time streaming. Watch Gemini 3 reason through your profile and generate a polished README.',
  },
};

export default function ReadmeAgentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
