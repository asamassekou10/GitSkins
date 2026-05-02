import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your GitSkins account, subscription, billing portal, and support options.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
