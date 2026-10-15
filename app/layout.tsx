import type { Metadata, Viewport } from 'next';
import { Marcellus, Alegreya_Sans, Noto_Serif_Georgian } from 'next/font/google';
import { t, picture } from '@/content';
import { asset, SITE_URL } from '@/lib/paths';
import './globals.css';

const display = Marcellus({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const sans = Alegreya_Sans({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const georgian = Noto_Serif_Georgian({
  subsets: ['georgian'],
  display: 'swap',
  variable: '--font-georgian',
});

const og = picture('og');
const ogImage = og ? asset(`/img/${og.file}`) : undefined;

/* What every page shares. Each page sets its own title, description and
   canonical; the share card and site name come from here. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: t('seo.title'),
  description: t('seo.description'),
  openGraph: {
    type: 'website',
    siteName: t('brand.name'),
    locale: 'en_GB',
    images: og && ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: og.alt }] : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    images: ogImage ? [ogImage] : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: '#0f1a2e',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable} ${georgian.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: no-preference)').matches)return;d.classList.add('motion');setTimeout(function(){if(d.dataset.fired!=='true')d.classList.remove('motion')},3000)}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        {/* The direction contract. React drops JSX comments at build time, so it
            ships as a real HTML comment the built output can be grepped for. */}
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html: `<!--\nTHESIS: A restaurant whose name means hearth opens on a wall, not a
          plate. Every photograph is cut into a Georgian arch and every arch
          fires on scroll, so the visitor walks through doorways into Georgia
          instead of scrolling past a menu. Refuses the dark-hero-plus-reserve-
          button template the category ships by default.
          OWN-WORLD: Georgian church interior. Drenched fresco blue #0f1a2e
          plaster, cinnabar #9b2f26, ochre #c07c35, malachite #35604c, chalk
          ink #efe5d2. Gold #e8c177 is rationed by law to gilding: the live
          action, the arch as it fires, today's stage of the build, and the
          inscription band. Never a label, an icon or a heading. Lapidary
          display over humanist sans; drawn line-work, never stock chrome;
          one lamp low on the left.
          STORY: This is Georgian, it is real, it is not finished — and being
          early is the offer. Understand kera, want the table, follow the build.
          FIRST VIEWPORT: Full-bleed plaster. A colossal arch centre-stage
          holding the Caucasus ridge, gilt outline writing itself in. KERA in
          carved capitals at 16vw across the arch's base, letters in front,
          image behind, one object. Address and opening season in the corners;
          the only gold button sits in the nav.
          FORM: The Fired Arch — candidate 4 of 7, seed key fddb4283.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.\n-->`,
          }}
        />
        <a className="skip" href="#main">
          {t('a11y.skip')}
        </a>
        {children}
      </body>
    </html>
  );
}
