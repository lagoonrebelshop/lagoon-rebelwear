export default function sitemap() {
  const now = new Date();
  return [
    { url: 'https://www.lagoonrebelwear.com/',      lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: 'https://www.lagoonrebelwear.com/search', lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://www.lagoonrebelwear.com/cart',   lastModified: now, changeFrequency: 'weekly',  priority: 0.5 },
    { url: 'https://www.lagoonrebelwear.com/account',lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
