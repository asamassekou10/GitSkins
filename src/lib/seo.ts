import { siteConfig } from '@/config/site';

export function absoluteUrl(path = '/') {
  if (path.startsWith('http')) {
    return path;
  }

  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GitSkins',
    url: siteConfig.url,
    logo: absoluteUrl('/logo-mark.png'),
    sameAs: [
      'https://github.com/asamassekou10/GitSkins',
      'https://chromewebstore.google.com/detail/gitskins/mioohaiefojpnpjlfloobapajemmgmcn',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'gitskinspro@gmail.com',
      contactType: 'customer support',
    },
  };
}

export function softwareApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GitSkins',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web, ChromeOS, macOS, Windows, Linux',
    url: siteConfig.url,
    image: absoluteUrl('/opengraph-image'),
    description: 'GitHub profile tools for README generation, profile cards, themed avatars, profile skins, and browser extension workflows.',
    offers: [
      { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      { '@type': 'Offer', name: 'Pro Monthly', price: '9', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      { '@type': 'Offer', name: 'Pro Lifetime', price: '49', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    ],
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
