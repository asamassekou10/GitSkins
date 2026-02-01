import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitSkins — Join the Waitlist',
  description: 'AI-powered GitHub profile cards, Wrapped, daily dev cards, repo visualizer, and 20 premium themes. Built on Gemini 3. Join the waitlist for early access.',
  openGraph: {
    title: 'GitSkins — Join the Waitlist',
    description: 'AI-powered GitHub profile cards, Wrapped, and daily dev cards. Built on Gemini 3.',
  },
};

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
