import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

/**
 * Sitemap generation for SEO
 * 
 * Automatically generates sitemap.xml for search engines
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/showcase`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  // Popular showcase pages (you can expand this with actual popular usernames)
  const popularUsers = [
    'octocat',
    'torvalds',
    'gaearon',
    'sindresorhus',
    'tj',
  ];

  const showcasePages: MetadataRoute.Sitemap = popularUsers.map((username) => ({
    url: `${baseUrl}/showcase/${username}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...showcasePages];
}
