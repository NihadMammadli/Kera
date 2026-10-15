import type { Metadata } from 'next';
import { Band } from '@/components/Band';
import { Foot } from '@/components/Foot';
import { Hero } from '@/components/Hero';
import { ArchDefs } from '@/components/Icons';
import { Kitchen } from '@/components/Kitchen';
import { Menu } from '@/components/Menu';
import { Motion } from '@/components/Motion';
import { NameSection } from '@/components/NameSection';
import { Nav } from '@/components/Nav';
import { Rooms } from '@/components/Rooms';
import { Visit } from '@/components/Visit';
import { content, t, openingHours, picture } from '@/content';
import { asset, PAGE_URL, SITE_URL } from '@/lib/paths';

const og = picture('og');
const ogImage = og && {
  url: `${SITE_URL}${asset(`/img/${og.file}`)}`,
  width: 1200,
  height: 630,
  type: 'image/jpeg',
  alt: og.alt,
};

/* The whole share card, here and only here. Next does not merge a page's
   openGraph into the layout's — it replaces it — so a partial one here once
   dropped the image, and WhatsApp showed a bare link. */
export const metadata: Metadata = {
  title: t('seo.title'),
  description: t('seo.description'),
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    siteName: t('brand.name'),
    locale: 'en_GB',
    title: t('seo.title'),
    description: t('seo.description'),
    images: ogImage ? [ogImage] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: t('seo.title'),
    description: t('seo.description'),
    images: ogImage ? [ogImage.url] : undefined,
  },
};

/** Structured data, limited to what is actually true: no rating, no price band. */
function restaurantJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: t('brand.name'),
    description: t('seo.description'),
    url: PAGE_URL,
    servesCuisine: ['Georgian', 'Azerbaijani'],
    hasMenu: `${PAGE_URL}#menu`,
    ...(content.phone && { telephone: content.phone }),
    ...(content.book && { acceptsReservations: t('contact.bookingUrl') || true }),
    ...(t('contact.email') && { email: t('contact.email') }),
    ...(ogImage && { image: ogImage.url }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: t('address.street'),
      addressLocality: t('address.city'),
      addressCountry: 'BE',
    },
    openingHoursSpecification: openingHours().map((h) => ({ '@type': 'OpeningHoursSpecification', ...h })),
    sameAs: [content.instagramUrl],
    hasMap: content.mapsUrl,
  };
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }} />
      <ArchDefs />
      <Nav />
      <main id="main">
        <Hero />
        <Band />
        <NameSection />
        <Kitchen />
        <Menu />
        <Rooms />
        <Visit />
      </main>
      <Foot />
      <Motion />
    </>
  );
}
