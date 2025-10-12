export default async function sitemap() {
  const base = 'https://www.lagoonrebelwear.com';

  // Rotte statiche principali (aggiungi/modifica qui quando crei nuove pagine)
  const staticRoutes = [
    '/',
    '/search',
    '/contact',
    '/privacy',
    '/cookies',
    '/terms',
    '/login',
    '/signup',
    '/reset-password',
    '/update-password',
    '/account',
    '/cart',
  ];

  const now = new Date().toISOString();

  return staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1.0 : 0.7,
  }));
}
