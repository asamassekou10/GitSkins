export function sanitizePortfolioSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/^@/, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export function buildPublishedPortfolioHtml({
  html,
  css,
}: {
  html: string;
  css: string;
}) {
  const noIndexScript = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  const style = css ? `<style>${css}</style>` : '';
  const meta = [
    '<meta name="generator" content="GitSkins Portfolio Builder">',
    '<meta name="referrer" content="strict-origin-when-cross-origin">',
  ].join('');

  if (noIndexScript.includes('</head>')) {
    return noIndexScript.replace('</head>', `${meta}${style}</head>`);
  }

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${meta}${style}</head><body>${noIndexScript}</body></html>`;
}

export function portfolioBuildPayload<T extends {
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}>(build: T) {
  return {
    ...build,
    createdAt: build.createdAt.toISOString(),
    updatedAt: build.updatedAt.toISOString(),
    publishedAt: build.publishedAt?.toISOString() ?? null,
  };
}
