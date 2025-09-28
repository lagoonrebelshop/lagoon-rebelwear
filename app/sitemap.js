export default function sitemap() {
  const base = 'https://www.lagoonrebelwear.com';
  return [
    { url: `${base}/`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/search`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/cart`, lastModified: new Date().toISOString(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${base}/account`, lastModified: new Date().toISOString(), changeFrequency: 'monthly', priority: 0.4 },
  ];
}
