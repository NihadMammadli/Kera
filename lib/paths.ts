/**
 * GitHub Pages serves a project repo from a sub-path named after the repo
 * (/Kera), so every absolute asset URL on the page needs that prefix.
 * `next/link`, `next/image` and `app/icon.svg` get it from `basePath`
 * automatically; a raw `<img src>` and anything in metadata does not, so those
 * go through `asset()`.
 *
 * Both values are set at build time by .github/workflows/deploy.yml. Locally
 * they are empty, which is exactly right for `next dev`.
 */
const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** '' at a domain root, '/Kera' under github.io/Kera. Never a trailing slash. */
export const BASE_PATH = raw === '/' ? '' : raw.replace(/\/+$/, '');

/** Absolute origin, no path. og:image and JSON-LD add the base path to it. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kera.brussels').replace(/\/+$/, '');

/** The page itself — the origin is not the site when the site lives under a sub-path. */
export const PAGE_URL = `${SITE_URL}${BASE_PATH}/`;

/** Prefix a public/ path. `asset('/img/og.jpg')` → '/Kera/img/og.jpg' */
export function asset(path: string) {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}
