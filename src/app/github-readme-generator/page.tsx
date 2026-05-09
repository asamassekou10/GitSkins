import type { Metadata } from 'next';
import { SeoLandingPage } from '@/components/seo/SeoLandingPage';
import { seoLandingPages } from '@/lib/seo-content/landing-pages';

const content = seoLandingPages['github-readme-generator'];

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  keywords: content.keywords,
  alternates: { canonical: `/${content.slug}` },
  openGraph: {
    title: content.title,
    description: content.description,
    url: `/${content.slug}`,
    images: [content.preview.src],
  },
  twitter: {
    card: 'summary_large_image',
    title: content.title,
    description: content.description,
    images: [content.preview.src],
  },
};

export default function GitHubReadmeGeneratorPage() {
  return <SeoLandingPage content={content} />;
}
