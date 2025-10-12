export default function robots() {
  const base = 'https://www.lagoonrebelwear.com';
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      // Blocca cart e account dalle SERP
      { userAgent: '*', disallow: ['/cart', '/account'] },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: 'www.lagoonrebelwear.com',
  };
}
