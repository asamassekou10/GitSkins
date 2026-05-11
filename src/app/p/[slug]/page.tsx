import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { buildPublishedPortfolioHtml } from '@/lib/portfolio-builds';
import { absoluteUrl } from '@/lib/seo';

interface PublishedPortfolioPageProps {
  params: Promise<{ slug: string }>;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PublishedPortfolioPageProps): Promise<Metadata> {
  const { slug } = await params;
  const build = await db.portfolioBuild.findUnique({
    where: { publishedSlug: slug },
    select: { title: true, username: true, updatedAt: true },
  });

  if (!build) {
    return {};
  }

  const title = `${build.title} | GitSkins Portfolio`;
  const description = `A GitSkins-hosted developer portfolio for @${build.username}.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/p/${slug}`) },
    openGraph: {
      type: 'website',
      title,
      description,
      url: absoluteUrl(`/p/${slug}`),
      images: [`/api/premium-card?username=${encodeURIComponent(build.username)}&theme=studio&variant=persona`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/premium-card?username=${encodeURIComponent(build.username)}&theme=studio&variant=persona`],
    },
  };
}

export default async function PublishedPortfolioPage({ params }: PublishedPortfolioPageProps) {
  const { slug } = await params;
  const build = await db.portfolioBuild.findUnique({
    where: { publishedSlug: slug },
    select: {
      html: true,
      css: true,
    },
  });

  if (!build) {
    notFound();
  }

  return (
    <iframe
      title="Published GitSkins portfolio"
      srcDoc={buildPublishedPortfolioHtml(build)}
      sandbox=""
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        border: 0,
        background: '#000',
      }}
    />
  );
}
