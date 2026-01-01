import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitSkins - GitHub Profile Card Generator',
  description: 'Generate dynamic, custom-themed GitHub profile cards',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
