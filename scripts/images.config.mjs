/**
 * Every picture the site ships, and how it is cut from its original.
 *
 * The originals are not in git — the client's photos live in docs/images/
 * (ignored) and the reference photographs in images/. `npm run images` reads
 * them and writes public/img/<name>-<width>.webp plus content/images.json,
 * which the components use to build srcset. To replace a picture, drop the new
 * original in place under the same `src` and run it again.
 *
 * aspect  width ÷ height to cut to, matching the frame it is shown in, so a
 *         phone downloads only the pixels it displays. null keeps the original.
 * focus   [x, y] from 0 to 1 — which part of the original to keep when cutting.
 * box     an exact [left, top, width, height] in original pixels, for when a
 *         part of the photo must not ship at all.
 */
export const WIDTHS = [480, 800, 1200];

export const RECIPES = [
  /* the first screen: kept from the pre-opening site, as the client asked */
  { name: 'ridge', src: 'images/f5f79719ec55c1c19bba17dde6b079de.jpg', aspect: null },

  /* About Us arch (3 : 4.6 on a computer, 3 : 4 on a phone) */
  { name: 'georgian-table', src: 'docs/images/georgianfood.kera.jpg', aspect: 0.68, focus: [0.5, 0.5] },

  /* Our Cuisine arch, between the two lists of dishes */
  { name: 'kitchen-pan', src: 'docs/images/food.kera.jpg', aspect: 0.78, focus: [0.5, 0.62] },

  /* the three spaces, 3 : 4 arches */
  { name: 'main-room', src: 'docs/images/mainspace.kera.jpg', aspect: 0.75, focus: [0.55, 0.5] },
  { name: 'private-room', src: 'docs/images/private room.kera.jpg', aspect: 0.75, focus: [0.5, 0.5] },
  { name: 'terrace', src: 'docs/images/terrace.kera.jpg', aspect: 0.75, focus: [0.45, 0.5] },

  /* the closing arch. The wrapping paper and the cloth in the lower third
     carry another restaurant's printed branding, so the cut stops above them. */
  { name: 'wine-pour', src: 'docs/images/wine.kera.jpg', box: [470, 0, 700, 980] },
];
