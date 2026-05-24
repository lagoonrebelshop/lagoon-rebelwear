export default function robots() {
  const base = 'https://www.lagoonrebelwear.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account',
          '/cart',
          '/checkout',
          '/login',
          '/signup',
          '/reset-password',
          '/update-password',
          '/auth',
          '/dev',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: 'www.lagoonrebelwear.com',
  };
}