import type { MetadataRoute } from 'next';

import { listMetas } from '@/app/blog/repo';
import { DOMAIN } from '@/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = `https://${DOMAIN}`;
  const posts = await listMetas();
  return [
    { url: `${base}/blog`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/colophon`, changeFrequency: 'yearly', priority: 0.3 },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.date.toString(),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ];
}
