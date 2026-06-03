import type { MetadataRoute } from 'next';

import { DOMAIN } from '@/config';

export default function robots(): MetadataRoute.Robots {
  const base = `https://${DOMAIN}`;
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${base}/sitemap.xml`,
  };
}
