import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

type Props = {
  params: Promise<{ username: string }>;
};

/**
 * Dynamic metadata for showcase pages
 * Generates SEO-friendly metadata with dynamic OG images
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username: rawUsername } = await params;
  const username = rawUsername.startsWith('@')
    ? rawUsername.slice(1)
    : rawUsername;

  const title = `${username}'s GitHub Profile | GitSkins`;
  const description = `View ${username}'s beautiful GitHub profile card with custom themes. Generate your own at GitSkins.`;
  const ogImageUrl = `${siteConfig.url}/api/og?username=${username}&theme=satan`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${siteConfig.url}/showcase/${username}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${username}'s GitSkins Profile`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${siteConfig.url}/showcase/${username}`,
    },
  };
}

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
