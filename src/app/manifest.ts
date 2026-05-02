import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GitSkins',
    short_name: 'GitSkins',
    description: 'Premium GitHub profile cards, avatars, README assets, and AI profile tools.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-mark.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
