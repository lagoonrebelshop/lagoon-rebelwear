export default async function sitemap() {
  const base = 'https://www.lagoonrebelwear.com';

  const staticRoutes = [
    '/',
    '/search',
    '/contact',
    '/privacy',
    '/cookies',
    '/terms',
  ];

  const now = new Date().toISOString();

  return staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority:
      path === '/'
        ? 1.0
        : path === '/search'
          ? 0.8
          : 0.5,
  }));
}