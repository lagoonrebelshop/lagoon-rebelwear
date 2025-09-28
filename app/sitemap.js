export default async function sitemap() {
  const base = 'https://www.lagoonrebelwear.com';
  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/search`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/cart`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${base}/cookies`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.1 },
  ];
}
