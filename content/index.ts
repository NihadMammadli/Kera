/**
 * The site's content, loaded from content/site.json.
 *
 * Nothing in app/ or components/ should contain a user-visible string. If you
 * are about to type one, it belongs in the JSON — and therefore in the client's
 * workbook, which is the only file they ever edit.
 *
 * The JSON is written by `npm run content:update <workbook.xlsx>` and checked
 * by `npm run content:check`, which also runs before every build.
 */
import data from './site.json';
import manifest from './images.json';

export type TextPath = keyof typeof data.text;

/** One string from the content file. Missing or empty reads as ''. */
export const t = (path: TextPath): string => (data.text[path] ?? '').trim();

/** True when the client has actually filled a field in. */
export const has = (path: TextPath): boolean => t(path).length > 0;

export type MenuItem = { name: string; ka: string; text: string; price: string };
export type MenuCategory = { name: string; ka: string; items: MenuItem[] };
export type Room = { name: string; meta: string; text: string; image: string; imageAlt: string };
export type Dish = { side: 'fire' | 'table'; latin: string; ka: string; icon: string; text: string };
export type Word = { ka: string; latin: string; gloss: string };
export type Picture = { file: string; alt: string };
export type Photo = { name: string; widths: number[]; width: number; height: number };

type Row = MenuItem & { category: string; categoryKa: string };

/* Menu rows are flat in the file so the client can add a category by typing
   one. Group them here, keeping the order each category first appeared in. */
function groupMenu(): MenuCategory[] {
  const out: MenuCategory[] = [];
  for (const r of data.menu as Row[]) {
    if (!r.category?.trim() || !r.name?.trim()) continue;
    const name = r.category.trim();
    let cat = out.find((c) => c.name === name);
    if (!cat) {
      cat = { name, ka: (r.categoryKa ?? '').trim(), items: [] };
      out.push(cat);
    }
    if (!cat.ka && r.categoryKa?.trim()) cat.ka = r.categoryKa.trim();
    cat.items.push({
      name: r.name.trim(),
      ka: (r.ka ?? '').trim(),
      text: (r.text ?? '').trim(),
      price: String(r.price ?? '').trim(),
    });
  }
  return out;
}

const handle = t('contact.instagram').replace(/^@/, '');
const phone = t('contact.phone');

export const content = {
  text: data.text,
  images: data.images as Record<string, Picture>,

  /* every link is a section of the one page, in the order the page runs */
  nav: (['about', 'cuisine', 'menu', 'spaces', 'visit'] as const)
    .map((key) => ({ key, label: t(`nav.${key}` as TextPath), hash: `#${key}` }))
    .filter((n) => n.label),

  words: (data.words as Word[]).filter((w) => w.ka && w.latin),
  /* a space without a photograph is not shown at all */
  rooms: (data.rooms as Room[]).filter((r) => r.name?.trim() && r.image?.trim()),
  kitchen: {
    fire: (data.kitchen as Dish[]).filter((d) => d.side === 'fire'),
    table: (data.kitchen as Dish[]).filter((d) => d.side !== 'fire'),
  },

  menu: groupMenu(),
  menuIsDraft: t('menu.isDraft').toLowerCase() === 'yes',
  menuColumns: t('menu.columns') === '1' ? 1 : 2,
  currency: t('menu.currency'),

  phone,
  /* "+32 470 15 51 08" → "tel:+32470155108" */
  tel: phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '',
  instagram: handle,
  instagramUrl: `https://instagram.com/${handle}`,
  mapsUrl: t('address.mapsUrl'),
} as const;

/** "6.50 glass / 30.00 bottle" → "€6.50 glass · €30.00 bottle" */
export function price(raw: string): string {
  if (!raw) return '';
  return raw.replace(/\d+(?:[.,]\d+)?/g, (n) => `${content.currency}${n}`).replace(/\s*\/\s*/g, ' · ');
}

/** Picture slot, or null when the client has not named a file. */
export function picture(key: string): Picture | null {
  const p = content.images[key];
  return p && p.file?.trim() ? { file: p.file.trim(), alt: (p.alt ?? '').trim() } : null;
}

/** The cut sizes of a picture, from content/images.json (`npm run images`). */
export function photo(name: string): Photo | null {
  const m = (manifest as Record<string, Omit<Photo, 'name'>>)[name];
  return m ? { name, ...m } : null;
}

/* --------------------------------------------------------- opening hours */

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export type HoursSpec = { dayOfWeek: string[]; opens: string; closes: string };

/**
 * Reads the client's hours for Google's structured data. Understands lines of
 * the form "Monday–Friday: 12:00–15:00 and 18:00–00:00" or "Sunday: Closed";
 * anything else (a note about the kitchen) is shown on the page but skipped
 * here, so a line Google cannot read is never guessed at.
 */
export function openingHours(): HoursSpec[] {
  const out: HoursSpec[] = [];
  for (const line of t('contact.hours').split('\n')) {
    const m = line.match(/^\s*([A-Za-z]+)(?:\s*[–-]\s*([A-Za-z]+))?\s*:\s*(.+)$/);
    if (!m) continue;
    const from = DAYS.findIndex((d) => d.toLowerCase().startsWith(m[1].toLowerCase().slice(0, 3)));
    const to = m[2] ? DAYS.findIndex((d) => d.toLowerCase().startsWith(m[2].toLowerCase().slice(0, 3))) : from;
    if (from < 0 || to < from) continue;
    const days = DAYS.slice(from, to + 1).map((d) => `https://schema.org/${d}`);
    for (const r of m[3].matchAll(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/g)) {
      out.push({ dayOfWeek: days, opens: r[1].padStart(5, '0'), closes: r[2].padStart(5, '0') });
    }
  }
  return out;
}
