import type { MetadataRoute } from 'next';
import { PAGE_URL } from '@/lib/paths';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${PAGE_URL}sitemap.xml`,
  };
}
