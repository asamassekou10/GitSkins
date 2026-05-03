import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { blogPosts } from '@/app/blog/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/examples`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/readme-generator`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/cards`, lastModified: now, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${baseUrl}/readme-agent`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/ai`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/avatar`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/avatar/persona`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/extension`, lastModified: now, changeFrequency: 'monthly', priority: 0.78 },
    { url: `${baseUrl}/wrapped`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/daily`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/visualize`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/getting-started`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.68 },
    { url: `${baseUrl}/support`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  const popularUsers = [
    'octocat', 'torvalds', 'gaearon', 'sindresorhus', 'tj',
    'addyosmani', 'mrdoob', 'nicolo-ribaudo', 'yyx990803', 'antfu',
  ];

  const showcasePages: MetadataRoute.Sitemap = popularUsers.map((username) => ({
    url: `${baseUrl}/showcase/${username}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const wrappedPages: MetadataRoute.Sitemap = popularUsers.map((username) => ({
    url: `${baseUrl}/wrapped/${username}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.65,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated),
    changeFrequency: 'monthly' as const,
    priority: 0.62,
  }));

  return [...staticPages, ...showcasePages, ...wrappedPages, ...blogPages];
}
