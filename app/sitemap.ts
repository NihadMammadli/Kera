import type { MetadataRoute } from 'next';
import { PAGE_URL } from '@/lib/paths';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: PAGE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1 },
  ];
}
