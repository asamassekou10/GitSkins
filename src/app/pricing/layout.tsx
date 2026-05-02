import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Compare GitSkins Free and Pro plans for premium GitHub profile cards, avatars, themes, AI tools, and README generation.',
  openGraph: {
    title: 'GitSkins Pricing',
    description: 'Start free, then upgrade for premium themes, avatars, AI profile tools, and unlimited README generation.',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
